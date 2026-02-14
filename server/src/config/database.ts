import mongoose from 'mongoose';
import { log } from './logger';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    log.info('MongoDB connected successfully');
  } catch (error) {
    log.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    log.info('MongoDB disconnected');
  } catch (error) {
    log.error('Error disconnecting from MongoDB:', error);
  }
};
