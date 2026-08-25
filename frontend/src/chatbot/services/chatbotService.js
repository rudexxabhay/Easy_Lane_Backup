import {
  readConversationMeta,
  startAssistantConversation,
  submitAssistantQuestion,
} from '../../ai/assistantClient.js';
import { CHATBOT_CONFIG } from '../config/chatbotConfig.js';
import { detectLanguage } from '../utils/detectLanguage.js';
import { buildAssistantErrorMessage, createMessage, sanitizeUserMessage } from '../utils/chatbotHelpers.js';

export async function ensureConversationStarted() {
  const meta = readConversationMeta();
  if (meta.conversationId) return meta;
  await startAssistantConversation({ entryPoint: 'assistant-widget', source: 'widget' }).catch(() => {});
  return readConversationMeta();
}

export function buildUserMessage(rawQuestion, type = 'text') {
  const question = sanitizeUserMessage(rawQuestion);
  if (!question) return null;
  return createMessage({
    id: `user-${Date.now()}`,
    role: 'user',
    content: question,
    type,
  });
}

export async function processChatMessage(rawQuestion, { messageType = 'text', history = [] } = {}) {
  const question = sanitizeUserMessage(rawQuestion);
  if (!question) {
    return { ok: false, reason: 'empty' };
  }

  const language = detectLanguage(question);

  await ensureConversationStarted();

  try {
    const response = await submitAssistantQuestion(question, {
      messageType,
      metadata: { source: 'widget' },
    });
    const answerText = response?.answer?.messageText || response?.answer?.text || response?.message || '';
    const responseSource = String(response?.source || response?.match?.matchType || 'error');
    return {
      ok: true,
      language: response?.language || language,
      assistantMessage: createMessage({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answerText || CHATBOT_CONFIG.fallbackMessages?.[language] || CHATBOT_CONFIG.defaultFallbackMessage,
        type: responseSource === 'error' ? 'error' : 'text',
        ctaLabel: response?.answer?.ctaLabel || '',
        ctaTarget: response?.answer?.ctaTarget || '',
        source: responseSource,
        aiUsed: response?.aiUsed === true,
        fallbackUsed: response?.fallbackUsed === true,
        intent: response?.intent || '',
        confidence: Number(response?.match?.confidence || 0),
      }),
    };
  } catch {
    return {
      ok: true,
      language,
      assistantMessage: buildAssistantErrorMessage(language, CHATBOT_CONFIG.fallbackMessages?.[language]),
    };
  }
}
