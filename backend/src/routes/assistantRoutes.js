import express from 'express';
import mongoose from 'mongoose';
import { requireAdmin } from '../auth.js';
import { AIKnowledgeEntry } from '../models/AIKnowledgeEntry.js';
import { AssistantConversation } from '../models/AssistantConversation.js';
import { AssistantEvent } from '../models/AssistantEvent.js';
import { AssistantMessage } from '../models/AssistantMessage.js';
import { AssistantSettings } from '../models/AssistantSettings.js';
import { AssistantUnmatchedQuestion } from '../models/AssistantUnmatchedQuestion.js';
import {
  PUBLIC_FALLBACK,
  applyRetentionPolicy,
  buildAnalyticsSummary,
  buildConversationFilter,
  buildConversationSort,
  buildUnmatchedFilter,
  createId,
  dedupeArray,
  finalizeConversation,
  getAssistantSettings,
  getClientContext,
  getKnowledgeUsageStats,
  loadEnabledKnowledgeEntries,
  markConversationStarted,
  matchKnowledgeQuestion,
  normalizeText,
  normalizeKnowledgeEntry,
  recordUnmatchedQuestion,
  sanitizeText,
  serializeConversation,
  storeEvent,
  storeMessage,
  touchConversation,
  upsertConversationFromEvent,
  toCsv,
} from '../services/assistantService.js';

export const assistantPublicRouter = express.Router();
export const assistantAdminRouter = express.Router();

const publicBuckets = new Map();
const PUBLIC_LIMIT = 90;
const PUBLIC_WINDOW_MS = 60 * 1000;

function rateLimit(req, res, next) {
  const key = `${req.ip || 'unknown'}:${req.path}`;
  const now = Date.now();
  const bucket = publicBuckets.get(key) || { count: 0, expiresAt: now + PUBLIC_WINDOW_MS };
  if (bucket.expiresAt < now) {
    bucket.count = 0;
    bucket.expiresAt = now + PUBLIC_WINDOW_MS;
  }
  bucket.count += 1;
  publicBuckets.set(key, bucket);
  if (bucket.count > PUBLIC_LIMIT) return res.status(429).json({ message: 'Too many requests. Please try again shortly.' });
  next();
}

function getConversationResumeWindow(settings) {
  const minutes = Number(settings?.sessionResumeWindowMinutes) || 180;
  return minutes * 60 * 1000;
}

async function getOrCreateConversation(req, payload = {}, { startConversation = false } = {}) {
  const settings = await getAssistantSettings();
  await applyRetentionPolicy(settings).catch(() => {});
  const context = getClientContext(req, payload);
  const visitorId = sanitizeText(payload.visitorId || payload.visitor?.id || payload.visitor || '', 120) || createId('visitor');
  const sessionId = sanitizeText(payload.sessionId || payload.session || '', 120) || createId('session');
  const conversationId = sanitizeText(payload.conversationId || '', 120);
  let conversation = null;

  if (conversationId) {
    conversation = await AssistantConversation.findOne({ conversationId });
  }

  if (!conversation && payload.resumeConversationId) {
    conversation = await AssistantConversation.findOne({ conversationId: sanitizeText(payload.resumeConversationId, 120) });
  }

  if (!conversation && payload.visitorId) {
    conversation = await AssistantConversation.findOne({ visitorId, status: { $in: ['new', 'active', 'inactive'] } }).sort({ updatedAt: -1 });
    if (conversation && conversation.updatedAt && Date.now() - conversation.updatedAt.getTime() > getConversationResumeWindow(settings)) {
      conversation = null;
    }
  }

  if (!conversation) {
    const newConversationId = conversationId || createId('conv');
    conversation = await upsertConversationFromEvent({
      conversationId: newConversationId,
      sessionId,
      visitorId,
      context,
      metadata: payload.metadata || {},
      createIfMissing: true,
    });
  } else {
    conversation.sessionId = sessionId;
    conversation.visitorId = visitorId;
    conversation.lastActivityAt = new Date();
    conversation.metadata = { ...(conversation.metadata || {}), ...(payload.metadata || {}) };
    if (context.pageUrl && !conversation.startPageUrl) conversation.startPageUrl = context.pageUrl;
    if (context.pageTitle && !conversation.pageTitle) conversation.pageTitle = context.pageTitle;
    await conversation.save();
  }

  if (startConversation && !conversation.startedAt) {
    conversation.startedAt = new Date();
    conversation.status = 'active';
    conversation.lastActivityAt = new Date();
    await conversation.save();
  }

  return { conversation, settings, context, visitorId, sessionId };
}

async function trackConversationState(conversationId, updates = {}) {
  if (!conversationId) return null;
  const conversation = await AssistantConversation.findOne({ conversationId });
  if (!conversation) return null;
  Object.assign(conversation, updates);
  conversation.lastActivityAt = new Date();
  if (conversation.startedAt) {
    conversation.durationSeconds = Math.max(0, Math.round((conversation.lastActivityAt.getTime() - conversation.startedAt.getTime()) / 1000));
  }
  await conversation.save();
  return conversation;
}

assistantPublicRouter.use(rateLimit);

assistantPublicRouter.post('/conversations/start-or-resume', async (req, res, next) => {
  try {
    const { conversation } = await getOrCreateConversation(req, req.body || {});
    res.json({ conversation: serializeConversation(conversation) });
  } catch (error) {
    next(error);
  }
});

assistantPublicRouter.get('/conversations/current', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.query.conversationId || '', 120);
    const visitorId = sanitizeText(req.query.visitorId || '', 120);
    const sessionId = sanitizeText(req.query.sessionId || '', 120);
    let conversation = null;
    if (conversationId) {
      conversation = await AssistantConversation.findOne({ conversationId });
    } else if (visitorId) {
      conversation = await AssistantConversation.findOne({ visitorId, ...(sessionId ? { sessionId } : {}), status: { $in: ['new', 'active', 'inactive'] } }).sort({ updatedAt: -1 });
    }
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    res.json({ conversation: serializeConversation(conversation) });
  } catch (error) {
    next(error);
  }
});

assistantPublicRouter.post('/events', async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.conversationId || !body.eventType) return res.status(400).json({ message: 'Conversation and event type are required.' });
    const context = getClientContext(req, body);
    const event = await storeEvent({
      eventId: sanitizeText(body.eventId || createId('evt'), 120),
      conversationId: sanitizeText(body.conversationId, 120),
      eventType: sanitizeText(body.eventType, 80),
      eventTimestamp: body.eventTimestamp ? new Date(body.eventTimestamp) : new Date(),
      pageUrl: context.pageUrl,
      relatedMessageId: sanitizeText(body.relatedMessageId || '', 120),
      relatedKnowledgeEntryId: sanitizeText(body.relatedKnowledgeEntryId || '', 120),
      relatedCTA: body.relatedCTA || {},
      metadata: body.metadata || {},
    });

    if (event?.eventType === 'widget_opened') {
      await AssistantConversation.updateOne({ conversationId: sanitizeText(body.conversationId, 120) }, { $inc: { widgetOpens: 1 }, $set: { status: 'active' } }).catch(() => {});
      await trackConversationState(body.conversationId, { status: 'active' }).catch(() => {});
    }
    if (event?.eventType === 'widget_closed') {
      await AssistantConversation.updateOne({ conversationId: sanitizeText(body.conversationId, 120) }, { $inc: { widgetCloses: 1 }, $set: { status: 'inactive' } }).catch(() => {});
      await trackConversationState(body.conversationId, { status: 'inactive' }).catch(() => {});
    }
    if (event?.eventType === 'conversation_ended') await finalizeConversation(body.conversationId, { status: body.status || 'closed' }).catch(() => {});

    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

assistantPublicRouter.post('/messages', async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.conversationId || !body.sender || !body.messageText) return res.status(400).json({ message: 'Conversation, sender and message text are required.' });
    const context = getClientContext(req, body);
    const message = await storeMessage({
      messageId: sanitizeText(body.messageId || createId('msg'), 120),
      conversationId: sanitizeText(body.conversationId, 120),
      sender: body.sender,
      messageText: body.messageText,
      normalisedText: normalizeText(body.normalisedText || body.messageText || ''),
      messageType: body.messageType || 'text',
      sentAt: body.sentAt ? new Date(body.sentAt) : new Date(),
      deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : new Date(),
      responseDelay: Number(body.responseDelay) || 0,
      knowledgeEntryId: sanitizeText(body.knowledgeEntryId || '', 120),
      knowledgeSnapshot: body.knowledgeSnapshot || null,
      matchedPrimaryQuestion: String(body.matchedPrimaryQuestion || ''),
      matchedAlternativeQuestion: String(body.matchedAlternativeQuestion || ''),
      matchedKeywords: Array.isArray(body.matchedKeywords) ? dedupeArray(body.matchedKeywords) : [],
      matchingScore: Number(body.matchingScore) || 0,
      matchingConfidence: Number(body.matchingConfidence) || 0,
      category: String(body.category || ''),
      ctaLabel: String(body.ctaLabel || ''),
      ctaTarget: String(body.ctaTarget || ''),
      fallbackUsed: body.fallbackUsed === true,
      errorOccurred: body.errorOccurred === true,
      errorDetails: String(body.errorDetails || ''),
      metadata: { ...(body.metadata || {}), context },
    });
    res.status(201).json({ message });
  } catch (error) {
    if (error?.code === 11000) return res.json({ success: true });
    next(error);
  }
});

assistantPublicRouter.post('/end', async (req, res, next) => {
  try {
    const { conversationId, status = 'closed', metadata = {} } = req.body || {};
    if (!conversationId) return res.status(400).json({ message: 'Conversation ID is required.' });
    await storeEvent({
      conversationId: sanitizeText(conversationId, 120),
      eventType: status === 'inactive' ? 'conversation_marked_inactive' : 'conversation_ended',
      metadata,
    }).catch(() => {});
    const conversation = await finalizeConversation(sanitizeText(conversationId, 120), { status, metadata });
    res.json({ conversation: serializeConversation(conversation) });
  } catch (error) {
    next(error);
  }
});

assistantPublicRouter.post('/match', async (req, res, next) => {
  try {
    const body = req.body || {};
    const question = sanitizeText(body.question || body.messageText || '', 5000);
    if (!question) return res.status(400).json({ message: 'Question text is required.' });
    const { conversation, context, visitorId } = await getOrCreateConversation(req, body, { startConversation: true });
    const matchedAt = new Date();
    const knowledgeEntries = await loadEnabledKnowledgeEntries();
    const match = matchKnowledgeQuestion(question, knowledgeEntries);
    const wasStarted = Boolean(conversation.startedAt);
    const userMessage = await storeMessage({
      messageId: sanitizeText(body.userMessageId || createId('msg'), 120),
      conversationId: conversation.conversationId,
      sender: 'user',
      messageText: question,
      normalisedText: normalizeText(question),
      messageType: body.messageType === 'quick-question' ? 'quick-question' : 'text',
      sentAt: body.sentAt ? new Date(body.sentAt) : matchedAt,
      deliveredAt: matchedAt,
      metadata: { ...body.metadata, triggerType: body.messageType || 'text' },
    });
    await storeEvent({
      conversationId: conversation.conversationId,
      eventType: body.messageType === 'quick-question' ? 'quick_question_clicked' : 'message_sent',
      pageUrl: context.pageUrl,
      relatedMessageId: userMessage.messageId,
      metadata: { source: 'assistant-widget', messageType: body.messageType || 'text' },
    });

    const startedConversation = await markConversationStarted(conversation.conversationId, {
      ...context,
      detectedCategory: match.category || '',
      detectedIntent: match.matchType || '',
      matchedModule: match.entry?.id || '',
    });
    if (!wasStarted) {
      await storeEvent({
        conversationId: conversation.conversationId,
        eventType: 'conversation_started',
        pageUrl: context.pageUrl,
        relatedMessageId: userMessage.messageId,
        metadata: { source: 'assistant-widget' },
      });
    }

    const assistantMessage = await storeMessage({
      messageId: sanitizeText(body.assistantMessageId || createId('msg'), 120),
      conversationId: conversation.conversationId,
      sender: 'assistant',
      messageText: match.answer || PUBLIC_FALLBACK,
      normalisedText: normalizeText(match.answer || PUBLIC_FALLBACK),
      messageType: match.matchType === 'fallback' ? 'fallback' : 'assistant-answer',
      sentAt: matchedAt,
      deliveredAt: new Date(),
      responseDelay: Number(body.responseDelay) || 800,
      knowledgeEntryId: match.entry?.id || '',
      knowledgeSnapshot: match.entry ? normalizeKnowledgeEntry(match.entry) : null,
      matchedPrimaryQuestion: match.entry?.primaryQuestion || '',
      matchedAlternativeQuestion: Array.isArray(match.entry?.alternativeQuestions) ? match.entry.alternativeQuestions.find((item) => normalizeText(item) === normalizeText(question)) || '' : '',
      matchedKeywords: match.matchedKeywords || [],
      matchingScore: match.score || 0,
      matchingConfidence: match.confidence || 0,
      category: match.category || '',
      ctaLabel: match.ctaLabel || '',
      ctaTarget: match.ctaTarget || '',
      fallbackUsed: match.matchType === 'fallback',
      metadata: { ...body.metadata, source: 'manual-knowledge-engine' },
    });

    await storeEvent({
      conversationId: conversation.conversationId,
      eventType: match.matchType === 'fallback' ? 'fallback_response_used' : 'knowledge_answer_matched',
      pageUrl: context.pageUrl,
      relatedMessageId: assistantMessage.messageId,
      relatedKnowledgeEntryId: match.entry?.id || '',
      relatedCTA: match.ctaLabel ? { label: match.ctaLabel, target: match.ctaTarget } : {},
      metadata: { score: match.score, confidence: match.confidence, visitorId },
    });

    if (match.ctaLabel && match.ctaTarget) {
      await storeEvent({
        conversationId: conversation.conversationId,
        eventType: 'cta_displayed',
        pageUrl: context.pageUrl,
        relatedMessageId: assistantMessage.messageId,
        relatedKnowledgeEntryId: match.entry?.id || '',
        relatedCTA: { label: match.ctaLabel, target: match.ctaTarget },
      });
    }

    if (match.matchType === 'fallback' || (match.confidence || 0) < 0.35) {
      await recordUnmatchedQuestion({
        question,
        conversationId: conversation.conversationId,
        visitorId,
        pageUrl: context.pageUrl,
        suggestedCategory: match.category || '',
        matchCandidates: match.candidates || [],
        highestRejectedScore: match.score || 0,
        metadata: { confidence: match.confidence, score: match.score },
      });
      await AssistantConversation.updateOne({ conversationId: conversation.conversationId }, { $inc: { unmatchedQuestions: 1 } });
    } else {
      await AssistantConversation.updateOne({ conversationId: conversation.conversationId }, {
        $inc: { matchedQuestions: 1 },
        $set: {
          detectedCategory: match.category || '',
          detectedIntent: match.matchType || '',
          matchedModule: match.entry?.id || '',
          status: 'active',
        },
      });
    }

    if (match.ctaLabel === 'Book Demo' || /demo/i.test(match.ctaLabel || '') || /demo/i.test(question)) {
      await AssistantConversation.updateOne({ conversationId: conversation.conversationId }, { $set: { demoRequested: true } });
    }

    if (startedConversation?.startedAt) {
      await AssistantConversation.updateOne({ conversationId: conversation.conversationId }, {
        $set: {
          lastActivityAt: new Date(),
          durationSeconds: Math.max(0, Math.round((Date.now() - new Date(startedConversation.startedAt).getTime()) / 1000)),
        },
      });
    }

    res.json({
      conversationId: conversation.conversationId,
      message: userMessage,
      answer: assistantMessage,
      match: {
        matchType: match.matchType,
        score: match.score,
        confidence: match.confidence,
        entry: match.entry,
        candidates: match.candidates,
      },
    });
  } catch (error) {
    await storeEvent({
      conversationId: sanitizeText(req.body?.conversationId || '', 120),
      eventType: 'api_error',
      pageUrl: String(req.body?.pageUrl || ''),
      metadata: { message: error?.message || 'Unknown error' },
    }).catch(() => {});
    next(error);
  }
});

assistantAdminRouter.use(requireAdmin);

assistantAdminRouter.get('/assistant/conversations', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = buildConversationFilter(req.query || {});
    const sort = buildConversationSort(String(req.query.sort || 'newest'));
    const [items, total] = await Promise.all([
      AssistantConversation.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      AssistantConversation.countDocuments(filter),
    ]);
    res.json({
      items: items.map(serializeConversation),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/assistant/conversations/:conversationId', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const conversation = await AssistantConversation.findOne({ conversationId });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    const [messages, events, unmatched] = await Promise.all([
      AssistantMessage.find({ conversationId }).sort({ sentAt: 1 }),
      AssistantEvent.find({ conversationId }).sort({ eventTimestamp: 1 }),
      AssistantUnmatchedQuestion.find({ conversationId }).sort({ askedAt: -1 }),
    ]);
    res.json({
      conversation: serializeConversation(conversation),
      messages,
      events,
      unmatched,
    });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/assistant/conversations/:conversationId/messages', async (req, res, next) => {
  try {
    const items = await AssistantMessage.find({ conversationId: sanitizeText(req.params.conversationId, 120) }).sort({ sentAt: 1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/assistant/conversations/:conversationId/events', async (req, res, next) => {
  try {
    const items = await AssistantEvent.find({ conversationId: sanitizeText(req.params.conversationId, 120) }).sort({ eventTimestamp: 1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.patch('/assistant/conversations/:conversationId', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const updates = {};
    const allowedStatuses = ['new', 'active', 'inactive', 'closed', 'converted', 'abandoned', 'error'];
    if (allowedStatuses.includes(req.body?.status)) updates.status = req.body.status;
    if (typeof req.body?.rating === 'number' && req.body.rating >= 1 && req.body.rating <= 5) updates.rating = req.body.rating;
    if (typeof req.body?.detectedCategory === 'string') updates.detectedCategory = sanitizeText(req.body.detectedCategory, 80);
    if (typeof req.body?.detectedIntent === 'string') updates.detectedIntent = sanitizeText(req.body.detectedIntent, 120);
    if (typeof req.body?.matchedModule === 'string') updates.matchedModule = sanitizeText(req.body.matchedModule, 120);
    if (typeof req.body?.demoRequested === 'boolean') updates.demoRequested = req.body.demoRequested;
    if (typeof req.body?.contactDetailsSubmitted === 'boolean') updates.contactDetailsSubmitted = req.body.contactDetailsSubmitted;
    if (typeof req.body?.convertedToLead === 'boolean') updates.convertedToLead = req.body.convertedToLead;
    if (req.body?.leadId && mongoose.isValidObjectId(req.body.leadId)) updates.leadId = req.body.leadId;
    if (typeof req.body?.adminNotes === 'string') updates.adminNotes = [{ body: sanitizeText(req.body.adminNotes, 2000), adminId: req.admin?.id || 'admin' }];
    const conversation = await AssistantConversation.findOneAndUpdate({ conversationId }, { $set: updates }, { new: true });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    res.json({ conversation: serializeConversation(conversation) });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.post('/assistant/conversations/:conversationId/notes', async (req, res, next) => {
  try {
    const body = sanitizeText(req.body?.body || '', 2000);
    if (!body) return res.status(400).json({ message: 'A note is required.' });
    const conversation = await AssistantConversation.findOneAndUpdate(
      { conversationId: sanitizeText(req.params.conversationId, 120) },
      { $push: { adminNotes: { body, adminId: req.admin?.id || 'admin' } } },
      { new: true },
    );
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    res.json({ conversation: serializeConversation(conversation) });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.delete('/assistant/conversations/:conversationId', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const [conversation] = await Promise.all([
      AssistantConversation.findOneAndDelete({ conversationId }),
      AssistantMessage.deleteMany({ conversationId }),
      AssistantEvent.deleteMany({ conversationId }),
      AssistantUnmatchedQuestion.deleteMany({ conversationId }),
    ]);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/assistant/unmatched', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = buildUnmatchedFilter(req.query || {});
    const [items, total] = await Promise.all([
      AssistantUnmatchedQuestion.find(filter).sort({ askedAt: -1 }).skip((page - 1) * limit).limit(limit),
      AssistantUnmatchedQuestion.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.patch('/assistant/unmatched/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid unmatched question ID.' });
    const updates = {};
    if (['new', 'reviewed', 'ignored', 'linked'].includes(req.body?.reviewStatus)) updates.reviewStatus = req.body.reviewStatus;
    if (typeof req.body?.adminNotes === 'string') updates.adminNotes = sanitizeText(req.body.adminNotes, 2000);
    if (typeof req.body?.linkedKnowledgeEntryId === 'string') updates.linkedKnowledgeEntryId = sanitizeText(req.body.linkedKnowledgeEntryId, 120);
    const item = await AssistantUnmatchedQuestion.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!item) return res.status(404).json({ message: 'Unmatched question not found.' });
    res.json({ item });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.post('/assistant/unmatched/:id/convert', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid unmatched question ID.' });
    const item = await AssistantUnmatchedQuestion.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Unmatched question not found.' });
    const draft = {
      category: req.body?.category || item.suggestedCategory || 'General',
      primaryQuestion: req.body?.primaryQuestion || item.originalQuestion,
      alternativeQuestions: dedupeArray([item.originalQuestion, ...(Array.isArray(req.body?.alternativeQuestions) ? req.body.alternativeQuestions : [])]),
      keywords: dedupeArray([normalizeText(item.originalQuestion), ...(Array.isArray(req.body?.keywords) ? req.body.keywords : [])]),
      answer: sanitizeText(req.body?.answer || '', 5000),
      ctaLabel: sanitizeText(req.body?.ctaLabel || '', 90),
      ctaTarget: sanitizeText(req.body?.ctaTarget || '', 180),
      priority: Number(req.body?.priority) || 100,
      isEnabled: req.body?.isEnabled !== false,
    };
    if (!draft.primaryQuestion || !draft.answer) return res.status(400).json({ message: 'Primary question and answer are required.' });
    const created = await AIKnowledgeEntry.create(draft);
    item.reviewStatus = 'linked';
    item.linkedKnowledgeEntryId = String(created.id || created._id);
    await item.save();
    res.status(201).json({ knowledgeEntry: created, unmatchedQuestion: item });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'A matching knowledge entry already exists.' });
    next(error);
  }
});

assistantAdminRouter.get('/assistant/analytics', async (req, res, next) => {
  try {
    const summary = await buildAnalyticsSummary(req.query || {});
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/assistant/analytics/knowledge', async (req, res, next) => {
  try {
    const items = await getKnowledgeUsageStats(req.query || {});
    const sort = String(req.query.sort || 'most-used');
    const sorted = [...items].sort((left, right) => {
      if (sort === 'least-used') return left.totalMatched - right.totalMatched;
      if (sort === 'lowest-confidence') return left.averageMatchingConfidence - right.averageMatchingConfidence;
      if (sort === 'highest-cta') return right.ctaClicks - left.ctaClicks;
      if (sort === 'recently-added') return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
      if (sort === 'recently-updated') return new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0);
      return right.totalMatched - left.totalMatched;
    });
    res.json({ items: sorted });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/assistant/export/conversations', async (req, res, next) => {
  try {
    const format = String(req.query.format || 'csv').toLowerCase();
    const conversations = await AssistantConversation.find(buildConversationFilter(req.query || {})).sort({ startedAt: -1 });
    const safeRows = conversations.map((conversation) => ({
      conversationId: conversation.conversationId,
      sessionId: conversation.sessionId,
      visitorId: conversation.visitorId,
      status: conversation.status,
      pageUrl: conversation.startPageUrl,
      pageTitle: conversation.pageTitle,
      startedAt: conversation.startedAt?.toISOString() || '',
      endedAt: conversation.endedAt?.toISOString() || '',
      durationSeconds: conversation.durationSeconds || 0,
      totalMessageCount: conversation.totalMessageCount || 0,
      matchedQuestions: conversation.matchedQuestions || 0,
      unmatchedQuestions: conversation.unmatchedQuestions || 0,
      ctaClicks: conversation.ctaClicks || 0,
      detectedCategory: conversation.detectedCategory || '',
      detectedIntent: conversation.detectedIntent || '',
    }));
    if (format === 'json') return res.json({ items: safeRows });
    const rows = [
      ['conversationId', 'sessionId', 'visitorId', 'status', 'pageUrl', 'pageTitle', 'startedAt', 'endedAt', 'durationSeconds', 'totalMessageCount', 'matchedQuestions', 'unmatchedQuestions', 'ctaClicks', 'detectedCategory', 'detectedIntent'],
      ...safeRows.map((row) => Object.values(row)),
    ];
    res.type('text/csv').attachment('easy-lane-assistant-conversations.csv').send(toCsv(rows));
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/assistant/export/unmatched', async (req, res, next) => {
  try {
    const format = String(req.query.format || 'csv').toLowerCase();
    const items = await AssistantUnmatchedQuestion.find(buildUnmatchedFilter(req.query || {})).sort({ askedAt: -1 });
    const safeRows = items.map((item) => ({
      originalQuestion: item.originalQuestion,
      normalizedQuestion: item.normalizedQuestion,
      conversationId: item.conversationId,
      visitorId: item.visitorId,
      askedAt: item.askedAt?.toISOString() || '',
      pageUrl: item.pageUrl || '',
      suggestedCategory: item.suggestedCategory || '',
      highestRejectedScore: item.highestRejectedScore || 0,
      timesAsked: item.timesAsked || 0,
      reviewStatus: item.reviewStatus || 'new',
      linkedKnowledgeEntryId: item.linkedKnowledgeEntryId || '',
    }));
    if (format === 'json') return res.json({ items: safeRows });
    const rows = [
      ['originalQuestion', 'normalizedQuestion', 'conversationId', 'visitorId', 'askedAt', 'pageUrl', 'suggestedCategory', 'highestRejectedScore', 'timesAsked', 'reviewStatus', 'linkedKnowledgeEntryId'],
      ...safeRows.map((row) => Object.values(row)),
    ];
    res.type('text/csv').attachment('easy-lane-unmatched-questions.csv').send(toCsv(rows));
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/assistant/settings', async (_, res, next) => {
  try {
    const settings = await getAssistantSettings();
    res.json({ settings });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.patch('/assistant/settings', async (req, res, next) => {
  try {
    const settings = await AssistantSettings.findOneAndUpdate(
      { key: 'assistant' },
      {
        $set: {
          inactivityTimeoutMinutes: Number(req.body?.inactivityTimeoutMinutes) || 30,
          sessionResumeWindowMinutes: Number(req.body?.sessionResumeWindowMinutes) || 180,
          dataRetentionDays: Number(req.body?.dataRetentionDays) || 90,
          collectTechnicalMetadata: req.body?.collectTechnicalMetadata === true,
          logIpAddress: req.body?.logIpAddress === true,
          allowExports: req.body?.allowExports !== false,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    res.json({ settings });
  } catch (error) {
    next(error);
  }
});

assistantPublicRouter.post('/conversations/start', async (req, res, next) => {
  try {
    const { conversation } = await getOrCreateConversation(req, req.body || {});
    res.json({ conversation: serializeConversation(conversation) });
  } catch (error) {
    next(error);
  }
});

assistantPublicRouter.post('/conversations/:conversationId/messages', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const body = req.body || {};
    if (!conversationId || !body.sender || !body.messageText) return res.status(400).json({ message: 'Conversation, sender and message text are required.' });
    const message = await storeMessage({
      messageId: sanitizeText(body.messageId || createId('msg'), 120),
      conversationId,
      sender: body.sender,
      messageText: body.messageText,
      messageType: body.messageType || 'text',
      sentAt: body.sentAt ? new Date(body.sentAt) : new Date(),
      deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : new Date(),
      responseDelay: Number(body.responseDelay) || 0,
      knowledgeEntryId: sanitizeText(body.knowledgeEntryId || '', 120),
      matchedPrimaryQuestion: String(body.matchedPrimaryQuestion || ''),
      matchedAlternativeQuestion: String(body.matchedAlternativeQuestion || ''),
      matchedKeywords: Array.isArray(body.matchedKeywords) ? dedupeArray(body.matchedKeywords) : [],
      matchingScore: Number(body.matchingScore) || 0,
      matchingConfidence: Number(body.matchingConfidence) || 0,
      category: String(body.category || ''),
      ctaLabel: String(body.ctaLabel || ''),
      ctaTarget: String(body.ctaTarget || ''),
      fallbackUsed: body.fallbackUsed === true,
      errorOccurred: body.errorOccurred === true,
      errorDetails: String(body.errorDetails || ''),
      metadata: body.metadata || {},
    });
    res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
});

assistantPublicRouter.post('/conversations/:conversationId/events', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const body = req.body || {};
    if (!conversationId || !body.eventType) return res.status(400).json({ message: 'Conversation and event type are required.' });
    const event = await storeEvent({
      eventId: sanitizeText(body.eventId || createId('evt'), 120),
      conversationId,
      eventType: sanitizeText(body.eventType, 80),
      eventTimestamp: body.occurredAt ? new Date(body.occurredAt) : body.eventTimestamp ? new Date(body.eventTimestamp) : new Date(),
      pageUrl: String(body.pageUrl || ''),
      relatedMessageId: sanitizeText(body.relatedMessageId || '', 120),
      relatedKnowledgeEntryId: sanitizeText(body.relatedKnowledgeEntryId || '', 120),
      relatedCTA: body.relatedCTA || {},
      metadata: body.metadata || {},
    });
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

assistantPublicRouter.patch('/conversations/:conversationId/status', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const status = String(req.body?.status || '').trim();
    if (!conversationId) return res.status(400).json({ message: 'Conversation ID is required.' });
    const conversation = await AssistantConversation.findOneAndUpdate(
      { conversationId },
      { $set: { status }, ...(req.body?.endedAt ? { $set: { status, endedAt: new Date(req.body.endedAt) } } : {}) },
      { new: true },
    );
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    res.json({ success: true, conversation: serializeConversation(conversation) });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/ai-conversations', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = buildConversationFilter(req.query || {});
    const sort = buildConversationSort(String(req.query.sort || 'newest'));
    const [conversations, total, analytics] = await Promise.all([
      AssistantConversation.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      AssistantConversation.countDocuments(filter),
      buildAnalyticsSummary(req.query || {}),
    ]);
    res.json({
      success: true,
      data: {
        conversations: conversations.map(serializeConversation),
        pagination: {
          page,
          limit,
          total,
          pages: total ? Math.max(1, Math.ceil(total / limit)) : 0,
        },
        summary: {
          totalConversations: analytics.totals?.conversationsStarted ? analytics.totals.conversationsStarted : conversations.length,
          activeConversations: analytics.totals?.activeConversations || 0,
          totalMessages: analytics.totals?.totalMessages || 0,
          matchedQuestions: conversations.reduce((sum, item) => sum + (item.matchedQuestions || 0), 0),
          unmatchedQuestions: conversations.reduce((sum, item) => sum + (item.unmatchedQuestions || 0), 0),
          averageDurationSeconds: analytics.totals?.averageConversationDuration || 0,
        },
        analytics,
      },
    });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/ai-conversations/:conversationId', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const conversation = await AssistantConversation.findOne({ conversationId });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    const [messages, events, unmatched] = await Promise.all([
      AssistantMessage.find({ conversationId }).sort({ sentAt: 1 }),
      AssistantEvent.find({ conversationId }).sort({ eventTimestamp: 1 }),
      AssistantUnmatchedQuestion.find({ conversationId }).sort({ askedAt: -1 }),
    ]);
    res.json({ success: true, data: { conversation: serializeConversation(conversation), messages, events, unmatched } });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/ai-conversations/:conversationId/messages', async (req, res, next) => {
  try {
    const items = await AssistantMessage.find({ conversationId: sanitizeText(req.params.conversationId, 120) }).sort({ sentAt: 1 });
    res.json({ success: true, data: { messages: items } });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/ai-conversations/:conversationId/events', async (req, res, next) => {
  try {
    const items = await AssistantEvent.find({ conversationId: sanitizeText(req.params.conversationId, 120) }).sort({ eventTimestamp: 1 });
    res.json({ success: true, data: { events: items } });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.patch('/ai-conversations/:conversationId/status', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const status = String(req.body?.status || '').trim();
    const allowedStatuses = ['new', 'active', 'inactive', 'closed', 'converted', 'abandoned', 'error'];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    const conversation = await AssistantConversation.findOneAndUpdate({ conversationId }, { $set: { status } }, { new: true });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    res.json({ success: true, data: { conversation: serializeConversation(conversation) } });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.patch('/ai-conversations/:conversationId/notes', async (req, res, next) => {
  try {
    const body = sanitizeText(req.body?.body || '', 2000);
    if (!body) return res.status(400).json({ message: 'A note is required.' });
    const conversation = await AssistantConversation.findOneAndUpdate(
      { conversationId: sanitizeText(req.params.conversationId, 120) },
      { $push: { adminNotes: { body, adminId: req.admin?.id || 'admin' } } },
      { new: true },
    );
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    res.json({ success: true, data: { conversation: serializeConversation(conversation) } });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.delete('/ai-conversations/:conversationId', async (req, res, next) => {
  try {
    const conversationId = sanitizeText(req.params.conversationId, 120);
    const [conversation] = await Promise.all([
      AssistantConversation.findOneAndDelete({ conversationId }),
      AssistantMessage.deleteMany({ conversationId }),
      AssistantEvent.deleteMany({ conversationId }),
      AssistantUnmatchedQuestion.deleteMany({ conversationId }),
    ]);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

assistantAdminRouter.get('/ai-conversations-analytics', async (req, res, next) => {
  try {
    const analytics = await buildAnalyticsSummary(req.query || {});
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
});
