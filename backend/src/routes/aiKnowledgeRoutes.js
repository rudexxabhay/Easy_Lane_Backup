import express from 'express';
import mongoose from 'mongoose';
import { requireAdmin } from '../auth.js';
import { AIKnowledgeEntry } from '../models/AIKnowledgeEntry.js';
import {
  parseKnowledgeImportPayload,
  projectKnowledgeEntry,
  publicKnowledgeEntry,
  sanitizeKnowledgeRecord,
  serializeKnowledgeCsv,
  slugifyKnowledgeQuestion,
  validateKnowledgeEntry,
} from '../services/aiKnowledge.js';

const adminRouter = express.Router();
const publicRouter = express.Router();

const escapeRegExp = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function respondValidationError(res, message, details = undefined) {
  return res.status(400).json(details ? { message, details } : { message });
}

function buildSearchQuery(params = {}) {
  const query = {};
  const search = String(params.search || '').trim();
  const category = String(params.category || '').trim();
  const isEnabled = String(params.isEnabled || '').trim().toLowerCase();
  if (category) query.category = category;
  if (['true', 'false'].includes(isEnabled)) query.isEnabled = isEnabled === 'true';
  if (search) {
    const term = new RegExp(escapeRegExp(search), 'i');
    query.$or = [
      { category: term },
      { primaryQuestion: term },
      { answer: term },
      { ctaLabel: term },
      { ctaTarget: term },
      { alternativeQuestions: term },
      { keywords: term },
    ];
  }
  return query;
}

function buildSort(sortField, sortDirection) {
  if (sortField === 'priority') return { priority: sortDirection, updatedAt: -1, createdAt: -1 };
  if (sortField === 'createdAt') return { createdAt: sortDirection, priority: -1, updatedAt: -1 };
  if (sortField === 'updatedAt') return { updatedAt: sortDirection, priority: -1, createdAt: -1 };
  return { primaryQuestion: sortDirection, priority: -1, updatedAt: -1 };
}

async function isDuplicatePrimaryQuestion(primaryQuestionKey, excludeId = '') {
  const existing = await AIKnowledgeEntry.findOne({
    primaryQuestionKey,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  }).select('_id');
  return Boolean(existing);
}

function normalizeImportedRows(rawRows = []) {
  return rawRows.map((row, index) => ({
    rowNumber: index + 2,
    category: row?.category,
    primaryQuestion: row?.primaryQuestion,
    alternativeQuestions: row?.alternativeQuestions,
    keywords: row?.keywords,
    answer: row?.answer,
    ctaLabel: row?.ctaLabel,
    ctaTarget: row?.ctaTarget,
    priority: row?.priority,
    isEnabled: row?.isEnabled,
  }));
}

function normalizeImportRow(row = {}) {
  return {
    category: row.category,
    primaryQuestion: row.primaryQuestion,
    alternativeQuestions: row.alternativeQuestions,
    keywords: row.keywords,
    answer: row.answer,
    ctaLabel: row.ctaLabel,
    ctaTarget: row.ctaTarget,
    priority: row.priority,
    isEnabled: row.isEnabled,
  };
}

publicRouter.get('/assistant/knowledge', async (_, res, next) => {
  try {
    const entries = await AIKnowledgeEntry.find({ isEnabled: true }).sort({ priority: -1, updatedAt: -1 });
    res.set('Cache-Control', 'no-store');
    const updatedAt = entries.reduce((latest, entry) => {
      const stamp = entry.updatedAt ? new Date(entry.updatedAt).getTime() : 0;
      return Math.max(latest, stamp);
    }, 0);
    res.json({ entries: entries.map(publicKnowledgeEntry), version: updatedAt || Date.now() });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/ai-knowledge', requireAdmin, async (req, res, next) => {
  try {
    const query = buildSearchQuery(req.query);
    const sortField = ['priority', 'createdAt', 'updatedAt', 'primaryQuestion'].includes(String(req.query.sort)) ? String(req.query.sort) : 'priority';
    const sortDirection = String(req.query.direction).toLowerCase() === 'asc' ? 1 : -1;
    const entries = await AIKnowledgeEntry.find(query).sort(buildSort(sortField, sortDirection));
    res.json({ items: entries.map(projectKnowledgeEntry) });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/ai-knowledge/export', requireAdmin, async (req, res, next) => {
  try {
    const format = String(req.query.format || 'csv').toLowerCase() === 'json' ? 'json' : 'csv';
    const sortField = ['priority', 'createdAt', 'updatedAt', 'primaryQuestion'].includes(String(req.query.sort)) ? String(req.query.sort) : 'priority';
    const sortDirection = String(req.query.direction).toLowerCase() === 'asc' ? 1 : -1;
    const entries = await AIKnowledgeEntry.find(buildSearchQuery(req.query)).sort(buildSort(sortField, sortDirection));
    if (format === 'json') {
      res.json({ items: entries.map(projectKnowledgeEntry) });
      return;
    }
    res.type('text/csv').attachment('easy-lane-ai-knowledge.csv').send(serializeKnowledgeCsv(entries));
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/ai-knowledge/bulk-import', requireAdmin, async (req, res, next) => {
  try {
    const rawRows = normalizeImportedRows(parseKnowledgeImportPayload(req.body || {}));
    if (!rawRows.length) return respondValidationError(res, 'No import rows were found.');

    const existingEntries = await AIKnowledgeEntry.find().select('primaryQuestionKey');
    const seenKeys = new Set(existingEntries.map((entry) => entry.primaryQuestionKey));
    const rows = [];
    const validDocs = [];
    let validCount = 0;
    let invalidCount = 0;
    let duplicateCount = 0;

    for (const rawRow of rawRows) {
      const { errors, value } = validateKnowledgeEntry(normalizeImportRow(rawRow));
      const rowState = { rowNumber: rawRow.rowNumber, status: 'valid', errors: [] };

      if (errors.length) {
        invalidCount += 1;
        rowState.status = 'invalid';
        rowState.errors = errors;
        rows.push(rowState);
        continue;
      }

      if (seenKeys.has(value.primaryQuestionKey)) {
        duplicateCount += 1;
        rowState.status = 'duplicate';
        rowState.errors = ['Duplicate primary question.'];
        rows.push(rowState);
        continue;
      }

      seenKeys.add(value.primaryQuestionKey);
      validCount += 1;
      rows.push(rowState);
      validDocs.push({
        category: value.category,
        primaryQuestion: value.primaryQuestion,
        alternativeQuestions: value.alternativeQuestions,
        keywords: value.keywords,
        answer: value.answer,
        ctaLabel: value.ctaLabel,
        ctaTarget: value.ctaTarget,
        priority: value.priority,
        isEnabled: value.isEnabled,
      });
    }

    const imported = validDocs.length ? await AIKnowledgeEntry.insertMany(validDocs, { ordered: false }) : [];
    res.status(201).json({
      totalRows: rawRows.length,
      validCount,
      invalidCount,
      duplicateCount,
      importedCount: imported.length,
      rows,
    });
  } catch (error) {
    if (error?.name === 'SyntaxError') return respondValidationError(res, 'Invalid JSON import payload.');
    next(error);
  }
});

adminRouter.post('/ai-knowledge/bulk-enable', requireAdmin, async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? [...new Set(req.body.ids.map(String))] : [];
    if (!ids.length) return respondValidationError(res, 'At least one knowledge entry ID is required.');
    const result = await AIKnowledgeEntry.updateMany({ _id: { $in: ids } }, { $set: { isEnabled: true } });
    res.json({ modifiedCount: result.modifiedCount || 0 });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/ai-knowledge/bulk-disable', requireAdmin, async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? [...new Set(req.body.ids.map(String))] : [];
    if (!ids.length) return respondValidationError(res, 'At least one knowledge entry ID is required.');
    const result = await AIKnowledgeEntry.updateMany({ _id: { $in: ids } }, { $set: { isEnabled: false } });
    res.json({ modifiedCount: result.modifiedCount || 0 });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/ai-knowledge/bulk-delete', requireAdmin, async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? [...new Set(req.body.ids.map(String))] : [];
    if (!ids.length) return respondValidationError(res, 'At least one knowledge entry ID is required.');
    const result = await AIKnowledgeEntry.deleteMany({ _id: { $in: ids } });
    res.json({ deletedCount: result.deletedCount || 0 });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/ai-knowledge/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid knowledge entry ID.' });
    const entry = await AIKnowledgeEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Knowledge entry not found.' });
    res.json(projectKnowledgeEntry(entry));
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/ai-knowledge', requireAdmin, async (req, res, next) => {
  try {
    const { errors, value } = validateKnowledgeEntry(req.body || {});
    if (errors.length) return respondValidationError(res, errors[0], errors);
    if (await isDuplicatePrimaryQuestion(value.primaryQuestionKey)) return res.status(409).json({ message: 'A knowledge entry with this primary question already exists.' });
    const created = await AIKnowledgeEntry.create(sanitizeKnowledgeRecord(value));
    res.status(201).json(projectKnowledgeEntry(created));
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'A knowledge entry with this primary question already exists.' });
    if (error?.name === 'ValidationError') return respondValidationError(res, Object.values(error.errors).map(({ message }) => message).join(' '));
    next(error);
  }
});

adminRouter.patch('/ai-knowledge/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid knowledge entry ID.' });
    const entry = await AIKnowledgeEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Knowledge entry not found.' });
    const merged = {
      ...entry.toObject(),
      ...req.body,
      primaryQuestion: req.body?.primaryQuestion ?? entry.primaryQuestion,
    };
    const { errors, value } = validateKnowledgeEntry(merged);
    if (errors.length) return respondValidationError(res, errors[0], errors);
    if (await isDuplicatePrimaryQuestion(value.primaryQuestionKey, req.params.id)) return res.status(409).json({ message: 'A knowledge entry with this primary question already exists.' });
    Object.assign(entry, sanitizeKnowledgeRecord(value));
    await entry.save();
    res.json(projectKnowledgeEntry(entry));
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'A knowledge entry with this primary question already exists.' });
    if (error?.name === 'ValidationError') return respondValidationError(res, Object.values(error.errors).map(({ message }) => message).join(' '));
    next(error);
  }
});

adminRouter.post('/ai-knowledge/:id/duplicate', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid knowledge entry ID.' });
    const entry = await AIKnowledgeEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Knowledge entry not found.' });
    const candidate = sanitizeKnowledgeRecord({
      ...projectKnowledgeEntry(entry),
      primaryQuestion: `${entry.primaryQuestion} (Copy)`,
      isEnabled: false,
    });
    if (await isDuplicatePrimaryQuestion(candidate.primaryQuestionKey)) {
      candidate.primaryQuestion = `${entry.primaryQuestion} (Copy ${Date.now().toString(36)})`;
      candidate.primaryQuestionKey = slugifyKnowledgeQuestion(candidate.primaryQuestion);
    }
    const created = await AIKnowledgeEntry.create(candidate);
    res.status(201).json(projectKnowledgeEntry(created));
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'A duplicate entry already exists.' });
    next(error);
  }
});

adminRouter.delete('/ai-knowledge/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid knowledge entry ID.' });
    const deleted = await AIKnowledgeEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Knowledge entry not found.' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export { adminRouter as aiKnowledgeAdminRouter, publicRouter as aiKnowledgePublicRouter };
