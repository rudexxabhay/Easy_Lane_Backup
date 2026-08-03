import crypto from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');
const dataFile = path.resolve(dataDir, 'contact-leads.json');
const fallbackStatus = 'NEW';
const fallbackSource = 'CONTACT_US';

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') await writeFile(dataFile, '[]', 'utf8');
    else throw error;
  }
}

async function readStore() {
  await ensureStore();
  const raw = await readFile(dataFile, 'utf8');
  const parsed = JSON.parse(raw || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeStore(items) {
  await ensureStore();
  await writeFile(dataFile, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
}

function normaliseLead(lead) {
  return {
    _id: lead._id || crypto.randomUUID(),
    fullName: String(lead.fullName || '').trim(),
    email: String(lead.email || '').trim().toLowerCase(),
    phone: String(lead.phone || '').trim(),
    companyName: String(lead.companyName || '').trim(),
    subject: String(lead.subject || '').trim(),
    message: String(lead.message || '').trim(),
    status: lead.status || fallbackStatus,
    source: lead.source || fallbackSource,
    createdAt: lead.createdAt || new Date().toISOString(),
    updatedAt: lead.updatedAt || lead.createdAt || new Date().toISOString(),
  };
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createContactLead(lead) {
  const items = await readStore();
  const record = normaliseLead({ ...lead, _id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  items.push(record);
  await writeStore(items);
  return record;
}

export async function listContactLeads(query = {}) {
  const items = sortByCreatedAtDesc(await readStore());
  const filtered = typeof query.test === 'function' ? items.filter((item) => query.test(item)) : items;
  return filtered;
}

export async function getContactLeadById(id) {
  const items = await readStore();
  return items.find((item) => String(item._id) === String(id)) || null;
}

export async function deleteContactLeadById(id) {
  const items = await readStore();
  const index = items.findIndex((item) => String(item._id) === String(id));
  if (index < 0) return null;
  const [deleted] = items.splice(index, 1);
  await writeStore(items);
  return deleted;
}

