import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: String,
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: "Grade" }
});
