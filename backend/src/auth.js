import crypto from 'node:crypto';
import { config, missingAdminEnvironment } from './config.js';

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const decode = (value) => JSON.parse(Buffer.from(value, 'base64url').toString());
const signature = (value, secret) => crypto.createHmac('sha256', secret).update(value).digest('base64url');
const expirationMs = (value) => { const match = /^(\d+)([smhd])$/.exec(value); if (!match) return 8 * 60 * 60 * 1000; return Number(match[1]) * ({ s: 1000, m: 60000, h: 3600000, d: 86400000 }[match[2]]); };

export function createAdminToken() {
  const settings = config();
  const payload = encode({ role: 'admin', id: settings.adminId, exp: Date.now() + expirationMs(settings.jwtExpiresIn) });
  return `${payload}.${signature(payload, settings.jwtSecret)}`;
}

export function cookieOptions() {
  const settings = config();
  return { httpOnly: true, sameSite: 'lax', secure: settings.nodeEnv === 'production', maxAge: expirationMs(settings.jwtExpiresIn), path: '/' };
}

function getCookie(req, name) {
  return (req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

function getBearerToken(req) {
  const header = String(req.headers.authorization || '').trim();
  if (!header) return '';
  const [scheme, token] = header.split(/\s+/);
  if (scheme?.toLowerCase() !== 'bearer' || !token) return '';
  return token;
}

export function requireAdmin(req, res, next) {
  const missing = missingAdminEnvironment();
  if (missing.length) return res.status(503).json({ message: `Admin authentication is not configured. Missing: ${missing.join(', ')}` });
  const settings = config();
  const token = getBearerToken(req) || getCookie(req, settings.cookieName);
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  const [payload, providedSignature] = token.split('.');
  const expected = Buffer.from(signature(payload || '', settings.jwtSecret)); const provided = Buffer.from(providedSignature || '');
  if (!payload || !providedSignature || expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) return res.status(401).json({ message: 'Invalid session.' });
  try { const session = decode(payload); if (session.role !== 'admin' || session.id !== settings.adminId || session.exp < Date.now()) throw new Error('Expired'); req.admin = { id: session.id, role: session.role }; return next(); } catch { return res.status(401).json({ message: 'Session expired.' }); }
}

export function readAdminToken(req) {
  const settings = config();
  return getBearerToken(req) || getCookie(req, settings.cookieName) || '';
}
