import express from 'express';
import mongoose from 'mongoose';
import { requireAdmin } from '../auth.js';
import { ContactLead } from '../models/ContactLead.js';
import { createContactLead, deleteContactLeadById, getContactLeadById, listContactLeads } from '../services/contactLeadStore.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[-\d\s().]{7,30}$/;
const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const safeContactLead = (lead) => lead.toObject();
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const hasMongo = () => mongoose.connection.readyState === 1;

function normalizeText(value) {
  return String(value ?? '').replace(/\u0000/g, '').trim();
}

function cleanContactLead(body = {}) {
  const fullName = normalizeText(body.fullName);
  const email = normalizeText(body.email).toLowerCase();
  const phone = normalizeText(body.phone);
  const companyName = normalizeText(body.companyName);
  const subject = normalizeText(body.subject);
  const message = normalizeText(body.message);

  if (fullName.length < 2) return { error: 'Full name is required.' };
  if (!emailPattern.test(email)) return { error: 'Please enter a valid email address.' };
  if (!phonePattern.test(phone)) return { error: 'Please enter a valid phone number.' };
  if (!subject) return { error: 'Subject is required.' };
  if (subject.length > 160) return { error: 'Subject must be 160 characters or fewer.' };
  if (message.length < 10) return { error: 'Message must be at least 10 characters long.' };
  if (message.length > 3000) return { error: 'Message must be 3,000 characters or fewer.' };

  return {
    value: {
      fullName,
      email,
      phone,
      companyName,
      subject,
      message,
      status: 'NEW',
      source: 'CONTACT_US',
    },
  };
}

function buildSearchQuery(search) {
  const term = normalizeText(search);
  if (!term) return {};
  const pattern = new RegExp(escapeRegExp(term), 'i');
  return {
    $or: [
      { fullName: pattern },
      { email: pattern },
      { phone: pattern },
      { companyName: pattern },
      { subject: pattern },
      { message: pattern },
    ],
  };
}

export const contactLeadPublicRouter = express.Router();
export const contactLeadAdminRouter = express.Router();
const isValidLeadId = (id) => (hasMongo() ? mongoose.isValidObjectId(id) : Boolean(String(id || '').trim()));

const handleCreateContactLead = async (req, res, next) => {
  try {
    const cleaned = cleanContactLead(req.body);
    if (cleaned.error) return res.status(400).json({ success: false, message: cleaned.error });
    const lead = hasMongo() ? await ContactLead.create(cleaned.value) : await createContactLead(cleaned.value);
    return res.status(201).json({
      success: true,
      message: 'Your message has been received.',
      lead: hasMongo() ? safeContactLead(lead) : lead,
    });
  } catch (error) {
    return next(error);
  }
};

contactLeadPublicRouter.post(['/contact-leads', '/contact-us', '/contact'], handleCreateContactLead);

contactLeadAdminRouter.get('/contact-leads', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const query = buildSearchQuery(req.query.search);
    if (hasMongo()) {
      const [items, total] = await Promise.all([
        ContactLead.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        ContactLead.countDocuments(query),
      ]);
      return res.json({ items: items.map(safeContactLead), total, page, pages: Math.max(1, Math.ceil(total / limit)) });
    }
    const items = await listContactLeads((item) => {
      if (!Object.keys(query).length) return true;
      const term = String(req.query.search || '').trim();
      if (!term) return true;
      const pattern = new RegExp(escapeRegExp(term), 'i');
      return [item.fullName, item.email, item.phone, item.companyName, item.subject, item.message].some((value) => pattern.test(String(value || '')));
    });
    const total = items.length;
    const paged = items.slice((page - 1) * limit, (page - 1) * limit + limit);
    return res.json({ items: paged, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    return next(error);
  }
});

contactLeadAdminRouter.get('/contact-leads-export', requireAdmin, async (req, res, next) => {
  try {
    const query = buildSearchQuery(req.query.search);
    const leads = hasMongo()
      ? await ContactLead.find(query).sort({ createdAt: -1 })
      : await listContactLeads((item) => {
          const term = String(req.query.search || '').trim();
          if (!term) return true;
          const pattern = new RegExp(escapeRegExp(term), 'i');
          return [item.fullName, item.email, item.phone, item.companyName, item.subject, item.message].some((value) => pattern.test(String(value || '')));
        });
    const rows = [
      ['Full name', 'Email', 'Phone', 'Company name', 'Subject', 'Message', 'Status', 'Source', 'Created at', 'Updated at'],
      ...leads.map((lead) => [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.companyName,
        lead.subject,
        lead.message,
        lead.status,
        lead.source,
        new Date(lead.createdAt).toISOString(),
        new Date(lead.updatedAt || lead.createdAt).toISOString(),
      ]),
    ];
    return res.type('text/csv').attachment('easy-lane-contact-leads.csv').send(rows.map((row) => row.map(csv).join(',')).join('\n'));
  } catch (error) {
    return next(error);
  }
});

contactLeadAdminRouter.get('/contact-leads/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id || '').trim();
    if (!isValidLeadId(id)) return res.status(400).json({ message: 'Invalid contact lead ID.' });
    const lead = hasMongo() ? await ContactLead.findById(id) : await getContactLeadById(id);
    if (!lead) return res.status(404).json({ message: 'Contact lead not found.' });
    return res.json(hasMongo() ? safeContactLead(lead) : lead);
  } catch (error) {
    return next(error);
  }
});

contactLeadAdminRouter.delete('/contact-leads/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id || '').trim();
    if (!isValidLeadId(id)) return res.status(400).json({ success: false, message: 'Invalid contact lead ID.' });
    const lead = hasMongo() ? await ContactLead.findByIdAndDelete(id) : await deleteContactLeadById(id);
    if (!lead) return res.status(404).json({ success: false, message: 'Contact lead not found.' });
    return res.json({ success: true, deletedId: String(lead._id), message: 'Contact lead deleted successfully.' });
  } catch (error) {
    return next(error);
  }
});
