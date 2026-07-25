const CATEGORY_OPTIONS = [
  'General',
  'TMS',
  'Fleet',
  'AMS',
  'Finance',
  'Tracking',
  'Integrations',
  'Industries',
  'Security',
  'Pricing',
  'Demo',
  'Support',
];

const HEADER_ALIASES = {
  category: 'category',
  primaryquestion: 'primaryQuestion',
  alternativequestions: 'alternativeQuestions',
  keywords: 'keywords',
  answer: 'answer',
  ctalabel: 'ctaLabel',
  ctatarget: 'ctaTarget',
  priority: 'priority',
  isenabled: 'isEnabled',
};

const limits = {
  category: 40,
  primaryQuestion: 220,
  alternativeQuestion: 220,
  keyword: 120,
  answer: 5000,
  ctaLabel: 90,
  ctaTarget: 180,
};

export function normalizeKnowledgeText(value = '') {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanKnowledgeString(value, maxLength = 5000) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function parseKnowledgeBoolean(value, defaultValue = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const normalized = normalizeKnowledgeText(value);
  if (!normalized) return defaultValue;
  if (['true', '1', 'yes', 'on', 'enabled'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off', 'disabled'].includes(normalized)) return false;
  return defaultValue;
}

export function parseKnowledgeNumber(value, fallback = 100) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function splitKnowledgeList(value) {
  const items = Array.isArray(value)
    ? value.flatMap((item) => String(item ?? '').split(/\r?\n|\|/g))
    : String(value ?? '').split(/\r?\n|\|/g);
  const seen = new Set();
  const result = [];
  for (const rawItem of items) {
    const item = cleanKnowledgeString(rawItem, 200);
    if (!item) continue;
    const key = normalizeKnowledgeText(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

export function slugifyKnowledgeQuestion(value = '') {
  return normalizeKnowledgeText(value);
}

export function getKnowledgeCategoryOptions() {
  return [...CATEGORY_OPTIONS];
}

export function validateKnowledgeEntry(input = {}) {
  const errors = [];
  const categoryInput = cleanKnowledgeString(input.category || 'General', limits.category) || 'General';
  const category = CATEGORY_OPTIONS.find((option) => normalizeKnowledgeText(option) === normalizeKnowledgeText(categoryInput)) || categoryInput;
  if (!CATEGORY_OPTIONS.includes(category)) errors.push('Select a valid category.');

  const primaryQuestion = cleanKnowledgeString(input.primaryQuestion, limits.primaryQuestion);
  if (!primaryQuestion) errors.push('Primary question is required.');

  const answer = cleanKnowledgeString(input.answer, limits.answer);
  if (!answer) errors.push('Approved answer is required.');

  const alternativeQuestions = splitKnowledgeList(input.alternativeQuestions).map((item) => cleanKnowledgeString(item, limits.alternativeQuestion)).filter(Boolean);
  const keywords = splitKnowledgeList(input.keywords).map((item) => cleanKnowledgeString(item, limits.keyword)).filter(Boolean);

  const ctaLabel = cleanKnowledgeString(input.ctaLabel, limits.ctaLabel);
  const ctaTarget = cleanKnowledgeString(input.ctaTarget, limits.ctaTarget);
  if ((ctaLabel && !ctaTarget) || (!ctaLabel && ctaTarget)) errors.push('CTA label and CTA target must be provided together.');

  const priority = Math.min(1000, Math.max(0, Math.trunc(parseKnowledgeNumber(input.priority, 100))));
  if (Number.isNaN(priority)) errors.push('Priority must be a number.');

  const isEnabled = parseKnowledgeBoolean(input.isEnabled, true);
  const primaryQuestionKey = slugifyKnowledgeQuestion(primaryQuestion);
  if (!primaryQuestionKey) errors.push('Primary question is required.');

  return {
    errors,
    value: {
      category,
      primaryQuestion,
      primaryQuestionKey,
      alternativeQuestions,
      keywords,
      answer,
      ctaLabel,
      ctaTarget,
      priority,
      isEnabled,
    },
  };
}

export function sanitizeKnowledgeRecord(entry = {}) {
  const normalized = validateKnowledgeEntry(entry).value;
  return {
    category: normalized.category,
    primaryQuestion: normalized.primaryQuestion,
    primaryQuestionKey: normalized.primaryQuestionKey,
    alternativeQuestions: normalized.alternativeQuestions,
    keywords: normalized.keywords,
    answer: normalized.answer,
    ctaLabel: normalized.ctaLabel,
    ctaTarget: normalized.ctaTarget,
    priority: normalized.priority,
    isEnabled: normalized.isEnabled,
  };
}

export function projectKnowledgeEntry(entry) {
  const item = entry?.toObject ? entry.toObject() : entry || {};
  return {
    id: String(item._id || item.id || ''),
    category: item.category || 'General',
    primaryQuestion: item.primaryQuestion || '',
    alternativeQuestions: Array.isArray(item.alternativeQuestions) ? item.alternativeQuestions : [],
    keywords: Array.isArray(item.keywords) ? item.keywords : [],
    answer: item.answer || '',
    ctaLabel: item.ctaLabel || '',
    ctaTarget: item.ctaTarget || '',
    priority: Number.isFinite(Number(item.priority)) ? Number(item.priority) : 100,
    isEnabled: item.isEnabled !== false,
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
  };
}

export function publicKnowledgeEntry(entry) {
  const projected = projectKnowledgeEntry(entry);
  return {
    id: projected.id,
    category: projected.category,
    primaryQuestion: projected.primaryQuestion,
    alternativeQuestions: projected.alternativeQuestions,
    keywords: projected.keywords,
    answer: projected.answer,
    ctaLabel: projected.ctaLabel,
    ctaTarget: projected.ctaTarget,
    priority: projected.priority,
    isEnabled: true,
  };
}

export function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export function serializeKnowledgeCsv(entries = []) {
  const headers = ['category', 'primaryQuestion', 'alternativeQuestions', 'keywords', 'answer', 'ctaLabel', 'ctaTarget', 'priority', 'isEnabled'];
  const rows = [headers.join(',')];
  for (const entry of entries) {
    const item = projectKnowledgeEntry(entry);
    rows.push([
      csvEscape(item.category),
      csvEscape(item.primaryQuestion),
      csvEscape((item.alternativeQuestions || []).join('|')),
      csvEscape((item.keywords || []).join('|')),
      csvEscape(item.answer),
      csvEscape(item.ctaLabel),
      csvEscape(item.ctaTarget),
      csvEscape(item.priority),
      csvEscape(item.isEnabled ? 'true' : 'false'),
    ].join(','));
  }
  return rows.join('\n');
}

function parseCsvCells(text = '') {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === ',') {
      row.push(cell);
      cell = '';
      continue;
    }
    if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }
    if (char === '\r') continue;
    cell += char;
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((entry) => entry.some((cellValue) => String(cellValue ?? '').trim() !== ''));
}

export function parseKnowledgeCsv(text = '') {
  const rows = parseCsvCells(String(text ?? '').trim());
  if (!rows.length) return [];
  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((cell) => HEADER_ALIASES[normalizeKnowledgeText(cell)] || cleanKnowledgeString(cell, 80));
  return dataRows.map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      if (header) record[header] = row[index] ?? '';
    });
    return record;
  });
}

export function parseKnowledgeImportPayload(payload = {}) {
  const format = normalizeKnowledgeText(payload.format) || 'csv';
  if (format === 'json') {
    if (Array.isArray(payload.entries)) return payload.entries;
    if (typeof payload.content === 'string' && payload.content.trim()) {
      const parsed = JSON.parse(payload.content);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed?.entries)) return parsed.entries;
    }
    return [];
  }
  return parseKnowledgeCsv(payload.content || '');
}
