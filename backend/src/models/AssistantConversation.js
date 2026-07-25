import mongoose from 'mongoose';

const adminNoteSchema = new mongoose.Schema({
  body: { type: String, trim: true, maxlength: 2000, required: true },
  adminId: { type: String, trim: true, maxlength: 120, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const assistantConversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  status: { type: String, enum: ['new', 'active', 'inactive', 'closed', 'converted', 'abandoned', 'error'], default: 'new', index: true },
  startPageUrl: { type: String, trim: true, maxlength: 2048, default: '' },
  pageTitle: { type: String, trim: true, maxlength: 500, default: '' },
  referrerUrl: { type: String, trim: true, maxlength: 2048, default: '' },
  deviceType: { type: String, trim: true, maxlength: 80, default: '' },
  browser: { type: String, trim: true, maxlength: 120, default: '' },
  operatingSystem: { type: String, trim: true, maxlength: 120, default: '' },
  screenSize: { type: String, trim: true, maxlength: 40, default: '' },
  language: { type: String, trim: true, maxlength: 40, default: '' },
  timezone: { type: String, trim: true, maxlength: 120, default: '' },
  ipAddress: { type: String, trim: true, maxlength: 120, default: '' },
  approximateLocation: { type: String, trim: true, maxlength: 160, default: '' },
  startedAt: { type: Date, default: null, index: true },
  endedAt: { type: Date, default: null, index: true },
  lastActivityAt: { type: Date, default: null, index: true },
  durationSeconds: { type: Number, default: 0 },
  totalMessageCount: { type: Number, default: 0 },
  totalUserMessages: { type: Number, default: 0 },
  totalAssistantMessages: { type: Number, default: 0 },
  matchedQuestions: { type: Number, default: 0 },
  unmatchedQuestions: { type: Number, default: 0 },
  ctaClicks: { type: Number, default: 0 },
  demoRequested: { type: Boolean, default: false, index: true },
  contactDetailsSubmitted: { type: Boolean, default: false, index: true },
  convertedToLead: { type: Boolean, default: false, index: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  detectedCategory: { type: String, trim: true, maxlength: 80, default: '', index: true },
  detectedIntent: { type: String, trim: true, maxlength: 120, default: '', index: true },
  matchedModule: { type: String, trim: true, maxlength: 120, default: '', index: true },
  rating: { type: Number, min: 1, max: 5, default: null },
  adminNotes: { type: [adminNoteSchema], default: [] },
  widgetOpens: { type: Number, default: 0 },
  widgetCloses: { type: Number, default: 0 },
  widgetReopens: { type: Number, default: 0 },
  pageChanges: { type: Number, default: 0 },
  browserRefreshes: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

assistantConversationSchema.index({ visitorId: 1, updatedAt: -1 });
assistantConversationSchema.index({ status: 1, updatedAt: -1 });
assistantConversationSchema.index({ startedAt: -1 });

export const AssistantConversation = mongoose.model('AssistantConversation', assistantConversationSchema);

