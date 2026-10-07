import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

export function config() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const configuredClientUrl = process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || (nodeEnv === 'development' ? 'http://localhost:5173' : '');
  let clientUrl = configuredClientUrl;
  if (configuredClientUrl) {
    try {
      const parsedClientUrl = new URL(configuredClientUrl);
      if (['http:', 'https:'].includes(parsedClientUrl.protocol)) clientUrl = parsedClientUrl.origin;
    } catch {
      // server.js reports invalid production origins with a clear startup error.
    }
  }
  return {
    nodeEnv,
    port: Number(process.env.PORT || 5000),
    mongoUri: String(process.env.MONGODB_URI || process.env.MONGO_URI || '').trim(),
    clientUrl,
    adminId: process.env.ADMIN_ID?.trim() || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
    cookieName: process.env.COOKIE_NAME || 'easylane_admin_session',
    xaiApiKey: process.env.XAI_API_KEY || '',
    xaiModel: process.env.XAI_MODEL || 'grok-4.5',
    xaiBaseUrl: process.env.XAI_BASE_URL || 'https://api.x.ai/v1',
    xaiTimeoutMs: Number(process.env.XAI_TIMEOUT_MS || 12000),
    chatbotKbMinScore: Number(process.env.CHATBOT_KB_MIN_SCORE || 220),
    chatbotProviderCooldownMs: Number(process.env.CHATBOT_PROVIDER_COOLDOWN_MS || 90000),
  };
}

export function missingAdminEnvironment() {
  const settings = config();
  return ['ADMIN_ID', 'ADMIN_PASSWORD', 'JWT_SECRET'].filter((key) => !settings[{ ADMIN_ID: 'adminId', ADMIN_PASSWORD: 'adminPassword', JWT_SECRET: 'jwtSecret' }[key]]);
}
