import 'dotenv/config';
import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  try {
    const connStr =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb+srv://sahilkumarsahoo001_db_user:9AeL9vd0Jk1nJxQV@vpcommittee.oyhse83.mongodb.net/vighnaharta_db?retryWrites=true&w=majority';

    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] MongoDB Connected: ${mongoose.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database Warning] MongoDB connection failed: ${error.message}. Running in fallback mode.`);
    return false;
  }
};
