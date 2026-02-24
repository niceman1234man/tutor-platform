
import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bio: String,
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  grades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Grade" }],
  pricePerHour: Number,
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  approved: { type: Boolean, default: false }
});

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
