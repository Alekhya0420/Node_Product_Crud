import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.info("✅ MongoDB connected");
    console.info("DB NAME:", mongoose.connection.name);
    console.info("DB HOST:", mongoose.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
