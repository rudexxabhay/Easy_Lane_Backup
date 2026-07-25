import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

export function config() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5000),
    mongoUri: String(process.env.MONGODB_URI || process.env.MONGO_URI || '').trim(),
    clientUrl: process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    adminId: process.env.ADMIN_ID?.trim() || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
    cookieName: process.env.COOKIE_NAME || 'easylane_admin_session',
  };
}

export function missingAdminEnvironment() {
  const settings = config();
  return ['ADMIN_ID', 'ADMIN_PASSWORD', 'JWT_SECRET'].filter((key) => !settings[{ ADMIN_ID: 'adminId', ADMIN_PASSWORD: 'adminPassword', JWT_SECRET: 'jwtSecret' }[key]]);
}
