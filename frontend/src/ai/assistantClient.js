import { api } from '../lib/api.js';
import { EASY_AI_FALLBACK } from './knowledge.js';
import { findKnowledgeResponse } from './knowledgeEngine.js';

const VISITOR_KEY = 'easy-lane-ai-visitor-v1';
const SESSION_KEY = 'easy-lane-ai-session-v1';
const CONVERSATION_KEY = 'easy-lane-ai-conversation-meta-v1';

function generateId(prefix) {
  const suffix = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${suffix}`;
}

function safeRead(key, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
}

export function getVisitorId() {
  const stored = safeRead(VISITOR_KEY);
  if (stored) return stored;
  const next = generateId('visitor');
  safeWrite(VISITOR_KEY, next);
  return next;
}

export function getSessionId() {
  if (typeof window === 'undefined') return generateId('session');
  const stored = window.sessionStorage.getItem(SESSION_KEY);
  if (stored) return stored;
  const next = generateId('session');
  window.sessionStorage.setItem(SESSION_KEY, next);
  return next;
}

export function readConversationMeta() {
  try {
    return JSON.parse(safeRead(CONVERSATION_KEY, 'null')) || {};
  } catch {
    return {};
  }
}

export function writeConversationMeta(meta = {}) {
  safeWrite(CONVERSATION_KEY, JSON.stringify(meta));
}

function collectContext() {
  if (typeof window === 'undefined') return {};
  return {
    pageUrl: window.location.href,
    pageTitle: document.title,
    referrerUrl: document.referrer || '',
    deviceType: window.innerWidth <= 768 ? 'mobile' : window.innerWidth <= 1024 ? 'tablet' : 'desktop',
    browser: navigator.userAgent,
    operatingSystem: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  };
}

export function buildLocalMatch(question, knowledgeEntries = []) {
  return findKnowledgeResponse(question, knowledgeEntries) || { answer: EASY_AI_FALLBACK, matchType: 'fallback', score: 0 };
}

export async function startAssistantConversation(metadata = {}) {
  const storedMeta = readConversationMeta();
  const payload = {
    conversationId: storedMeta.conversationId || '',
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    metadata,
    ...collectContext(),
  };
  const response = await api('/assistant/conversations/start', { method: 'POST', body: payload });
  const meta = {
    conversationId: response?.conversation?.conversationId || storedMeta.conversationId || '',
    sessionId: payload.sessionId,
    visitorId: payload.visitorId,
  };
  writeConversationMeta(meta);
  return response;
}

export async function startOrResumeConversation({ conversationId = '', metadata = {} } = {}) {
  const storedMeta = readConversationMeta();
  if (conversationId || storedMeta.conversationId) {
    return startAssistantConversation(metadata);
  }
  return startAssistantConversation(metadata);
}

export async function trackAssistantEvent(eventType, details = {}) {
  const meta = readConversationMeta();
  if (!meta.conversationId || !eventType) return null;
  return api('/assistant/events', {
    method: 'POST',
    body: {
      conversationId: meta.conversationId,
      sessionId: meta.sessionId || getSessionId(),
      visitorId: meta.visitorId || getVisitorId(),
      eventType,
      ...collectContext(),
      ...details,
    },
  });
}

export async function submitAssistantQuestion(question, details = {}) {
  const meta = readConversationMeta();
  const payload = {
    conversationId: meta.conversationId || '',
    sessionId: meta.sessionId || getSessionId(),
    visitorId: meta.visitorId || getVisitorId(),
    question,
    ...collectContext(),
    ...details,
  };
  return api('/assistant/match', { method: 'POST', body: payload });
}

export async function saveAssistantMessage(payload) {
  const meta = readConversationMeta();
  return api('/assistant/messages', {
    method: 'POST',
    body: {
      conversationId: meta.conversationId || payload?.conversationId || '',
      sessionId: meta.sessionId || getSessionId(),
      visitorId: meta.visitorId || getVisitorId(),
      ...collectContext(),
      ...payload,
    },
  });
}

export async function endAssistantConversation(status = 'closed', metadata = {}) {
  const meta = readConversationMeta();
  if (!meta.conversationId) return null;
  return api('/assistant/end', {
    method: 'POST',
    body: {
      conversationId: meta.conversationId,
      sessionId: meta.sessionId || getSessionId(),
      visitorId: meta.visitorId || getVisitorId(),
      status,
      metadata,
      ...collectContext(),
    },
  });
}
