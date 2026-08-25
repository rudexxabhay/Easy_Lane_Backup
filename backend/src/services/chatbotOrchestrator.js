import { config } from '../config.js';
import { detectChatbotLanguage } from './chatbotLanguageService.js';
import {
  checkChatbotScope,
  getScopeRefusalMessage,
  getTemporaryErrorMessage,
  getUnknownKnowledgeMessage,
} from './chatbotScopeGuard.js';
import {
  detectChatbotIntent,
  getDemoIntentResponse,
  getGreetingMessage,
  getSupportIntentResponse,
} from './chatbotIntentService.js';
import { logChatbotEvent } from './chatbotLogger.js';
import { validateGroundedResponse } from './chatbotSafetyService.js';
import { generateGroundedResponse } from './grokService.js';
import { generateKnowledgeFallback } from './knowledgeFallbackService.js';
import { retrieveKnowledgeContext } from './knowledgeRetrievalService.js';
import { getProviderHealthStatus, recordProviderFailure, recordProviderSuccess } from './providerHealthService.js';
import { createId, sanitizeText } from './assistantService.js';

function buildChatResult({
  message = '',
  source = 'error',
  language = 'en',
  intent = 'knowledge_question',
  scopeAllowed = false,
  scopeReason = '',
  aiUsed = false,
  fallbackUsed = false,
  ctaLabel = '',
  ctaTarget = '',
  grokAttempted = false,
  grokSucceeded = false,
  providerFailureType = '',
  retrieval = null,
  requestId = '',
  latencyMs = 0,
} = {}) {
  const bestMatch = retrieval?.bestMatch || null;
  return {
    success: true,
    message,
    source,
    aiUsed,
    fallbackUsed,
    language,
    intent,
    scopeAllowed,
    scopeReason,
    ctaLabel,
    ctaTarget,
    knowledgeId: bestMatch?.recordId || '',
    knowledgeRecordIds: retrieval?.knowledgeRecordIds || [],
    score: Number(retrieval?.bestScore || 0),
    confidence: Number(retrieval?.confidence || 0),
    reliableMatch: retrieval?.reliable === true,
    grokAttempted,
    grokSucceeded,
    providerFailureType,
    requestId,
    latencyMs,
    retrieval,
  };
}

function logResult(result = {}, conversationId = '') {
  logChatbotEvent({
    requestId: result.requestId,
    conversationId,
    intent: result.intent,
    scopeResult: result.scopeReason,
    detectedLanguage: result.language,
    knowledgeMatchesCount: result.retrieval?.matchesCount || 0,
    knowledgeRecordIds: result.knowledgeRecordIds || [],
    score: result.score || 0,
    confidence: result.confidence || 0,
    reliableMatch: result.reliableMatch === true,
    grokCalled: result.grokSucceeded === true,
    providerAttempted: result.grokAttempted === true,
    providerFailureType: result.providerFailureType || '',
    fallbackUsed: result.fallbackUsed === true,
    fallbackType: result.fallbackUsed ? result.source : '',
    responseStatus: result.source,
    latencyMs: result.latencyMs || 0,
    source: result.source,
  });
}

export async function processChatMessage({
  question,
  history = [],
  conversationId = '',
} = {}) {
  const requestId = createId('chat');
  const startedAt = Date.now();
  const safeQuestion = sanitizeText(question, 5000);
  const detectedLanguage = detectChatbotLanguage(safeQuestion);
  const intentResult = detectChatbotIntent(safeQuestion);
  const baseContext = {
    requestId,
    language: detectedLanguage,
    intent: intentResult.intent,
  };

  if (intentResult.intent === 'greeting') {
    const result = buildChatResult({
      ...baseContext,
      message: getGreetingMessage(detectedLanguage),
      source: 'greeting',
      scopeAllowed: false,
      scopeReason: 'greeting',
      latencyMs: Date.now() - startedAt,
    });
    logResult(result, conversationId);
    return result;
  }

  if (intentResult.intent === 'book_demo') {
    const demo = getDemoIntentResponse(detectedLanguage);
    const result = buildChatResult({
      ...baseContext,
      message: demo.message,
      source: 'demo_intent',
      scopeAllowed: true,
      scopeReason: 'allowed_demo',
      ctaLabel: demo.ctaLabel,
      ctaTarget: demo.ctaTarget,
      latencyMs: Date.now() - startedAt,
    });
    logResult(result, conversationId);
    return result;
  }

  if (intentResult.intent === 'contact_support') {
    const support = getSupportIntentResponse(detectedLanguage);
    const result = buildChatResult({
      ...baseContext,
      message: support.message,
      source: 'support_intent',
      scopeAllowed: true,
      scopeReason: 'allowed_support',
      ctaLabel: support.ctaLabel,
      ctaTarget: support.ctaTarget,
      latencyMs: Date.now() - startedAt,
    });
    logResult(result, conversationId);
    return result;
  }

  const scope = checkChatbotScope(safeQuestion, history);

  if (!scope.inScope) {
    const result = buildChatResult({
      ...baseContext,
      intent: 'out_of_scope',
      message: getScopeRefusalMessage(detectedLanguage, scope.reason),
      source: 'scope_refusal',
      scopeAllowed: false,
      scopeReason: scope.reason,
      latencyMs: Date.now() - startedAt,
    });
    logResult(result, conversationId);
    return result;
  }

  const retrieval = await retrieveKnowledgeContext({
    question: safeQuestion,
    history,
    detectedLanguage,
    minScore: Number(config().chatbotKbMinScore || 220),
  });

  if (!retrieval.ok) {
    const result = buildChatResult({
      ...baseContext,
      message: getUnknownKnowledgeMessage(detectedLanguage),
      source: 'kb_unknown',
      scopeAllowed: true,
      scopeReason: scope.reason,
      retrieval,
      latencyMs: Date.now() - startedAt,
    });
    logResult(result, conversationId);
    return result;
  }

  const providerHealth = getProviderHealthStatus();
  if (!providerHealth.available) {
    try {
      const fallback = generateKnowledgeFallback({
        language: detectedLanguage,
        retrieval,
        conversationId,
      });

      if (fallback.ok) {
        const result = buildChatResult({
          ...baseContext,
          message: fallback.message,
          source: fallback.source,
          scopeAllowed: true,
          scopeReason: scope.reason,
          fallbackUsed: true,
          retrieval,
          providerFailureType: providerHealth.lastFailureType || 'provider_cooldown',
          latencyMs: Date.now() - startedAt,
        });
        logResult(result, conversationId);
        return result;
      }
    } catch {}
  }

  try {
    const grok = await generateGroundedResponse({
      question: safeQuestion,
      language: detectedLanguage,
      contextRecords: retrieval.topMatches,
      requestId,
    });

    const safety = validateGroundedResponse(grok.text);
    if (!safety.ok) {
      recordProviderFailure('invalid_response');
      const fallback = generateKnowledgeFallback({
        language: detectedLanguage,
        retrieval,
        conversationId,
      });
      if (fallback.ok) {
        const result = buildChatResult({
          ...baseContext,
          message: fallback.message,
          source: fallback.source,
          scopeAllowed: true,
          scopeReason: scope.reason,
          fallbackUsed: true,
          retrieval,
          grokAttempted: true,
          providerFailureType: 'invalid_response',
          latencyMs: Date.now() - startedAt,
        });
        logResult(result, conversationId);
        return result;
      }
      const result = buildChatResult({
        ...baseContext,
        message: getTemporaryErrorMessage(detectedLanguage),
        source: 'error',
        scopeAllowed: true,
        scopeReason: scope.reason,
        retrieval,
        grokAttempted: true,
        providerFailureType: 'invalid_response',
        latencyMs: Date.now() - startedAt,
      });
      logResult(result, conversationId);
      return result;
    }

    recordProviderSuccess();
    const result = buildChatResult({
      ...baseContext,
      message: grok.text,
      source: 'grok_grounded',
      scopeAllowed: true,
      scopeReason: scope.reason,
      aiUsed: true,
      retrieval,
      grokAttempted: true,
      grokSucceeded: true,
      latencyMs: Date.now() - startedAt,
    });
    logResult(result, conversationId);
    return result;
  } catch (error) {
    recordProviderFailure(error.category || 'provider_error');
    try {
      const fallback = generateKnowledgeFallback({
        language: detectedLanguage,
        retrieval,
        conversationId,
      });
      if (fallback.ok) {
        const result = buildChatResult({
          ...baseContext,
          message: fallback.message,
          source: fallback.source,
          scopeAllowed: true,
          scopeReason: scope.reason,
          fallbackUsed: true,
          retrieval,
          grokAttempted: true,
          providerFailureType: error.category || 'provider_error',
          latencyMs: Date.now() - startedAt,
        });
        logResult(result, conversationId);
        return result;
      }
    } catch {}

    const result = buildChatResult({
      ...baseContext,
      message: getTemporaryErrorMessage(detectedLanguage),
      source: 'error',
      scopeAllowed: true,
      scopeReason: scope.reason,
      retrieval,
      grokAttempted: true,
      providerFailureType: error.category || 'provider_error',
      latencyMs: Date.now() - startedAt,
    });
    logResult(result, conversationId);
    return result;
  }
}
