import mongoose from "mongoose";

let connectPromise = null;
let lastError = null;

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  if (connectPromise) {
    try {
      await connectPromise;
    } catch {
      connectPromise = null;
    }
    if (isDBConnected()) return;
  }
  if (!process.env.MONGODB_URI) {
    lastError = "MONGODB_URI not set";
    console.warn("MONGODB_URI not set, skipping DB connection");
    return;
  }
  connectPromise = mongoose.connect(process.env.MONGODB_URI);
  try {
    const conn = await connectPromise;
    lastError = null;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    lastError = error.message;
    connectPromise = null;
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

export const isDBConnected = () =>
  mongoose.connection.readyState === 1;

export const getLastDBError = () => lastError;

export const waitForDB = async () => {
  if (isDBConnected()) return;
  if (!connectPromise) {
    await connectDB();
    return;
  }
  try {
    await connectPromise;
  } catch {
    await connectDB();
  }
};

export default connectDB;
