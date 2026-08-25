import { AIKnowledgeEntry } from '../models/AIKnowledgeEntry.js';
import { normalizeText, tokenizeText } from './assistantService.js';

const MODULE_ALIAS_GROUPS = {
  easy_lane: ['easy lane', 'easylane', 'platform', 'overview'],
  tms: ['tms', 'transport', 'transportation management', 'dispatch', 'trip', 'booking'],
  fleet: ['fleet', 'fms', 'fleet management', 'vehicle', 'vehicles', 'truck', 'driver app'],
  finance: ['finance', 'bill discounting', 'invoice', 'payment', 'settlement'],
  vendor: ['vendor', 'vendor portal', 'vendor dashboard'],
  driver: ['driver', 'driver workflow', 'driver app', 'pod'],
  customer: ['customer', 'customer portal'],
  admin: ['admin'],
  support: ['contact support', 'support team', 'help desk'],
  demo: ['demo', 'book demo'],
  legal: ['privacy', 'policy', 'terms', 'legal'],
};

const GENERIC_SUPPORT_TERMS = new Set([
  'easy lane',
  'easylane',
  'platform',
  'product',
  'solution',
  'system',
  'support',
  'demo',
  'service',
]);

function overlapScore(leftTokens, rightTokens) {
  if (!leftTokens.length || !rightTokens.length) return 0;
  const rightSet = new Set(rightTokens);
  let hits = 0;
  for (const token of leftTokens) {
    if (rightSet.has(token)) hits += 1;
  }
  return hits / Math.max(leftTokens.length, rightTokens.length);
}

function containsPhrase(source, phrase) {
  const normalizedPhrase = normalizeText(phrase);
  return normalizedPhrase ? normalizeText(source).includes(normalizedPhrase) : false;
}

function detectModuleHints(question = '', recentContextText = '') {
  const combined = normalizeText([question, recentContextText].filter(Boolean).join(' '));
  const matches = new Set();

  for (const [group, aliases] of Object.entries(MODULE_ALIAS_GROUPS)) {
    if (aliases.some((alias) => containsPhrase(combined, alias))) {
      matches.add(group);
    }
  }

  const specificHints = Array.from(matches).filter((group) => !['easy_lane', 'support', 'demo', 'legal'].includes(group));
  if (specificHints.length) {
    matches.delete('easy_lane');
  }

  return matches;
}

function detectRecordModuleGroup(entry = {}) {
  const combined = normalizeText([
    entry.module,
    entry.topic,
    entry.subtopic,
    entry.contentType,
    ...(entry.keywords || []),
  ].filter(Boolean).join(' '));

  for (const [group, aliases] of Object.entries(MODULE_ALIAS_GROUPS)) {
    if (aliases.some((alias) => containsPhrase(combined, alias))) return group;
  }

  return 'easy_lane';
}

function normalizeKnowledgeRecord(entry = {}, detectedLanguage = 'en') {
  const record = entry.toObject ? entry.toObject() : entry;
  return {
    id: String(record._id || record.recordId || ''),
    recordId: String(record.recordId || ''),
    module: String(record.module || ''),
    topic: String(record.topic || ''),
    subtopic: String(record.subtopic || ''),
    contentType: String(record.contentType || ''),
    questionTrigger: String(record.questionTrigger || record.primaryQuestion || ''),
    approvedAnswer: String(record.approvedAnswer || record.answer || ''),
    keywords: Array.isArray(record.keywords) ? record.keywords.map((item) => String(item || '').trim()).filter(Boolean) : [],
    language: String(record.language || 'ALL'),
    priorityLabel: String(record.priorityLabel || 'Medium'),
    priorityRank: Number(record.priorityRank || 0),
    active: record.active !== false && record.isEnabled !== false,
    sourceOwner: String(record.sourceOwner || ''),
    responseVariants: collectVariantText(record, detectedLanguage),
    responseVariantEntries: collectVariantEntries(record),
    moduleGroup: detectRecordModuleGroup(record),
  };
}

function preferredLanguageWeight(recordLanguage = 'ALL', detectedLanguage = 'en') {
  const normalized = normalizeText(recordLanguage);
  if (normalized === 'all') return 35;
  if (detectedLanguage === 'en' && normalized === 'en') return 55;
  if (detectedLanguage === 'hi' && normalized === 'hi') return 55;
  if (detectedLanguage === 'hinglish' && normalized === 'hinglish') return 55;
  if (detectedLanguage === 'hinglish' && normalized === 'hi') return 24;
  if (detectedLanguage === 'hinglish' && normalized === 'en') return 20;
  return 0;
}

function priorityWeight(priorityLabel = 'Medium') {
  const normalized = normalizeText(priorityLabel);
  if (normalized === 'high') return 60;
  if (normalized === 'low') return 12;
  return 30;
}

function contextBoost(entry, recentContextText = '') {
  if (!recentContextText) return 0;
  const fields = [entry.module, entry.topic, entry.subtopic, entry.questionTrigger, ...(entry.keywords || [])].filter(Boolean);
  return fields.some((field) => containsPhrase(recentContextText, field) || containsPhrase(field, recentContextText)) ? 55 : 0;
}

function queryCoverage(queryTokens = [], entryTokens = []) {
  if (!queryTokens.length || !entryTokens.length) return 0;
  const entrySet = new Set(entryTokens);
  let hits = 0;
  for (const token of queryTokens) {
    if (entrySet.has(token)) hits += 1;
  }
  return hits / queryTokens.length;
}

function collectVariantText(entry, detectedLanguage) {
  return (Array.isArray(entry.responseVariants) ? entry.responseVariants : [])
    .filter((variant) => variant && variant.active !== false)
    .filter((variant) => {
      const normalized = normalizeText(variant.language || 'ALL');
      return normalized === 'all' || normalized === normalizeText(detectedLanguage === 'hi' ? 'HI' : detectedLanguage === 'hinglish' ? 'HINGLISH' : 'EN');
    })
    .sort((left, right) => Number(left.variantNo || 1) - Number(right.variantNo || 1))
    .map((variant) => String(variant.approvedResponseVariant || '').trim())
    .filter(Boolean)
    .slice(0, 4);
}

function collectVariantEntries(entry) {
  return (Array.isArray(entry.responseVariants) ? entry.responseVariants : [])
    .filter((variant) => variant && variant.active !== false)
    .sort((left, right) => Number(left.variantNo || 1) - Number(right.variantNo || 1))
    .map((variant) => ({
      variantId: String(variant.variantId || '').trim(),
      language: String(variant.language || 'ALL').trim() || 'ALL',
      variantNo: Number(variant.variantNo || 1) || 1,
      text: String(variant.approvedResponseVariant || '').trim(),
      active: variant.active !== false,
    }))
    .filter((variant) => variant.text);
}

function scoreKnowledgeEntry(entry, question, queryTokens, recentContextText = '', detectedLanguage = 'en', moduleHints = new Set()) {
  const trigger = normalizeText(entry.questionTrigger || '');
  const topic = normalizeText(entry.topic || '');
  const subtopic = normalizeText(entry.subtopic || '');
  const module = normalizeText(entry.module || '');
  const contentType = normalizeText(entry.contentType || '');
  const keywords = Array.isArray(entry.keywords) ? entry.keywords.map((item) => normalizeText(item)).filter(Boolean) : [];
  const answerTokens = tokenizeText(entry.approvedAnswer || '');
  const triggerTokens = tokenizeText(trigger);
  const topicTokens = tokenizeText([topic, subtopic, module, contentType].join(' '));
  const entryTokens = tokenizeText([trigger, topic, subtopic, module, contentType, keywords.join(' '), entry.approvedAnswer || ''].join(' '));

  let score = 0;
  let reason = 'weak';
  let matchedKeywords = [];
  const recordModuleGroup = entry.moduleGroup || detectRecordModuleGroup(entry);
  const moduleHintMatched = moduleHints.size ? moduleHints.has(recordModuleGroup) : true;
  const topicMatched = [topic, subtopic].some((field) => field && containsPhrase(question, field));
  const triggerExact = normalizeText(question) === trigger;
  const triggerPhraseMatched = containsPhrase(question, trigger) || containsPhrase(trigger, question);

  if (triggerExact) {
    score += 950;
    reason = 'exact_trigger';
  } else {
    const triggerOverlap = overlapScore(queryTokens, triggerTokens);
    const topicOverlap = overlapScore(queryTokens, topicTokens);
    const answerOverlap = overlapScore(queryTokens, answerTokens);
    const topicPhrase = [topic, subtopic, module].some((field) => field && (containsPhrase(question, field) || containsPhrase(field, question)));

    if (triggerPhraseMatched) {
      score += 420;
      reason = 'trigger_phrase';
    } else if (triggerOverlap >= 0.45) {
      score += 300 + Math.round(triggerOverlap * 140);
      reason = 'trigger_overlap';
    }

    if (topicPhrase) {
      score += 260;
      if (reason === 'weak') reason = 'topic_phrase';
    } else if (topicOverlap >= 0.35) {
      score += 180 + Math.round(topicOverlap * 120);
      if (reason === 'weak') reason = 'topic_overlap';
    }

    if (answerOverlap >= 0.25) {
      score += 40 + Math.round(answerOverlap * 100);
    }
  }

  for (const keyword of keywords) {
    const keywordTokens = tokenizeText(keyword);
    if (!keywordTokens.length) continue;
    const hit = containsPhrase(question, keyword) || containsPhrase(keyword, question) || overlapScore(queryTokens, keywordTokens) >= 0.5;
    if (hit) {
      matchedKeywords.push(keyword);
      const genericKeyword = GENERIC_SUPPORT_TERMS.has(keyword);
      score += genericKeyword ? 30 : 95 + keywordTokens.length * 6;
    }
  }

  const coverage = queryCoverage(queryTokens, entryTokens);
  if (moduleHintMatched && moduleHints.size) score += 260;
  if (!moduleHintMatched && moduleHints.size) score -= 320;
  score += Math.round(coverage * 120);
  score += preferredLanguageWeight(entry.language, detectedLanguage);
  score += priorityWeight(entry.priorityLabel);
  score += contextBoost(entry, recentContextText);

  const consistencyScore = Math.max(0, Math.min(1,
    (triggerExact ? 0.45 : triggerPhraseMatched ? 0.26 : 0)
    + (moduleHintMatched ? 0.22 : moduleHints.size ? -0.2 : 0.08)
    + (topicMatched ? 0.18 : 0)
    + Math.min(0.2, coverage * 0.35)
    + (matchedKeywords.length ? 0.08 : 0)
  ));

  const baseConfidence = Math.max(0, Math.min(0.99, score / 1300));
  const confidence = Math.max(0, Math.min(0.99, (baseConfidence * 0.65) + (consistencyScore * 0.35)));
  const reliable = score >= 220
    && confidence >= 0.55
    && (moduleHints.size === 0 || moduleHintMatched)
    && (triggerExact || triggerPhraseMatched || topicMatched || matchedKeywords.length > 0)
    && coverage >= 0.2;

  return {
    entry,
    score,
    matchedKeywords,
    reason,
    coverage,
    moduleHintMatched,
    topicMatched,
    consistencyScore,
    confidence,
    reliable,
  };
}

function buildContextRecords(matches = [], detectedLanguage = 'en') {
  return matches.map(({ entry, score, matchedKeywords, reason, coverage, moduleHintMatched, topicMatched, consistencyScore, confidence, reliable }) => ({
    recordId: entry.recordId,
    module: entry.module,
    topic: entry.topic,
    subtopic: entry.subtopic,
    contentType: entry.contentType,
    language: entry.language,
    questionTrigger: entry.questionTrigger,
    approvedAnswer: entry.approvedAnswer || entry.answer,
    responseVariants: Array.isArray(entry.responseVariants) && entry.responseVariants.every((item) => typeof item === 'string')
      ? entry.responseVariants
      : collectVariantText(entry, detectedLanguage),
    responseVariantEntries: Array.isArray(entry.responseVariantEntries) && entry.responseVariantEntries.length
      ? entry.responseVariantEntries
      : collectVariantEntries(entry),
    sourceOwner: entry.sourceOwner || '',
    score,
    matchedKeywords,
    reason,
    coverage,
    moduleGroup: entry.moduleGroup,
    moduleMatch: moduleHintMatched,
    topicMatch: topicMatched,
    consistencyScore,
    confidence,
    reliable,
    priorityLabel: entry.priorityLabel,
  }));
}

export async function retrieveKnowledgeContext({
  question,
  history = [],
  detectedLanguage = 'en',
  minScore = 220,
} = {}) {
  const recentContextText = history
    .filter((message) => message?.role === 'user')
    .slice(-4)
    .map((message) => String(message.content || message.messageText || ''))
    .join(' ');

  const entries = await AIKnowledgeEntry.find({ active: true, isEnabled: true }).sort({ priorityRank: -1, updatedAt: -1 });
  const queryTokens = tokenizeText(question);
  const moduleHints = detectModuleHints(question, recentContextText);
  const ranked = entries
    .map((entry) => normalizeKnowledgeRecord(entry, detectedLanguage))
    .map((entry) => scoreKnowledgeEntry(entry, question, queryTokens, recentContextText, detectedLanguage, moduleHints))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || (right.entry.priorityRank || 0) - (left.entry.priorityRank || 0))
    .slice(0, 5);

  const best = ranked[0] || null;
  if (!best || best.score < minScore || best.reliable !== true) {
    return {
      ok: false,
      bestScore: best?.score || 0,
      confidence: Number(best?.confidence || 0),
      reliable: false,
      matchesCount: ranked.length,
      moduleHints: Array.from(moduleHints),
      knowledgeRecordIds: ranked.map((item) => item.entry.recordId),
      topMatches: buildContextRecords(ranked, detectedLanguage),
    };
  }

  return {
    ok: true,
    bestScore: best.score,
    confidence: Number(best.confidence || 0),
    reliable: true,
    matchesCount: ranked.length,
    moduleHints: Array.from(moduleHints),
    knowledgeRecordIds: ranked.map((item) => item.entry.recordId),
    topMatches: buildContextRecords(ranked, detectedLanguage),
    bestMatch: buildContextRecords([best], detectedLanguage)[0],
  };
}
