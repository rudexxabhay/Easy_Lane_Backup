import { EASY_AI_FALLBACK, EASY_AI_KNOWLEDGE } from './knowledge.js';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'be', 'can', 'do', 'does', 'for', 'from', 'how',
  'i', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'the', 'to', 'we', 'what',
  'when', 'where', 'who', 'why', 'with', 'you', 'your', 'about', 'tell',
  'please', 'help', 'explain',
]);

const CATEGORY_ALIASES = {
  general: ['general', 'overview', 'platform', 'easy lane', 'easylane'],
  tms: ['tms', 'transport', 'transportation', 'trip', 'dispatch', 'shipment'],
  fleet: ['fleet', 'vehicle', 'vehicles', 'truck', 'trucks', 'driver', 'drivers', 'maintenance', 'fuel'],
  ams: ['ams', 'asset', 'assets', 'asset management'],
  finance: ['finance', 'invoice', 'bill discounting', 'payment', 'cash flow', 'funding'],
  tracking: ['tracking', 'live tracking', 'gps', 'eta', 'visibility', 'route'],
  integrations: ['integration', 'integrations', 'api', 'erp', 'connect'],
  industries: ['industry', 'industries', 'sector', 'sectors', 'use case'],
  security: ['security', 'secure', 'privacy', 'compliance'],
  pricing: ['pricing', 'price', 'cost', 'plan', 'plans'],
  demo: ['demo', 'book demo', 'book a demo', 'sales'],
  support: ['support', 'help', 'contact', 'assistance'],
};

export function normalizeText(value = '') {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeText(value = '') {
  return normalizeText(value)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token && token.length > 1 && !STOP_WORDS.has(token));
}

function overlapScore(leftTokens, rightTokens) {
  if (!leftTokens.length || !rightTokens.length) return 0;
  const rightSet = new Set(rightTokens);
  let hits = 0;
  for (const token of leftTokens) {
    if (rightSet.has(token)) hits += 1;
  }
  const denominator = Math.max(leftTokens.length, rightTokens.length);
  return hits / denominator;
}

function containsPhrase(source, phrase) {
  const normalizedPhrase = normalizeText(phrase);
  return normalizedPhrase ? normalizeText(source).includes(normalizedPhrase) : false;
}

function categoryAliases(category = '') {
  return CATEGORY_ALIASES[normalizeText(category)] || [];
}

function scoreEntry(entry, query, queryTokens) {
  if (!entry || entry.isEnabled === false) return null;

  const primary = normalizeText(entry.primaryQuestion);
  const alternatives = Array.isArray(entry.alternativeQuestions) ? entry.alternativeQuestions.map(normalizeText).filter(Boolean) : [];
  const keywords = Array.isArray(entry.keywords) ? entry.keywords.map(normalizeText).filter(Boolean) : [];
  const entryTokens = tokenizeText([entry.primaryQuestion, ...alternatives, ...keywords].join(' '));
  const priority = Number.isFinite(Number(entry.priority)) ? Number(entry.priority) : 100;

  let score = 0;
  let matchedKeywords = 0;
  let specificity = 0;

  if (query === primary) {
    score = 1000;
    specificity = 4;
  } else {
    const exactAlternative = alternatives.find((candidate) => candidate === query);
    if (exactAlternative) {
      score = 900;
      specificity = 3;
    } else {
      const primaryOverlap = overlapScore(queryTokens, tokenizeText(primary));
      const bestAltOverlap = alternatives.reduce((best, candidate) => Math.max(best, overlapScore(queryTokens, tokenizeText(candidate))), 0);
      const phrasePrimary = containsPhrase(query, primary) || containsPhrase(primary, query);
      const phraseAlt = alternatives.some((candidate) => containsPhrase(query, candidate) || containsPhrase(candidate, query));

      if (phrasePrimary) {
        score += 620;
        specificity = Math.max(specificity, 3);
      } else if (primaryOverlap >= 0.5) {
        score += 430 + Math.round(primaryOverlap * 160);
        specificity = Math.max(specificity, 2);
      }

      if (phraseAlt) {
        score += 520;
        specificity = Math.max(specificity, 3);
      } else if (bestAltOverlap >= 0.45) {
        score += 360 + Math.round(bestAltOverlap * 150);
        specificity = Math.max(specificity, 2);
      }
    }
  }

  for (const keyword of keywords) {
    const keywordTokens = tokenizeText(keyword);
    if (!keywordTokens.length) continue;
    const keywordMatch = containsPhrase(query, keyword) || containsPhrase(keyword, query) || overlapScore(queryTokens, keywordTokens) >= 0.5;
    if (!keywordMatch) continue;
    matchedKeywords += 1;
    score += 72 + keywordTokens.length * 8;
  }

  const aliases = categoryAliases(entry.category);
  if (aliases.some((alias) => containsPhrase(query, alias) || containsPhrase(alias, query) || overlapScore(queryTokens, tokenizeText(alias)) > 0.4)) {
    score += 35;
  }

  if (queryTokens.some((token) => entryTokens.includes(token))) {
    score += 18;
  }

  score += Math.min(priority, 1000) / 12;

  return {
    entry,
    score,
    matchedKeywords,
    specificity,
    priority,
  };
}

export function findKnowledgeResponse(question, knowledge = EASY_AI_KNOWLEDGE) {
  const query = normalizeText(question);
  if (!query) return { answer: EASY_AI_FALLBACK, matchType: 'fallback', score: 0 };

  const queryTokens = tokenizeText(query);
  const candidates = (Array.isArray(knowledge) ? knowledge : [])
    .filter((entry) => entry && entry.isEnabled !== false)
    .map((entry) => scoreEntry(entry, query, queryTokens))
    .filter(Boolean)
    .sort((left, right) => (
      right.score - left.score
      || right.matchedKeywords - left.matchedKeywords
      || right.specificity - left.specificity
      || right.priority - left.priority
    ));

  const winner = candidates[0];
  if (!winner || winner.score < 110) return { answer: EASY_AI_FALLBACK, matchType: 'fallback', score: 0 };

  const exactPrimary = normalizeText(winner.entry.primaryQuestion) === query;
  const exactAlternative = Array.isArray(winner.entry.alternativeQuestions) && winner.entry.alternativeQuestions.some((candidate) => normalizeText(candidate) === query);
  const matchType = exactPrimary ? 'primary' : exactAlternative ? 'alternative' : winner.specificity >= 2 ? 'partial' : 'keyword';

  return {
    ...winner.entry,
    answer: winner.entry.answer || EASY_AI_FALLBACK,
    ctaLabel: winner.entry.ctaLabel || '',
    ctaTarget: winner.entry.ctaTarget || '',
    matchType,
    score: winner.score,
  };
}

export function resolveKnowledgeResponse(question, knowledge = EASY_AI_KNOWLEDGE) {
  return findKnowledgeResponse(question, knowledge);
}

