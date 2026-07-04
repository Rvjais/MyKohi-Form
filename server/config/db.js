import mongoose from "mongoose";

let isConnected = false;

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI not set, skipping DB connection");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

export const isDBConnected = () =>
  mongoose.connection.readyState === 1;

export default connectDB;
