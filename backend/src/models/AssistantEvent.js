import mongoose from 'mongoose';

const assistantEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  conversationId: { type: String, required: true, index: true },
  eventType: { type: String, required: true, index: true },
  eventTimestamp: { type: Date, default: Date.now, index: true },
  pageUrl: { type: String, trim: true, maxlength: 2048, default: '' },
  relatedMessageId: { type: String, trim: true, maxlength: 120, default: '' },
  relatedKnowledgeEntryId: { type: String, trim: true, maxlength: 120, default: '' },
  relatedCTA: {
    label: { type: String, trim: true, maxlength: 90, default: '' },
    target: { type: String, trim: true, maxlength: 180, default: '' },
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

assistantEventSchema.index({ conversationId: 1, eventTimestamp: 1 });

export const AssistantEvent = mongoose.model('AssistantEvent', assistantEventSchema);

