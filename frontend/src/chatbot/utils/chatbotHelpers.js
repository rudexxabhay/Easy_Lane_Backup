import { CHATBOT_CONFIG, CHATBOT_STORAGE_KEY } from '../config/chatbotConfig.js';

export function createMessage({
  id,
  role,
  content,
  timestamp = new Date().toISOString(),
  type = 'text',
  ctaLabel = '',
  ctaTarget = '',
  source = '',
  aiUsed = false,
  fallbackUsed = false,
  intent = '',
  confidence = 0,
}) {
  return {
    id,
    role,
    content,
    timestamp,
    type,
    ctaLabel,
    ctaTarget,
    source,
    aiUsed,
    fallbackUsed,
    intent,
    confidence,
  };
}

export function createInitialMessages() {
  return [
    createMessage({
      id: 'welcome',
      role: 'assistant',
      content: CHATBOT_CONFIG.welcomeMessage,
    }),
  ];
}

export function normalizeStoredMessage(message) {
  if (!message || typeof message !== 'object') return null;
  const role = message.role === 'user' ? 'user' : 'assistant';
  const content = String(message.content ?? message.text ?? '').trim();
  if (!content) return null;

  return createMessage({
    id: String(message.id || `${role}-${Date.now()}`),
    role,
    content,
    timestamp: message.timestamp || new Date().toISOString(),
    type: String(message.type || 'text'),
    ctaLabel: String(message.ctaLabel || ''),
    ctaTarget: String(message.ctaTarget || ''),
    source: String(message.source || ''),
    aiUsed: message.aiUsed === true,
    fallbackUsed: message.fallbackUsed === true,
    intent: String(message.intent || ''),
    confidence: Number(message.confidence || 0),
  });
}

export function restoreMessages() {
  if (typeof window === 'undefined') return createInitialMessages();
  try {
    const stored = JSON.parse(window.localStorage.getItem(CHATBOT_STORAGE_KEY) || 'null');
    const messages = Array.isArray(stored) ? stored.map(normalizeStoredMessage).filter(Boolean) : [];
    return messages.length ? messages : createInitialMessages();
  } catch {
    return createInitialMessages();
  }
}

export function persistMessages(messages) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage failures.
  }
}

export function sanitizeUserMessage(value) {
  return String(value || '').trim().slice(0, CHATBOT_CONFIG.maxMessageLength);
}

export function buildAssistantErrorMessage(language = 'en', content = '') {
  return createMessage({
    id: `assistant-error-${Date.now()}`,
    role: 'assistant',
    content: content || CHATBOT_CONFIG.fallbackMessages?.[language] || CHATBOT_CONFIG.defaultFallbackMessage,
    type: 'error',
  });
}
