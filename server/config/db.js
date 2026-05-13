import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️  MONGO_URI is not set — skipping database connection.");
    return;
  }
  try {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log("Database connected successfully"))
      .catch((err) => console.error("MongoDB connection error:", err.message));
  } catch (err) {
    console.error("MongoDB connect threw:", err.message);
  }
};

export default connectDb;
