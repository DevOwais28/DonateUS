import mongoose from "mongoose";

let isConnected = false; // global cache

export const connectDB = async (uri) => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(uri, {
      dbName: "DonationManagementSystem",
      bufferCommands: false,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected:", db.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // ❗ REQUIRED for Vercel
  }
};
