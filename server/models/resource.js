// models/Resource.js
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "grade6",
      "grade7",
      "grade8",
      "grade9",
      "grade10",
      "grade11",
      "grade12",
      "freshman",
      "exit",
    ],
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // optional (admin)
  },
}, { timestamps: true });

export default mongoose.model("Resource", resourceSchema);