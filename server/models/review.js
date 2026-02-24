import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  rating: Number,
  comment: String
});
