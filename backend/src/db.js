import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

export const isDatabaseReady = () => mongoose.connection.readyState === 1;

export async function connectDatabase(mongoUri) {
  if (!mongoUri) {
    const error = new Error('MONGODB_URI or MONGO_URI is not configured.');
    error.code = 'MISSING_MONGODB_URI';
    throw error;
  }
  // mongoose.connect creates one shared connection and its reusable connection pool.
  return mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 10,
    minPoolSize: 0,
  });
}
