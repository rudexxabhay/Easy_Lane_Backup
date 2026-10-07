import mongoose from 'mongoose';
import { app } from './app.js';
import { config, missingAdminEnvironment } from './config.js';
import { connectDatabase } from './db.js';

const settings = config();
if (settings.nodeEnv === 'production') {
  if (!settings.clientUrl) throw new Error('CLIENT_URL is required in production and must be a valid frontend origin.');
  let clientOrigin;
  try {
    clientOrigin = new URL(settings.clientUrl);
  } catch {
    throw new Error('CLIENT_URL must be an absolute http:// or https:// origin.');
  }
  if (!['http:', 'https:'].includes(clientOrigin.protocol) || clientOrigin.origin !== settings.clientUrl) {
    throw new Error('CLIENT_URL must be an absolute http:// or https:// origin.');
  }
}

const missingAdmin = missingAdminEnvironment();
if (missingAdmin.length) console.error('[Admin Configuration]', { enabled: false, missing: missingAdmin });

let server;
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[Shutdown] ${signal} received; closing HTTP and MongoDB connections.`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect().catch(() => {});
}

process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
process.on('SIGINT', () => { void shutdown('SIGINT'); });

mongoose.connection.on('error', (error) => {
  console.error('[MongoDB Connection Error]', { name: error?.name || 'Error', code: error?.code || 'DATABASE_ERROR' });
});
mongoose.connection.on('disconnected', () => console.warn('[MongoDB Status] disconnected'));
mongoose.connection.on('connected', () => console.log('[MongoDB Status] connected'));

server = app.listen(settings.port, () => {
  console.log('[Backend Listening]', { port: settings.port });
});

console.log('[MongoDB Connection Attempt]', { configured: Boolean(settings.mongoUri) });
connectDatabase(settings.mongoUri)
  .then(() => console.log('[MongoDB Ready]'))
  .catch((error) => {
    console.error('[MongoDB Startup Failure]', {
      name: error?.name || 'Error',
      code: error?.code || 'DATABASE_CONNECTION_FAILED',
      readiness: 'not_ready',
    });
  });
