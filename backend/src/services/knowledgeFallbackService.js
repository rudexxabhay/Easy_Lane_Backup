import { normalizeText } from './assistantService.js';

const recentVariantUsage = new Map();
const MAX_CONTEXT_RECORDS = 3;
const MAX_RECENT_VARIANTS = 8;

function usageKey(conversationId = '', recordId = '') {
  return `${conversationId || 'public'}:${recordId || 'unknown'}`;
}

function getRecentVariantIds(conversationId = '', recordId = '') {
  return recentVariantUsage.get(usageKey(conversationId, recordId)) || [];
}

function rememberVariantId(conversationId = '', recordId = '', variantId = '') {
  if (!variantId) return;
  const key = usageKey(conversationId, recordId);
  const current = getRecentVariantIds(conversationId, recordId).filter((item) => item !== variantId);
  current.push(variantId);
  recentVariantUsage.set(key, current.slice(-MAX_RECENT_VARIANTS));
}

function normalizeLanguage(language = 'en') {
  if (language === 'hi') return 'HI';
  if (language === 'hinglish') return 'HINGLISH';
  return 'EN';
}

function isStrictContent(record = {}) {
  const combined = normalizeText([
    record.module,
    record.topic,
    record.subtopic,
    record.contentType,
    record.questionTrigger,
  ].filter(Boolean).join(' '));

  return ['privacy', 'policy', 'legal', 'terms', 'payment', 'finance', 'bill discounting'].some((term) => combined.includes(term));
}

function variantCandidates(record = {}, language = 'en') {
  const preferredLanguage = normalizeLanguage(language);
  const allVariants = Array.isArray(record.responseVariantEntries) ? record.responseVariantEntries : [];

  const exact = allVariants.filter((variant) => variant.active !== false && variant.language === preferredLanguage);
  const common = allVariants.filter((variant) => variant.active !== false && variant.language === 'ALL');
  return [...exact, ...common];
}

function pickVariant(record = {}, language = 'en', conversationId = '') {
  const candidates = variantCandidates(record, language);
  if (!candidates.length) return null;

  if (isStrictContent(record)) {
    const chosen = candidates[0];
    rememberVariantId(conversationId, record.recordId, chosen.variantId);
    return chosen;
  }

  const recent = getRecentVariantIds(conversationId, record.recordId);
  const unused = candidates.filter((variant) => !recent.includes(variant.variantId));
  const pool = unused.length ? unused : candidates;
  const chosen = pool[0];
  rememberVariantId(conversationId, record.recordId, chosen.variantId);
  return chosen;
}

function baseAnswerForLanguage(record = {}, language = 'en') {
  const recordLanguage = normalizeText(record.language || 'ALL');
  const preferred = normalizeText(normalizeLanguage(language));
  if (recordLanguage === preferred || recordLanguage === 'all') return String(record.approvedAnswer || '').trim();
  return String(record.approvedAnswer || '').trim();
}

function uniqueRecords(matches = []) {
  const seen = new Set();
  const list = [];
  for (const item of matches) {
    if (!item?.recordId || seen.has(item.recordId)) continue;
    seen.add(item.recordId);
    list.push(item);
  }
  return list;
}

function selectedRecords(matches = []) {
  const ranked = uniqueRecords(matches)
    .sort((left, right) => (right.score || 0) - (left.score || 0))
    .slice(0, MAX_CONTEXT_RECORDS);

  if (!ranked.length) return [];
  const topScore = Number(ranked[0].score || 0);
  return ranked.filter((item, index) => index === 0 || Number(item.score || 0) >= Math.max(260, topScore - 140));
}

function joinSentences(parts = [], language = 'en') {
  const clean = parts.map((item) => String(item || '').trim()).filter(Boolean);
  if (!clean.length) return '';
  if (clean.length === 1) return clean[0];

  if (language === 'hi') {
    return `${clean.slice(0, -1).join(' ')} ${clean.at(-1)}`.trim();
  }

  return clean.join(' ').trim();
}

export function generateKnowledgeFallback({
  language = 'en',
  retrieval = null,
  conversationId = '',
} = {}) {
  const records = selectedRecords(retrieval?.topMatches || []);
  if (!records.length) {
    return {
      ok: false,
      source: 'error',
      message: '',
      selectedRecordIds: [],
    };
  }

  const outputs = [];
  let usedVariant = false;

  for (const record of records) {
    const variant = pickVariant(record, language, conversationId);
    if (variant?.text) {
      outputs.push(variant.text);
      usedVariant = true;
      continue;
    }

    const baseAnswer = baseAnswerForLanguage(record, language);
    if (baseAnswer) outputs.push(baseAnswer);
  }

  const message = joinSentences(outputs, language);
  return {
    ok: Boolean(message),
    source: usedVariant ? 'kb_fallback_variant' : 'kb_fallback_base',
    message,
    selectedRecordIds: records.map((record) => record.recordId),
  };
}

