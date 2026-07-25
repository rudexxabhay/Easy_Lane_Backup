import mongoose from 'mongoose';

const assistantUnmatchedQuestionSchema = new mongoose.Schema({
  originalQuestion: { type: String, required: true, trim: true, maxlength: 5000 },
  normalizedQuestion: { type: String, required: true, trim: true, maxlength: 5000, index: true },
  conversationId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  askedAt: { type: Date, default: Date.now, index: true },
  pageUrl: { type: String, trim: true, maxlength: 2048, default: '' },
  suggestedCategory: { type: String, trim: true, maxlength: 80, default: '' },
  matchCandidates: { type: [mongoose.Schema.Types.Mixed], default: [] },
  highestRejectedScore: { type: Number, default: 0 },
  timesAsked: { type: Number, default: 1 },
  reviewStatus: { type: String, enum: ['new', 'reviewed', 'ignored', 'linked'], default: 'new', index: true },
  linkedKnowledgeEntryId: { type: String, trim: true, maxlength: 120, default: '' },
  adminNotes: { type: String, trim: true, maxlength: 2000, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

assistantUnmatchedQuestionSchema.index({ normalizedQuestion: 1, reviewStatus: 1 });
assistantUnmatchedQuestionSchema.index({ conversationId: 1, askedAt: -1 });

export const AssistantUnmatchedQuestion = mongoose.model('AssistantUnmatchedQuestion', assistantUnmatchedQuestionSchema);
