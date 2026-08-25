import express from 'express';
import mongoose from 'mongoose';
import { requireAdmin } from '../auth.js';
import { AIKnowledgeConfig } from '../models/AIKnowledgeConfig.js';
import { AIKnowledgeEntry } from '../models/AIKnowledgeEntry.js';
import { AIKnowledgeImport } from '../models/AIKnowledgeImport.js';
import {
  buildKnowledgeSummary,
  buildKnowledgeWorkbookBuffer,
  getKnowledgeLanguageOptions,
  getKnowledgeModuleOptions,
  getKnowledgePriorityOptions,
  normalizeKnowledgeText,
  parseKnowledgeWorkbook,
  projectKnowledgeEntry,
  publicKnowledgeEntry,
  sanitizeKnowledgeRecord,
  validateKnowledgeEntry,
  validateKnowledgeWorkbook,
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
  if (params.module) query.module = String(params.module).trim();
  if (params.topic) query.topic = new RegExp(escapeRegExp(String(params.topic).trim()), 'i');
  if (params.language) query.language = String(params.language).trim();
  if (params.priority) query.priorityLabel = String(params.priority).trim();
  if (params.status === 'active') query.active = true;
  if (params.status === 'inactive') query.active = false;
  if (search) {
    const term = new RegExp(escapeRegExp(search), 'i');
    query.$or = [
      { recordId: term },
      { module: term },
      { topic: term },
      { subtopic: term },
      { questionTrigger: term },
      { approvedAnswer: term },
      { keywords: term },
      { sourceOwner: term },
    ];
  }
  return query;
}

function buildSort(sortField, sortDirection) {
  if (sortField === 'updatedAt') return { updatedAt: sortDirection, createdAt: -1 };
  if (sortField === 'recordId') return { recordId: sortDirection, updatedAt: -1 };
  if (sortField === 'topic') return { topic: sortDirection, updatedAt: -1 };
  if (sortField === 'priorityLabel') return { priorityRank: -sortDirection, updatedAt: -1 };
  return { updatedAt: -1, createdAt: -1 };
}

function allowedWorkbookFilename(value = '') {
  return /\.xlsx$/i.test(String(value || '').trim());
}

function ensureBase64Workbook(value = '') {
  try {
    return Buffer.from(String(value || ''), 'base64');
  } catch {
    return null;
  }
}

async function getKnowledgeConfig() {
  const config = await AIKnowledgeConfig.findOneAndUpdate(
    { key: 'chatbot-knowledge' },
    { $setOnInsert: { demoBookingConfig: [], outOfScopeRules: [], lastPublishedAt: null, lastPublishedImportId: '' } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return config;
}

async function findEntryByRecordId(recordId = '', excludeId = '') {
  if (!recordId) return null;
  return AIKnowledgeEntry.findOne({
    recordId,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  }).select('_id');
}

function importSummaryFromDocument(item) {
  return {
    id: String(item._id || item.id || ''),
    fileName: item.fileName || '',
    uploadedBy: item.uploadedBy || '',
    uploadedAt: item.uploadedAt || item.createdAt || null,
    totalRows: item.totalRows || 0,
    createdCount: item.createdCount || 0,
    updatedCount: item.updatedCount || 0,
    unchangedCount: item.unchangedCount || 0,
    errorCount: item.errorCount || 0,
    warningCount: item.warningCount || 0,
    status: item.status || 'draft',
  };
}

publicRouter.get('/assistant/knowledge', async (_, res, next) => {
  try {
    const entries = await AIKnowledgeEntry.find({ active: true }).sort({ priorityRank: -1, updatedAt: -1 });
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

adminRouter.get('/chatbot/knowledge/meta', requireAdmin, async (_, res, next) => {
  try {
    const [config, records] = await Promise.all([getKnowledgeConfig(), AIKnowledgeEntry.find().select('active isEnabled')]);
    res.json({
      modules: getKnowledgeModuleOptions(),
      languages: getKnowledgeLanguageOptions(),
      priorities: getKnowledgePriorityOptions(),
      summary: buildKnowledgeSummary(records, config),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/chatbot/knowledge/template', requireAdmin, async (_, res, next) => {
  try {
    const buffer = buildKnowledgeWorkbookBuffer();
    res
      .status(200)
      .set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .set('Content-Disposition', 'attachment; filename="EasyLane_Knowledge_Base_Template.xlsx"')
      .send(buffer);
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/chatbot/knowledge/imports', requireAdmin, async (_, res, next) => {
  try {
    const imports = await AIKnowledgeImport.find().sort({ uploadedAt: -1, createdAt: -1 }).limit(10);
    res.json({ items: imports.map(importSummaryFromDocument) });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/chatbot/knowledge', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const sortField = ['updatedAt', 'recordId', 'topic', 'priorityLabel'].includes(String(req.query.sort)) ? String(req.query.sort) : 'updatedAt';
    const sortDirection = String(req.query.direction).toLowerCase() === 'asc' ? 1 : -1;
    const filter = buildSearchQuery(req.query);

    const [items, total, config, allRecords] = await Promise.all([
      AIKnowledgeEntry.find(filter).sort(buildSort(sortField, sortDirection)).skip((page - 1) * limit).limit(limit),
      AIKnowledgeEntry.countDocuments(filter),
      getKnowledgeConfig(),
      AIKnowledgeEntry.find().select('active isEnabled'),
    ]);

    res.json({
      items: items.map(projectKnowledgeEntry),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      summary: buildKnowledgeSummary(allRecords, config),
      modules: getKnowledgeModuleOptions(),
      languages: getKnowledgeLanguageOptions(),
      priorities: getKnowledgePriorityOptions(),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/chatbot/knowledge/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid knowledge entry ID.' });
    const entry = await AIKnowledgeEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Knowledge record not found.' });
    res.json(projectKnowledgeEntry(entry));
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/chatbot/knowledge', requireAdmin, async (req, res, next) => {
  try {
    const { errors, value } = validateKnowledgeEntry(req.body || {});
    if (errors.length) return respondValidationError(res, errors[0], errors);
    if (await findEntryByRecordId(value.recordId)) return res.status(409).json({ message: 'A knowledge record with this Record ID already exists.' });
    const created = await AIKnowledgeEntry.create(sanitizeKnowledgeRecord(value));
    res.status(201).json(projectKnowledgeEntry(created));
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'A knowledge record with this Record ID already exists.' });
    next(error);
  }
});

adminRouter.put('/chatbot/knowledge/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid knowledge entry ID.' });
    const entry = await AIKnowledgeEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Knowledge record not found.' });
    const merged = { ...entry.toObject(), ...req.body };
    const { errors, value } = validateKnowledgeEntry(merged);
    if (errors.length) return respondValidationError(res, errors[0], errors);
    if (await findEntryByRecordId(value.recordId, req.params.id)) return res.status(409).json({ message: 'A knowledge record with this Record ID already exists.' });
    Object.assign(entry, sanitizeKnowledgeRecord(value));
    await entry.save();
    res.json(projectKnowledgeEntry(entry));
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'A knowledge record with this Record ID already exists.' });
    next(error);
  }
});

adminRouter.delete('/chatbot/knowledge/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid knowledge entry ID.' });
    const deleted = await AIKnowledgeEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Knowledge record not found.' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/chatbot/knowledge/upload', requireAdmin, async (req, res, next) => {
  try {
    const fileName = String(req.body?.fileName || '').trim();
    const contentBase64 = String(req.body?.contentBase64 || '').trim();
    if (!allowedWorkbookFilename(fileName)) return respondValidationError(res, 'Only .xlsx knowledge base files are supported.');
    if (!contentBase64) return respondValidationError(res, 'Workbook content is required.');

    const buffer = ensureBase64Workbook(contentBase64);
    if (!buffer || !buffer.length) return respondValidationError(res, 'The uploaded workbook could not be processed.');
    if (buffer.length > 5 * 1024 * 1024) return respondValidationError(res, 'Workbook size must be 5MB or smaller.');

    const workbook = parseKnowledgeWorkbook(buffer);
    const existingRecords = await AIKnowledgeEntry.find();
    const validation = validateKnowledgeWorkbook(workbook, existingRecords);

    const created = await AIKnowledgeImport.create({
      fileName,
      uploadedBy: req.admin?.id || 'admin',
      uploadedAt: new Date(),
      totalRows: validation.summary?.totalRows || 0,
      validRows: validation.summary?.validRecords || 0,
      warningCount: validation.summary?.warningCount || 0,
      errorCount: validation.summary?.errorCount || 0,
      createdCount: validation.summary?.newRecords || 0,
      updatedCount: validation.summary?.updatedRecords || 0,
      unchangedCount: validation.summary?.unchangedRecords || 0,
      status: validation.valid ? 'validated' : 'validation_failed',
      summary: validation.summary || {},
      previewRows: validation.previewRows || [],
      payload: validation.payload || {},
    });

    res.status(201).json({
      importId: String(created._id),
      fileName,
      status: created.status,
      summary: created.summary,
      previewRows: created.previewRows,
      errors: validation.errors,
      warnings: validation.warnings,
      canPublish: validation.valid,
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/chatbot/knowledge/publish', requireAdmin, async (req, res, next) => {
  try {
    const importId = String(req.body?.importId || '').trim();
    if (!mongoose.isValidObjectId(importId)) return respondValidationError(res, 'A valid import preview is required before publishing.');
    const importRecord = await AIKnowledgeImport.findById(importId);
    if (!importRecord) return res.status(404).json({ message: 'Import preview not found.' });
    if (importRecord.status !== 'validated') return respondValidationError(res, 'This import cannot be published because validation did not succeed.');

    const payload = importRecord.payload || {};
    const records = Array.isArray(payload.records) ? payload.records : [];
    let createdCount = 0;
    let updatedCount = 0;
    let unchangedCount = 0;
    const publishErrors = [];

    for (const record of records) {
      try {
        const existing = await AIKnowledgeEntry.findOne({ recordId: record.recordId });
        const sanitized = sanitizeKnowledgeRecord({
          ...record,
          lastImportedAt: new Date(),
          lastUpdated: record.lastUpdatedLabel || record.updatedAt || new Date(),
        });
        if (!existing) {
          await AIKnowledgeEntry.create(sanitized);
          createdCount += 1;
          continue;
        }

        const existingProjection = projectKnowledgeEntry(existing);
        const nextProjection = projectKnowledgeEntry({ ...existing.toObject(), ...sanitized });
        if (JSON.stringify(existingProjection) === JSON.stringify(nextProjection)) {
          unchangedCount += 1;
          continue;
        }

        Object.assign(existing, sanitized);
        await existing.save();
        updatedCount += 1;
      } catch (error) {
        publishErrors.push(`Record ${record.recordId}: ${error.message || 'Publish failed.'}`);
      }
    }

    const config = await getKnowledgeConfig();
    config.demoBookingConfig = Array.isArray(payload.demoBookingConfig) ? payload.demoBookingConfig : [];
    config.outOfScopeRules = Array.isArray(payload.outOfScopeRules) ? payload.outOfScopeRules : [];
    config.lastPublishedAt = new Date();
    config.lastPublishedImportId = importId;
    await config.save();

    importRecord.status = publishErrors.length ? 'publish_failed' : 'published';
    importRecord.createdCount = createdCount;
    importRecord.updatedCount = updatedCount;
    importRecord.unchangedCount = unchangedCount;
    importRecord.errorCount = publishErrors.length;
    importRecord.summary = {
      ...(importRecord.summary || {}),
      createdRecords: createdCount,
      updatedRecords: updatedCount,
      unchangedRecords: unchangedCount,
      publishErrors: publishErrors.length,
    };
    await importRecord.save();

    res.json({
      success: publishErrors.length === 0,
      createdCount,
      updatedCount,
      unchangedCount,
      publishErrors,
    });
  } catch (error) {
    next(error);
  }
});

export { adminRouter as aiKnowledgeAdminRouter, publicRouter as aiKnowledgePublicRouter };
