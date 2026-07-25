import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { AIKnowledgeEntry } from '../models/AIKnowledgeEntry.js';
import { AssistantConversation } from '../models/AssistantConversation.js';
import { AssistantEvent } from '../models/AssistantEvent.js';
import { AssistantMessage } from '../models/AssistantMessage.js';
import { AssistantSettings, defaultAssistantSettings } from '../models/AssistantSettings.js';
import { AssistantUnmatchedQuestion } from '../models/AssistantUnmatchedQuestion.js';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'be', 'can', 'do', 'does', 'for', 'from', 'how',
  'i', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'the', 'to', 'we', 'what',
  'when', 'where', 'who', 'why', 'with', 'you', 'your', 'about', 'tell',
  'please', 'help', 'explain', 'please', 'kindly', 'can', 'could', 'would',
  'hai', 'kya', 'kaise', 'mere', 'mera', 'meri', 'kya', 'kese', 'kaun', 'konsa',
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

export const PUBLIC_FALLBACK = `I don't have a verified answer for that yet.

You can ask about:

• TMS
• Fleet
• AMS
• Finance
• Tracking
• Integrations
• Book Demo`;

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
  for (const token of leftTokens) if (rightSet.has(token)) hits += 1;
  return hits / Math.max(leftTokens.length, rightTokens.length);
}

function containsPhrase(source, phrase) {
  const normalizedPhrase = normalizeText(phrase);
  return normalizedPhrase ? normalizeText(source).includes(normalizedPhrase) : false;
}

function categoryAliases(category = '') {
  return CATEGORY_ALIASES[normalizeText(category)] || [];
}

export function sanitizeText(value, limit = 5000) {
  const text = String(value ?? '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\u0000/g, '')
    .trim();
  return text.slice(0, limit);
}

export function safeObjectId(id) {
  return mongoose.isValidObjectId(id) ? String(id) : '';
}

export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function parseScreenSize(value = '') {
  const text = String(value || '').trim();
  if (!text) return '';
  const match = text.match(/^(\d{2,5})x(\d{2,5})$/i);
  if (!match) return text.slice(0, 40);
  return `${Number(match[1])}x${Number(match[2])}`;
}

export function detectDeviceType(value = '') {
  const text = normalizeText(value);
  if (/tablet|ipad/.test(text)) return 'tablet';
  if (/mobile|iphone|android/.test(text)) return 'mobile';
  return 'desktop';
}

export function detectBrowser(userAgent = '') {
  const ua = String(userAgent || '');
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'Safari';
  return 'Unknown';
}

export function detectOperatingSystem(userAgent = '') {
  const ua = String(userAgent || '');
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown';
}

export function getClientContext(req = {}, body = {}) {
  const userAgent = String(req.headers?.['user-agent'] || '');
  const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};
  const technical = body.technical && typeof body.technical === 'object' ? body.technical : {};
  const requestContext = {
    pageUrl: String(body.pageUrl || body.url || metadata.pageUrl || '').trim().slice(0, 2048),
    pageTitle: String(body.pageTitle || metadata.pageTitle || '').trim().slice(0, 500),
    referrerUrl: String(body.referrerUrl || metadata.referrerUrl || '').trim().slice(0, 2048),
    deviceType: String(body.deviceType || technical.deviceType || detectDeviceType(userAgent)).trim().slice(0, 80),
    browser: String(body.browser || technical.browser || detectBrowser(userAgent)).trim().slice(0, 120),
    operatingSystem: String(body.operatingSystem || technical.operatingSystem || detectOperatingSystem(userAgent)).trim().slice(0, 120),
    screenSize: parseScreenSize(body.screenSize || technical.screenSize || ''),
    language: String(body.language || technical.language || req.headers?.['accept-language'] || '').trim().slice(0, 40),
    timezone: String(body.timezone || technical.timezone || '').trim().slice(0, 120),
    ipAddress: '',
    approximateLocation: '',
    metadata,
  };

  return requestContext;
}

export async function getAssistantSettings() {
  const settings = await AssistantSettings.findOneAndUpdate(
    { key: defaultAssistantSettings.key },
    { $setOnInsert: defaultAssistantSettings },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return settings ? settings.toObject() : { ...defaultAssistantSettings };
}

export async function applyRetentionPolicy(settings) {
  const safeSettings = settings || (await getAssistantSettings());
  const retentionDays = Math.max(1, Number(safeSettings.dataRetentionDays) || defaultAssistantSettings.dataRetentionDays);
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  await Promise.all([
    AssistantConversation.deleteMany({ updatedAt: { $lt: cutoff }, status: { $in: ['closed', 'abandoned', 'inactive', 'error'] } }),
    AssistantMessage.deleteMany({ createdAt: { $lt: cutoff } }),
    AssistantEvent.deleteMany({ createdAt: { $lt: cutoff } }),
    AssistantUnmatchedQuestion.deleteMany({ askedAt: { $lt: cutoff }, reviewStatus: { $in: ['ignored', 'reviewed'] } }),
  ]);
}

export function normalizeKnowledgeEntry(entry) {
  if (!entry) return null;
  return {
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
    updatedAt: entry.updatedAt || null,
  };
}

export async function loadEnabledKnowledgeEntries() {
  const entries = await AIKnowledgeEntry.find({ isEnabled: true }).sort({ priority: -1, updatedAt: -1 });
  return entries.map((entry) => normalizeKnowledgeEntry(entry));
}

function scoreEntry(entry, query, queryTokens) {
  if (!entry || entry.isEnabled === false) return null;

  const primary = normalizeText(entry.primaryQuestion);
  const alternatives = Array.isArray(entry.alternativeQuestions) ? entry.alternativeQuestions.map(normalizeText).filter(Boolean) : [];
  const keywords = Array.isArray(entry.keywords) ? entry.keywords.map(normalizeText).filter(Boolean) : [];
  const entryTokens = tokenizeText([entry.primaryQuestion, ...alternatives, ...keywords].join(' '));
  const priority = Number.isFinite(Number(entry.priority)) ? Number(entry.priority) : 100;

  let score = 0;
  let matchedKeywords = [];
  let specificity = 0;
  let matchKind = '';

  if (query === primary) {
    score = 1000;
    specificity = 4;
    matchKind = 'primary';
  } else {
    const exactAlternative = alternatives.find((candidate) => candidate === query);
    if (exactAlternative) {
      score = 900;
      specificity = 3;
      matchKind = 'alternative';
    } else {
      const primaryOverlap = overlapScore(queryTokens, tokenizeText(primary));
      const bestAltOverlap = alternatives.reduce((best, candidate) => Math.max(best, overlapScore(queryTokens, tokenizeText(candidate))), 0);
      const phrasePrimary = containsPhrase(query, primary) || containsPhrase(primary, query);
      const phraseAlt = alternatives.some((candidate) => containsPhrase(query, candidate) || containsPhrase(candidate, query));

      if (phrasePrimary) {
        score += 620;
        specificity = Math.max(specificity, 3);
        matchKind = matchKind || 'primary-phrase';
      } else if (primaryOverlap >= 0.5) {
        score += 430 + Math.round(primaryOverlap * 160);
        specificity = Math.max(specificity, 2);
        matchKind = matchKind || 'primary-partial';
      }

      if (phraseAlt) {
        score += 520;
        specificity = Math.max(specificity, 3);
        matchKind = matchKind || 'alternative-phrase';
      } else if (bestAltOverlap >= 0.45) {
        score += 360 + Math.round(bestAltOverlap * 150);
        specificity = Math.max(specificity, 2);
        matchKind = matchKind || 'alternative-partial';
      }
    }
  }

  for (const keyword of keywords) {
    const keywordTokens = tokenizeText(keyword);
    if (!keywordTokens.length) continue;
    const keywordMatch = containsPhrase(query, keyword) || containsPhrase(keyword, query) || overlapScore(queryTokens, keywordTokens) >= 0.5;
    if (!keywordMatch) continue;
    matchedKeywords.push(keyword);
    score += 72 + keywordTokens.length * 8;
  }

  const aliases = categoryAliases(entry.category);
  const categoryHit = aliases.some((alias) => containsPhrase(query, alias) || containsPhrase(alias, query) || overlapScore(queryTokens, tokenizeText(alias)) > 0.4);
  if (categoryHit) score += 35;

  if (queryTokens.some((token) => entryTokens.includes(token))) score += 18;
  score += Math.min(priority, 1000) / 12;

  return {
    entry,
    score,
    matchedKeywords,
    specificity,
    priority,
    matchKind,
    categoryHit,
  };
}

export function matchKnowledgeQuestion(question, knowledgeEntries = []) {
  const query = normalizeText(question);
  if (!query) {
    return {
      answer: PUBLIC_FALLBACK,
      matchType: 'fallback',
      score: 0,
      confidence: 0,
      entry: null,
      candidates: [],
      matchedKeywords: [],
    };
  }

  const queryTokens = tokenizeText(query);
  const candidates = (Array.isArray(knowledgeEntries) ? knowledgeEntries : [])
    .filter((entry) => entry && entry.isEnabled !== false)
    .map((entry) => scoreEntry(entry, query, queryTokens))
    .filter(Boolean)
    .sort((left, right) => (
      right.score - left.score
      || right.matchedKeywords.length - left.matchedKeywords.length
      || right.specificity - left.specificity
      || right.priority - left.priority
    ));

  const best = candidates[0];
  if (!best || best.score < 110) {
    return {
      answer: PUBLIC_FALLBACK,
      matchType: 'fallback',
      score: best?.score || 0,
      confidence: best ? Math.min(0.95, best.score / 1200) : 0,
      entry: null,
      candidates: candidates.slice(0, 5).map(({ entry, score, matchedKeywords, specificity }) => ({
        id: entry.id,
        category: entry.category,
        primaryQuestion: entry.primaryQuestion,
        score,
        matchedKeywords,
        specificity,
      })),
      matchedKeywords: [],
    };
  }

  const exactPrimary = normalizeText(best.entry.primaryQuestion) === query;
  const exactAlternative = Array.isArray(best.entry.alternativeQuestions) && best.entry.alternativeQuestions.some((candidate) => normalizeText(candidate) === query);
  const matchType = exactPrimary ? 'primary' : exactAlternative ? 'alternative' : best.specificity >= 2 ? 'partial' : 'keyword';
  const confidence = Math.max(0.1, Math.min(0.99, best.score / 1200));

  return {
    entry: best.entry,
    answer: best.entry.answer || PUBLIC_FALLBACK,
    ctaLabel: best.entry.ctaLabel || '',
    ctaTarget: best.entry.ctaTarget || '',
    category: best.entry.category || '',
    matchType,
    score: best.score,
    confidence,
    matchedKeywords: best.matchedKeywords,
    candidates: candidates.slice(0, 5).map(({ entry, score, matchedKeywords, specificity }) => ({
      id: entry.id,
      category: entry.category,
      primaryQuestion: entry.primaryQuestion,
      score,
      matchedKeywords,
      specificity,
    })),
  };
}

export function buildConversationFilter(query = {}) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.category) filter.detectedCategory = query.category;
  if (query.intent) filter.detectedIntent = query.intent;
  if (query.device) filter.deviceType = query.device;
  if (query.lead === 'true') filter.convertedToLead = true;
  if (query.lead === 'false') filter.convertedToLead = false;
  if (query.matched === 'true') filter.matchedQuestions = { $gt: 0 };
  if (query.matched === 'false') filter.matchedQuestions = { $lte: 0 };
  if (query.unmatched === 'true') filter.unmatchedQuestions = { $gt: 0 };
  if (query.unmatched === 'false') filter.unmatchedQuestions = { $lte: 0 };
  if (query.startDate || query.endDate) {
    filter.startedAt = {};
    if (query.startDate) filter.startedAt.$gte = new Date(String(query.startDate));
    if (query.endDate) filter.startedAt.$lte = new Date(String(query.endDate));
  }
  if (query.search) {
    const term = new RegExp(String(query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { conversationId: term },
      { visitorId: term },
      { pageTitle: term },
      { startPageUrl: term },
      { detectedCategory: term },
      { detectedIntent: term },
      { matchedModule: term },
    ];
  }
  return filter;
}

export function buildConversationSort(sort = 'newest') {
  switch (sort) {
    case 'oldest':
      return { startedAt: 1, updatedAt: 1 };
    case 'longest':
      return { durationSeconds: -1, startedAt: -1 };
    case 'messages':
      return { totalMessageCount: -1, startedAt: -1 };
    default:
      return { startedAt: -1, updatedAt: -1 };
  }
}

export function buildUnmatchedFilter(query = {}) {
  const filter = {};
  if (query.reviewStatus) filter.reviewStatus = query.reviewStatus;
  if (query.category) filter.suggestedCategory = query.category;
  if (query.search) {
    const term = new RegExp(String(query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { originalQuestion: term },
      { normalizedQuestion: term },
      { visitorId: term },
      { conversationId: term },
      { pageUrl: term },
      { suggestedCategory: term },
    ];
  }
  return filter;
}

export function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export function serializeConversation(conversation) {
  const doc = typeof conversation?.toObject === 'function' ? conversation.toObject() : conversation;
  if (!doc) return null;
  return {
    ...doc,
    adminNotes: Array.isArray(doc.adminNotes) ? doc.adminNotes : [],
  };
}

export async function upsertConversationFromEvent({
  conversationId,
  sessionId,
  visitorId,
  context = {},
  metadata = {},
  createIfMissing = true,
}) {
  if (!conversationId || !sessionId || !visitorId) return null;
  let conversation = await AssistantConversation.findOne({ conversationId });
  if (!conversation && !createIfMissing) return null;

  const now = new Date();
  if (!conversation) {
    conversation = await AssistantConversation.create({
      conversationId,
      sessionId,
      visitorId,
      status: 'new',
      startedAt: null,
      lastActivityAt: now,
      startPageUrl: context.pageUrl || '',
      pageTitle: context.pageTitle || '',
      referrerUrl: context.referrerUrl || '',
      deviceType: context.deviceType || '',
      browser: context.browser || '',
      operatingSystem: context.operatingSystem || '',
      screenSize: context.screenSize || '',
      language: context.language || '',
      timezone: context.timezone || '',
      ipAddress: context.ipAddress || '',
      approximateLocation: context.approximateLocation || '',
      metadata,
    });
  } else {
    conversation.lastActivityAt = now;
    conversation.sessionId = sessionId;
    conversation.visitorId = visitorId;
    conversation.pageTitle = context.pageTitle || conversation.pageTitle;
    conversation.referrerUrl = context.referrerUrl || conversation.referrerUrl;
    conversation.deviceType = context.deviceType || conversation.deviceType;
    conversation.browser = context.browser || conversation.browser;
    conversation.operatingSystem = context.operatingSystem || conversation.operatingSystem;
    conversation.screenSize = context.screenSize || conversation.screenSize;
    conversation.language = context.language || conversation.language;
    conversation.timezone = context.timezone || conversation.timezone;
    conversation.ipAddress = context.ipAddress || conversation.ipAddress;
    conversation.approximateLocation = context.approximateLocation || conversation.approximateLocation;
    conversation.metadata = { ...(conversation.metadata || {}), ...metadata };
  }
  await conversation.save();
  return conversation;
}

export async function touchConversation(conversationId, patch = {}) {
  const conversation = await AssistantConversation.findOne({ conversationId });
  if (!conversation) return null;
  Object.assign(conversation, patch);
  conversation.lastActivityAt = new Date();
  if (conversation.startedAt) {
    conversation.durationSeconds = Math.max(
      0,
      Math.round((conversation.lastActivityAt.getTime() - conversation.startedAt.getTime()) / 1000),
    );
  }
  await conversation.save();
  return conversation;
}

export async function markConversationStarted(conversationId, context = {}) {
  const now = new Date();
  const conversation = await AssistantConversation.findOne({ conversationId });
  if (!conversation) return null;
  if (!conversation.startedAt) conversation.startedAt = now;
  conversation.status = conversation.status === 'new' ? 'active' : conversation.status;
  conversation.lastActivityAt = now;
  conversation.startPageUrl = conversation.startPageUrl || context.pageUrl || '';
  conversation.pageTitle = conversation.pageTitle || context.pageTitle || '';
  conversation.referrerUrl = conversation.referrerUrl || context.referrerUrl || '';
  if (context.detectedCategory) conversation.detectedCategory = context.detectedCategory;
  if (context.detectedIntent) conversation.detectedIntent = context.detectedIntent;
  if (context.matchedModule) conversation.matchedModule = context.matchedModule;
  await conversation.save();
  return conversation;
}

export async function finalizeConversation(conversationId, { status, metadata = {} } = {}) {
  const conversation = await AssistantConversation.findOne({ conversationId });
  if (!conversation) return null;
  conversation.status = status || conversation.status || 'closed';
  conversation.endedAt = new Date();
  conversation.lastActivityAt = new Date();
  conversation.metadata = { ...(conversation.metadata || {}), ...metadata };
  if (conversation.startedAt) {
    conversation.durationSeconds = Math.max(
      0,
      Math.round((conversation.endedAt.getTime() - conversation.startedAt.getTime()) / 1000),
    );
  }
  await conversation.save();
  return conversation;
}

export async function storeMessage({
  messageId = createId('msg'),
  conversationId,
  sender,
  messageText,
  normalisedText = '',
  messageType = 'text',
  sentAt = new Date(),
  deliveredAt = null,
  responseDelay = 0,
  knowledgeEntryId = '',
  knowledgeSnapshot = null,
  matchedPrimaryQuestion = '',
  matchedAlternativeQuestion = '',
  matchedKeywords = [],
  matchingScore = 0,
  matchingConfidence = 0,
  category = '',
  ctaLabel = '',
  ctaTarget = '',
  fallbackUsed = false,
  errorOccurred = false,
  errorDetails = '',
  metadata = {},
} = {}) {
  const message = await AssistantMessage.create({
    messageId,
    conversationId,
    sender,
    messageText: sanitizeText(messageText, 5000),
    normalisedText: sanitizeText(normalisedText || normalizeText(messageText), 5000),
    messageType,
    sentAt,
    deliveredAt,
    responseDelay,
    knowledgeEntryId,
    knowledgeSnapshot,
    matchedPrimaryQuestion,
    matchedAlternativeQuestion,
    matchedKeywords,
    matchingScore,
    matchingConfidence,
    category,
    ctaLabel,
    ctaTarget,
    fallbackUsed,
    errorOccurred,
    errorDetails: sanitizeText(errorDetails, 2000),
    metadata,
  });

  const updates = { lastActivityAt: new Date(), $inc: { totalMessageCount: 1 } };
  if (sender === 'user') updates.$inc.totalUserMessages = 1;
  if (sender === 'assistant') updates.$inc.totalAssistantMessages = 1;

  await AssistantConversation.updateOne({ conversationId }, updates);
  return message;
}

export async function storeEvent({
  eventId = createId('evt'),
  conversationId,
  eventType,
  eventTimestamp = new Date(),
  pageUrl = '',
  relatedMessageId = '',
  relatedKnowledgeEntryId = '',
  relatedCTA = {},
  metadata = {},
} = {}) {
  try {
    return await AssistantEvent.create({
      eventId,
      conversationId,
      eventType,
      eventTimestamp,
      pageUrl: sanitizeText(pageUrl, 2048),
      relatedMessageId,
      relatedKnowledgeEntryId,
      relatedCTA: {
        label: sanitizeText(relatedCTA?.label || '', 90),
        target: sanitizeText(relatedCTA?.target || '', 180),
      },
      metadata,
    });
  } catch (error) {
    if (error?.code === 11000) return null;
    throw error;
  }
}

export async function recordUnmatchedQuestion({
  question,
  conversationId,
  visitorId,
  pageUrl = '',
  suggestedCategory = '',
  matchCandidates = [],
  highestRejectedScore = 0,
  metadata = {},
}) {
  const normalizedQuestion = normalizeText(question);
  if (!normalizedQuestion) return null;
  const existing = await AssistantUnmatchedQuestion.findOne({ normalizedQuestion });
  if (existing) {
    existing.conversationId = conversationId;
    existing.visitorId = visitorId;
    existing.pageUrl = pageUrl || existing.pageUrl;
    existing.suggestedCategory = suggestedCategory || existing.suggestedCategory;
    existing.matchCandidates = matchCandidates;
    existing.highestRejectedScore = Math.max(existing.highestRejectedScore || 0, Number(highestRejectedScore) || 0);
    existing.timesAsked = (existing.timesAsked || 0) + 1;
    existing.reviewStatus = existing.reviewStatus === 'ignored' ? 'ignored' : 'new';
    existing.adminNotes = existing.adminNotes || '';
    existing.metadata = { ...(existing.metadata || {}), ...metadata };
    await existing.save();
    return existing;
  }

  return AssistantUnmatchedQuestion.create({
    originalQuestion: sanitizeText(question, 5000),
    normalizedQuestion,
    conversationId,
    visitorId,
    pageUrl: sanitizeText(pageUrl, 2048),
    suggestedCategory,
    matchCandidates,
    highestRejectedScore,
    timesAsked: 1,
    reviewStatus: 'new',
    metadata,
  });
}

export async function buildAnalyticsSummary(query = {}) {
  const filter = buildConversationFilter(query);
  const conversations = await AssistantConversation.find(filter);
  const conversationIds = conversations.map((item) => item.conversationId);
  const messageFilter = conversationIds.length ? { conversationId: { $in: conversationIds } } : { conversationId: { $in: [] } };
  const eventFilter = conversationIds.length ? { conversationId: { $in: conversationIds } } : { conversationId: { $in: [] } };
  const unmatchedFilter = conversationIds.length ? { conversationId: { $in: conversationIds } } : { conversationId: { $in: [] } };
  const [messages, events, unmatched] = await Promise.all([
    AssistantMessage.find(messageFilter),
    AssistantEvent.find(eventFilter),
    AssistantUnmatchedQuestion.find(unmatchedFilter),
  ]);

  const totalConversations = conversations.length;
  const totalMessages = messages.length;
  const activeConversations = conversations.filter((item) => item.status === 'active').length;
  const closedConversations = conversations.filter((item) => item.status === 'closed').length;
  const abandonedConversations = conversations.filter((item) => item.status === 'abandoned').length;
  const totalWidgetOpens = conversations.reduce((sum, item) => sum + (item.widgetOpens || 0), 0);
  const totalStarted = conversations.filter((item) => item.startedAt).length;
  const avgMessages = totalConversations ? totalMessages / totalConversations : 0;
  const avgResponseTime = messages.filter((item) => item.sender === 'assistant' && Number.isFinite(item.responseDelay)).reduce((sum, item) => sum + (item.responseDelay || 0), 0) / Math.max(1, messages.filter((item) => item.sender === 'assistant').length);
  const avgDuration = totalConversations ? conversations.reduce((sum, item) => sum + (item.durationSeconds || 0), 0) / totalConversations : 0;
  const matchSuccessCount = messages.filter((item) => item.sender === 'assistant' && !item.fallbackUsed && item.matchingConfidence >= 0.15).length;
  const fallbackCount = messages.filter((item) => item.sender === 'assistant' && item.fallbackUsed).length;
  const ctaClicks = events.filter((event) => event.eventType === 'cta_clicked').length;
  const demoRequests = conversations.filter((item) => item.demoRequested).length;
  const leadConversions = conversations.filter((item) => item.convertedToLead).length;
  const visitorFrequency = conversations.reduce((acc, item) => {
    const key = item.visitorId || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const returningVisitorCount = Object.values(visitorFrequency).filter((count) => count > 1).length;

  const byCategory = conversations.reduce((acc, item) => {
    const key = item.detectedCategory || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const byModule = conversations.reduce((acc, item) => {
    const key = item.matchedModule || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const byDevice = conversations.reduce((acc, item) => {
    const key = item.deviceType || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const byPage = conversations.reduce((acc, item) => {
    const key = item.startPageUrl || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const byDate = conversations.reduce((acc, item) => {
    const key = item.startedAt ? new Date(item.startedAt).toISOString().slice(0, 10) : 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const mostAskedQuestions = Object.entries(messages
    .filter((item) => item.sender === 'user')
    .reduce((acc, item) => {
      const key = normalizeText(item.messageText);
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}))
    .sort((left, right) => right[1] - left[1])
    .slice(0, 20)
    .map(([question, count]) => ({ question, count }));

  const topUnmatchedQuestions = unmatched
    .sort((a, b) => (b.timesAsked || 0) - (a.timesAsked || 0))
    .slice(0, 20)
    .map((item) => ({ question: item.originalQuestion, timesAsked: item.timesAsked }));

  return {
    totals: {
      widgetOpens: totalWidgetOpens,
      conversationsStarted: totalStarted,
      activeConversations,
      closedConversations,
      abandonedConversations,
      totalMessages,
      averageMessagesPerConversation: avgMessages,
      averageResponseTime: Number.isFinite(avgResponseTime) ? avgResponseTime : 0,
      averageConversationDuration: avgDuration,
      matchSuccessRate: totalMessages ? matchSuccessCount / totalMessages : 0,
      fallbackRate: totalMessages ? fallbackCount / totalMessages : 0,
      ctaClickRate: totalMessages ? ctaClicks / totalMessages : 0,
      demoRequestRate: totalConversations ? demoRequests / totalConversations : 0,
      leadConversionRate: totalConversations ? leadConversions / totalConversations : 0,
      returningVisitorCount,
      unmatchedQuestionCount: unmatched.length,
    },
    byCategory,
    byModule,
    byDevice,
    byPage,
    byDate,
    mostAskedQuestions,
    topUnmatchedQuestions,
  };
}

export function toCsv(rows = []) {
  return rows.map((row) => row.map((value) => csvEscape(value)).join(',')).join('\n');
}

export async function getKnowledgeUsageStats(query = {}) {
  const knowledgeEntries = await AIKnowledgeEntry.find({}).sort({ updatedAt: -1 });
  const messages = await AssistantMessage.find({ sender: 'assistant' });
  const events = await AssistantEvent.find({ eventType: 'cta_clicked' });

  return knowledgeEntries.map((entry) => {
    const entryId = String(entry.id || entry._id);
    const matchedMessages = messages.filter((message) => String(message.knowledgeEntryId || '') === entryId);
    const exactCount = matchedMessages.filter((message) => message.matchingScore >= 1000).length;
    const alternativeCount = matchedMessages.filter((message) => message.matchingScore >= 900 && message.matchingScore < 1000).length;
    const keywordCount = matchedMessages.filter((message) => message.matchingScore < 900 && message.matchingScore > 0).length;
    const ctaClicks = events.filter((event) => String(event.relatedKnowledgeEntryId || '') === entryId).length;
    const averageConfidence = matchedMessages.length ? matchedMessages.reduce((sum, message) => sum + (message.matchingConfidence || 0), 0) / matchedMessages.length : 0;
    return {
      id: entryId,
      category: entry.category,
      primaryQuestion: entry.primaryQuestion,
      isEnabled: entry.isEnabled !== false,
      totalMatched: matchedMessages.length,
      exactMatchCount: exactCount,
      alternativeMatchCount: alternativeCount,
      keywordMatchCount: keywordCount,
      ctaClicks,
      lastUsedAt: matchedMessages[0]?.sentAt || null,
      averageMatchingConfidence: averageConfidence,
      fallbackFailures: 0,
      priority: entry.priority,
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
    };
  });
}

export function dedupeArray(values = []) {
  return [...new Set(values.map((item) => String(item || '').trim()).filter(Boolean))];
}
