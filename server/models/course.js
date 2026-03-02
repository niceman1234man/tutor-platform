import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema( {
    title: String,
    description: String,
    order: Number,
    contents: [
      {
        type: {
          type: String,
          enum: ["video", "file"],
          required: true,
        },
        url: String,
        publicId: String,
        name: String,
      }
    ]
  });

const courseSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, default: 0 },
  imageUrl: { type: String },
  chapters: [chapterSchema], // 🔥 Embed chapters
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Course", courseSchema);