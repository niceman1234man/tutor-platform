import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId:  { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completedChapters: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
