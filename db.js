// db.js - SUPER SIMPLE
import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    // Try to reconnect
    setTimeout(connectDB, 5000);
    throw error;
  }
};

export default connectDB;