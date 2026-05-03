import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },

  options: [
    {
      text: String,
    },
  ],

  correctAnswer: { type: Number, required: true }, // index (0,1,2,3)

  explanation: { type: String }, // 🔥 important (now optional)
});

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: String,
    duration: Number, // minutes

    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);