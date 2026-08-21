import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vighnaharta_db';
    mongoose.set('bufferCommands', false);
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${mongoose.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database Warning] MongoDB connection failed: ${error.message}. Running in in-memory / fallback mode.`);
    return false;
  }
};
