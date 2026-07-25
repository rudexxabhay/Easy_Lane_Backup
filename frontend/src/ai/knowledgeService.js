import { api } from '../lib/api.js';
import { EASY_AI_KNOWLEDGE } from './knowledge.js';
import { normalizeText } from './knowledgeEngine.js';

const CACHE_KEY = 'easy-lane-ai-knowledge-cache-v2';

function readCache() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(CACHE_KEY) || 'null');
    const entries = Array.isArray(stored?.entries) ? stored.entries : Array.isArray(stored) ? stored : [];
    return entries.filter(Boolean);
  } catch {
    return [];
  }
}

function writeCache(entries) {
  if (typeof window === 'undefined') return;
  try {
    const version = entries.reduce((latest, entry) => {
      const stamp = entry?.updatedAt ? new Date(entry.updatedAt).getTime() : 0;
      return Math.max(latest, stamp);
    }, 0);
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), version, entries }));
  } catch {
    // Ignore storage failures. The assistant still falls back to live or local data.
  }
}

export function getInitialKnowledgeEntries() {
  const cached = readCache();
  return cached.length ? cached : EASY_AI_KNOWLEDGE;
}

function normalizeEntries(entries = []) {
  return entries
    .filter(Boolean)
    .map((entry) => ({
      id: String(entry.id || entry._id || ''),
      category: String(entry.category || 'General').trim() || 'General',
      primaryQuestion: String(entry.primaryQuestion || '').trim(),
      alternativeQuestions: Array.isArray(entry.alternativeQuestions) ? entry.alternativeQuestions.map((item) => String(item || '').trim()).filter(Boolean) : [],
      keywords: Array.isArray(entry.keywords) ? entry.keywords.map((item) => String(item || '').trim()).filter(Boolean) : [],
      answer: String(entry.answer || '').trim(),
      ctaLabel: String(entry.ctaLabel || '').trim(),
      ctaTarget: String(entry.ctaTarget || '').trim(),
      priority: Number.isFinite(Number(entry.priority)) ? Number(entry.priority) : 100,
      isEnabled: entry.isEnabled !== false,
    }))
    .filter((entry) => entry.primaryQuestion && entry.answer && entry.isEnabled !== false)
    .sort((left, right) => Number(right.priority) - Number(left.priority));
}

export async function loadKnowledgeEntries() {
  try {
    const response = await api('/assistant/knowledge');
    const entries = normalizeEntries(response?.entries || []);
    writeCache(entries);
    return { entries, source: 'remote', version: response?.version || 0 };
  } catch {
    // fall through to cache/local fallback
  }

  const cached = normalizeEntries(readCache());
  if (cached.length) return { entries: cached, source: 'cache' };

  return { entries: normalizeEntries(EASY_AI_KNOWLEDGE), source: 'local' };
}

export function rememberKnowledgeEntries(entries) {
  const normalized = normalizeEntries(entries);
  if (normalized.length) writeCache(normalized);
  return normalized;
}

export function cacheKeyMatches(value = '') {
  return normalizeText(value);
}
