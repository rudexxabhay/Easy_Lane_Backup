export function logChatbotEvent(event = {}) {
  const payload = {
    requestId: event.requestId || '',
    conversationId: event.conversationId || '',
    intent: event.intent || '',
    scopeResult: event.scopeResult || '',
    detectedLanguage: event.detectedLanguage || '',
    knowledgeMatchesCount: Number(event.knowledgeMatchesCount) || 0,
    knowledgeRecordIds: Array.isArray(event.knowledgeRecordIds) ? event.knowledgeRecordIds : [],
    score: Number(event.score) || 0,
    confidence: Number(event.confidence) || 0,
    reliableMatch: event.reliableMatch === true,
    grokCalled: event.grokCalled === true,
    providerAttempted: event.providerAttempted === true,
    providerFailureType: event.providerFailureType || '',
    fallbackUsed: event.fallbackUsed === true,
    fallbackType: event.fallbackType || '',
    responseStatus: event.responseStatus || '',
    latencyMs: Number(event.latencyMs) || 0,
    errorType: event.errorType || '',
    source: event.source || '',
  };
  console.info('[chatbot]', JSON.stringify(payload));
}
