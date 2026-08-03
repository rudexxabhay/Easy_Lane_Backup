import { app } from './app.js';
import { config, missingAdminEnvironment } from './config.js';
import { connectDatabase } from './db.js';

const settings = config();
const missingAdmin = missingAdminEnvironment();
if (missingAdmin.length) console.error(`Admin authentication disabled until these environment variables are configured: ${missingAdmin.join(', ')}`);

const mongoHost = (() => { try { return new URL(settings.mongoUri.replace(/^mongodb\+srv:/, 'https:').replace(/^mongodb:/, 'http:')).hostname; } catch { return 'invalid'; } })();
console.log('[Backend Startup]', { portLoaded: Number.isInteger(settings.port), port: settings.port, mongoUriExists: Boolean(settings.mongoUri), mongoHost });

if (!settings.mongoUri) {
  console.error('[MongoDB Connection Failed]', { code: 'MISSING_MONGODB_URI', message: 'MONGODB_URI or MONGO_URI is not configured.' });
}

console.log('[MongoDB Connection Attempt]', { mongoHost });
let server;
try {
  await connectDatabase(settings.mongoUri);
  console.log('[MongoDB Connected]', { mongoHost });
  server = app.listen(settings.port, () => console.log('[Backend Listening]', { port: settings.port }));
} catch (error) {
  console.error('[MongoDB Connection Failed]', { mongoHost, code: error.code || 'UNKNOWN', message: error.message });
  console.warn('[Backend Fallback]', 'Continuing without MongoDB so file-backed contact leads remain usable.');
  server = app.listen(settings.port, () => console.log('[Backend Listening]', { port: settings.port }));
}

function shutdown(signal) { console.log(`${signal} received. Closing Easy Lane API.`); server.close(() => process.exit(0)); }
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
