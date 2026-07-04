import mongoose from "mongoose";

let connectPromise = null;

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  if (connectPromise) return connectPromise;
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI not set, skipping DB connection");
    return;
  }
  connectPromise = mongoose.connect(process.env.MONGODB_URI);
  try {
    const conn = await connectPromise;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    connectPromise = null;
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

export const isDBConnected = () =>
  mongoose.connection.readyState === 1;

export const waitForDB = async () => {
  if (isDBConnected()) return;
  if (!connectPromise) return;
  await connectPromise;
};

export default connectDB;
