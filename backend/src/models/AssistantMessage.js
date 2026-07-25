import mongoose from 'mongoose';

const assistantMessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true, index: true },
  conversationId: { type: String, required: true, index: true },
  sender: { type: String, enum: ['user', 'assistant', 'system'], required: true, index: true },
  messageText: { type: String, trim: true, maxlength: 5000, required: true },
  normalisedText: { type: String, trim: true, maxlength: 5000, default: '' },
  messageType: { type: String, enum: ['text', 'quick-question', 'assistant-answer', 'fallback', 'system-message', 'CTA', 'form', 'form-submission', 'error'], default: 'text', index: true },
  sentAt: { type: Date, default: Date.now, index: true },
  deliveredAt: { type: Date, default: null },
  responseDelay: { type: Number, default: 0 },
  knowledgeEntryId: { type: String, trim: true, maxlength: 120, default: '' },
  knowledgeSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
  matchedPrimaryQuestion: { type: String, trim: true, maxlength: 220, default: '' },
  matchedAlternativeQuestion: { type: String, trim: true, maxlength: 220, default: '' },
  matchedKeywords: { type: [String], default: [] },
  matchingScore: { type: Number, default: 0 },
  matchingConfidence: { type: Number, default: 0 },
  category: { type: String, trim: true, maxlength: 80, default: '' },
  ctaLabel: { type: String, trim: true, maxlength: 90, default: '' },
  ctaTarget: { type: String, trim: true, maxlength: 180, default: '' },
  fallbackUsed: { type: Boolean, default: false, index: true },
  errorOccurred: { type: Boolean, default: false, index: true },
  errorDetails: { type: String, trim: true, maxlength: 2000, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

assistantMessageSchema.index({ conversationId: 1, sentAt: 1 });
assistantMessageSchema.index({ conversationId: 1, sender: 1, sentAt: 1 });

export const AssistantMessage = mongoose.model('AssistantMessage', assistantMessageSchema);
