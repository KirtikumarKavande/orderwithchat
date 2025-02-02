import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add your Mongodb URI to .env.local');
}

let cached: CachedConnection = {
  conn: null,
  promise: null
};

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
} else {
  cached = (global as any).mongoose;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI || "");
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;