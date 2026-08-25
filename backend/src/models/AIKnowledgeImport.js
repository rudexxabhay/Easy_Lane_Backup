import mongoose from 'mongoose';

const aiKnowledgeImportSchema = new mongoose.Schema({
  fileName: { type: String, required: true, trim: true, maxlength: 260 },
  uploadedBy: { type: String, required: true, trim: true, maxlength: 120 },
  uploadedAt: { type: Date, default: Date.now, index: true },
  totalRows: { type: Number, default: 0, min: 0 },
  validRows: { type: Number, default: 0, min: 0 },
  warningCount: { type: Number, default: 0, min: 0 },
  errorCount: { type: Number, default: 0, min: 0 },
  createdCount: { type: Number, default: 0, min: 0 },
  updatedCount: { type: Number, default: 0, min: 0 },
  unchangedCount: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['validated', 'validation_failed', 'published', 'publish_failed', 'draft'],
    default: 'draft',
    index: true,
  },
  summary: { type: mongoose.Schema.Types.Mixed, default: {} },
  previewRows: { type: [mongoose.Schema.Types.Mixed], default: [] },
  payload: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const AIKnowledgeImport = mongoose.model('AIKnowledgeImport', aiKnowledgeImportSchema);
