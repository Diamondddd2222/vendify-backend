import mongoose from "mongoose";

 const connectDB = async () => {
  try {
    console.log("🔍 MONGO_URI =", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check .env file.");
    }

   await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
export default connectDB;