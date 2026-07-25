import mongoose from 'mongoose';
import {
  cleanKnowledgeString,
  getKnowledgeCategoryOptions,
  normalizeKnowledgeText,
  splitKnowledgeList,
} from '../services/aiKnowledge.js';

const categories = getKnowledgeCategoryOptions();

const aiKnowledgeEntrySchema = new mongoose.Schema({
  category: { type: String, required: true, enum: categories, default: 'General' },
  primaryQuestion: { type: String, required: true, trim: true, maxlength: 220 },
  primaryQuestionKey: { type: String, required: true, unique: true, index: true },
  alternativeQuestions: { type: [String], default: [] },
  keywords: { type: [String], default: [] },
  answer: { type: String, required: true, trim: true, maxlength: 5000 },
  ctaLabel: { type: String, trim: true, maxlength: 90, default: '' },
  ctaTarget: { type: String, trim: true, maxlength: 180, default: '' },
  priority: { type: Number, default: 100, min: 0, max: 1000, index: true },
  isEnabled: { type: Boolean, default: true, index: true },
}, { timestamps: true });

aiKnowledgeEntrySchema.pre('validate', function setDerivedFields(next) {
  this.category = categories.find((item) => normalizeKnowledgeText(item) === normalizeKnowledgeText(this.category)) || 'General';
  this.primaryQuestion = cleanKnowledgeString(this.primaryQuestion, 220);
  this.primaryQuestionKey = normalizeKnowledgeText(this.primaryQuestion);
  this.alternativeQuestions = splitKnowledgeList(this.alternativeQuestions).map((item) => cleanKnowledgeString(item, 220));
  this.keywords = splitKnowledgeList(this.keywords).map((item) => cleanKnowledgeString(item, 120));
  this.answer = cleanKnowledgeString(this.answer, 5000);
  this.ctaLabel = cleanKnowledgeString(this.ctaLabel, 90);
  this.ctaTarget = cleanKnowledgeString(this.ctaTarget, 180);
  next();
});

export const AIKnowledgeEntry = mongoose.model('AIKnowledgeEntry', aiKnowledgeEntrySchema);
