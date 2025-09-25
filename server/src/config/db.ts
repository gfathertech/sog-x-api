import mongoose from "mongoose";
import { logger } from "./logger";

export const db = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017neww2";

  if (!MONGODB_URI) {
    logger.error("❌ MongoDB connection URI is not defined");
    throw new Error("MongoDB connection URI is not defined");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("✅ Connected to MongoDB");
  } catch (error) {
    logger.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
  process.exit(0);
});