import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
