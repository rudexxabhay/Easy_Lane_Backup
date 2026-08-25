import mongoose from 'mongoose';
import {
  cleanKnowledgeString,
  getKnowledgeModuleOptions,
  getKnowledgeLanguageOptions,
  getKnowledgePriorityOptions,
  getLegacyKnowledgeCategoryOptions,
  normalizeKnowledgeText,
  normalizeKnowledgeKeywords,
  parseKnowledgeDate,
  priorityLabelToRank,
  splitKnowledgeList,
} from '../services/aiKnowledge.js';

const categories = getLegacyKnowledgeCategoryOptions();
const modules = getKnowledgeModuleOptions();
const languages = getKnowledgeLanguageOptions();
const priorities = getKnowledgePriorityOptions();

const responseVariantSchema = new mongoose.Schema({
  variantId: { type: String, required: true, trim: true, maxlength: 120 },
  language: { type: String, enum: languages, default: 'ALL' },
  variantNo: { type: Number, default: 1, min: 1 },
  approvedResponseVariant: { type: String, required: true, trim: true, maxlength: 5000 },
  active: { type: Boolean, default: true },
}, { _id: false });

const aiKnowledgeEntrySchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true, trim: true, maxlength: 120, index: true },
  module: { type: String, required: true, enum: modules, default: 'Easy Lane', index: true },
  topic: { type: String, required: true, trim: true, maxlength: 180, index: true },
  subtopic: { type: String, trim: true, maxlength: 180, default: '' },
  contentType: { type: String, trim: true, maxlength: 120, default: 'FAQ', index: true },
  questionTrigger: { type: String, required: true, trim: true, maxlength: 220 },
  approvedAnswer: { type: String, required: true, trim: true, maxlength: 5000 },
  language: { type: String, required: true, enum: languages, default: 'ALL', index: true },
  priorityLabel: { type: String, required: true, enum: priorities, default: 'Medium', index: true },
  priorityRank: { type: Number, default: 2, min: 1, max: 3, index: true },
  active: { type: Boolean, default: true, index: true },
  sourceOwner: { type: String, trim: true, maxlength: 180, default: '' },
  responseVariants: { type: [responseVariantSchema], default: [] },
  lastImportedAt: { type: Date, default: null },
  lastUpdatedLabel: { type: Date, default: null },
  category: { type: String, required: true, enum: categories, default: 'General' },
  primaryQuestion: { type: String, required: true, trim: true, maxlength: 220 },
  primaryQuestionKey: { type: String, required: true, index: true },
  alternativeQuestions: { type: [String], default: [] },
  keywords: { type: [String], default: [] },
  answer: { type: String, required: true, trim: true, maxlength: 5000 },
  ctaLabel: { type: String, trim: true, maxlength: 90, default: '' },
  ctaTarget: { type: String, trim: true, maxlength: 180, default: '' },
  priority: { type: Number, default: 100, min: 0, max: 1000, index: true },
  isEnabled: { type: Boolean, default: true, index: true },
}, { timestamps: true });

aiKnowledgeEntrySchema.pre('validate', function setDerivedFields(next) {
  this.recordId = cleanKnowledgeString(this.recordId || `EL-KB-${Date.now()}`, 120);
  this.module = modules.find((item) => normalizeKnowledgeText(item) === normalizeKnowledgeText(this.module || this.category || 'Easy Lane')) || 'Easy Lane';
  this.topic = cleanKnowledgeString(this.topic || this.module || 'Easy Lane', 180);
  this.subtopic = cleanKnowledgeString(this.subtopic, 180);
  this.contentType = cleanKnowledgeString(this.contentType || 'FAQ', 120) || 'FAQ';
  this.questionTrigger = cleanKnowledgeString(this.questionTrigger || this.primaryQuestion, 220);
  this.approvedAnswer = cleanKnowledgeString(this.approvedAnswer || this.answer, 5000);
  this.language = languages.find((item) => normalizeKnowledgeText(item) === normalizeKnowledgeText(this.language || 'ALL')) || 'ALL';
  this.priorityLabel = priorities.find((item) => normalizeKnowledgeText(item) === normalizeKnowledgeText(this.priorityLabel || 'Medium')) || 'Medium';
  this.priorityRank = priorityLabelToRank(this.priorityLabel);
  this.active = this.active !== false && this.isEnabled !== false;
  this.sourceOwner = cleanKnowledgeString(this.sourceOwner, 180);
  this.lastUpdatedLabel = parseKnowledgeDate(this.lastUpdatedLabel || this.updatedAt || this.createdAt || null);
  this.lastImportedAt = parseKnowledgeDate(this.lastImportedAt || null);

  this.category = categories.find((item) => normalizeKnowledgeText(item) === normalizeKnowledgeText(this.category)) || 'General';
  this.primaryQuestion = cleanKnowledgeString(this.primaryQuestion || this.questionTrigger, 220);
  this.primaryQuestionKey = normalizeKnowledgeText(this.primaryQuestion);
  this.alternativeQuestions = splitKnowledgeList(this.alternativeQuestions).map((item) => cleanKnowledgeString(item, 220));
  this.keywords = normalizeKnowledgeKeywords(this.keywords);
  this.answer = cleanKnowledgeString(this.answer || this.approvedAnswer, 5000);
  this.ctaLabel = cleanKnowledgeString(this.ctaLabel, 90);
  this.ctaTarget = cleanKnowledgeString(this.ctaTarget, 180);
  this.priority = this.priorityRank === 3 ? 1000 : this.priorityRank === 2 ? 600 : 250;
  this.isEnabled = this.active !== false;
  this.responseVariants = Array.isArray(this.responseVariants)
    ? this.responseVariants
      .map((variant, index) => ({
        variantId: cleanKnowledgeString(variant?.variantId || `${this.recordId}-VAR-${index + 1}`, 120),
        language: languages.find((item) => normalizeKnowledgeText(item) === normalizeKnowledgeText(variant?.language || this.language || 'ALL')) || 'ALL',
        variantNo: Number.isFinite(Number(variant?.variantNo)) ? Math.max(1, Number(variant.variantNo)) : index + 1,
        approvedResponseVariant: cleanKnowledgeString(variant?.approvedResponseVariant, 5000),
        active: variant?.active !== false,
      }))
      .filter((variant) => variant.approvedResponseVariant)
    : [];
  next();
});

export const AIKnowledgeEntry = mongoose.model('AIKnowledgeEntry', aiKnowledgeEntrySchema);
