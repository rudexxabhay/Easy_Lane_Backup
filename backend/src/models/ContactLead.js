import mongoose from 'mongoose';

const contactLeadSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { type: String, required: true, trim: true, minlength: 7, maxlength: 30 },
  companyName: { type: String, trim: true, maxlength: 160, default: '' },
  subject: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },
  status: { type: String, enum: ['NEW'], default: 'NEW', index: true },
  source: { type: String, enum: ['CONTACT_US'], default: 'CONTACT_US', index: true },
}, { timestamps: true });

contactLeadSchema.index({ email: 1, createdAt: -1 });

export const ContactLead = mongoose.model('ContactLead', contactLeadSchema);
