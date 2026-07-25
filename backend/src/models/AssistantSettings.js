import mongoose from 'mongoose';

const assistantSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'assistant' },
  inactivityTimeoutMinutes: { type: Number, default: 30, min: 1, max: 1440 },
  sessionResumeWindowMinutes: { type: Number, default: 180, min: 5, max: 10080 },
  dataRetentionDays: { type: Number, default: 90, min: 1, max: 3650 },
  collectTechnicalMetadata: { type: Boolean, default: false },
  logIpAddress: { type: Boolean, default: false },
  allowExports: { type: Boolean, default: true },
}, { timestamps: true });

export const defaultAssistantSettings = {
  key: 'assistant',
  inactivityTimeoutMinutes: 30,
  sessionResumeWindowMinutes: 180,
  dataRetentionDays: 90,
  collectTechnicalMetadata: false,
  logIpAddress: false,
  allowExports: true,
};

export const AssistantSettings = mongoose.model('AssistantSettings', assistantSettingsSchema);

