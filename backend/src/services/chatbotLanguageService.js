const ROMAN_HINDI_MARKERS = new Set([
  'kya', 'kaise', 'kaunsa', 'kaun', 'kyu', 'kyun', 'mujhe', 'mujhko', 'mera', 'meri', 'mere',
  'aap', 'aapka', 'aapki', 'hai', 'hain', 'ho', 'hoga', 'hogi', 'hote', 'karna', 'krna', 'karega',
  'karenge', 'karoge', 'kar', 'kr', 'milta', 'milega', 'dikhega', 'dikhegi', 'kaha', 'kahan',
  'isme', 'usme', 'iske', 'uske', 'liye', 'chahiye', 'chahie', 'jaanna', 'jana', 'batao', 'samjhao',
  'sikhao', 'aur', 'nahi', 'nahin', 'me', 'se', 'ko',
]);

const ENGLISH_MARKERS = new Set([
  'what', 'how', 'can', 'does', 'do', 'is', 'are', 'the', 'for', 'with', 'about', 'show', 'tell',
  'support', 'demo', 'fleet', 'vendor', 'driver', 'customer', 'invoice', 'payment', 'book', 'privacy',
  'policy', 'terms', 'tracking', 'module', 'portal',
]);

function tokenize(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function detectChatbotLanguage(message = '') {
  const text = String(message || '').trim();
  const tokens = tokenize(text);
  const devanagariChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  const latinChars = (text.match(/[A-Za-z]/g) || []).length;
  const romanHindiHits = tokens.filter((token) => ROMAN_HINDI_MARKERS.has(token)).length;
  const englishHits = tokens.filter((token) => ENGLISH_MARKERS.has(token)).length;

  if (devanagariChars >= 3 && devanagariChars >= Math.max(3, Math.floor(latinChars / 3))) return 'hi';
  if (romanHindiHits >= 2) return 'hinglish';
  if (romanHindiHits >= 1 && englishHits >= 1) return 'hinglish';
  if (latinChars && devanagariChars) return devanagariChars > latinChars ? 'hi' : 'hinglish';
  return 'en';
}
