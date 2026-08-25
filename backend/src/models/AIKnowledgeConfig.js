import mongoose from 'mongoose';

const aiKnowledgeConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'chatbot-knowledge' },
  demoBookingConfig: { type: [mongoose.Schema.Types.Mixed], default: [] },
  outOfScopeRules: { type: [mongoose.Schema.Types.Mixed], default: [] },
  lastPublishedAt: { type: Date, default: null },
  lastPublishedImportId: { type: String, default: '' },
}, { timestamps: true });

export const AIKnowledgeConfig = mongoose.model('AIKnowledgeConfig', aiKnowledgeConfigSchema);
