import mongoose from "mongoose";





const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String },
  password: String,
  passwordResetToken: { type: String, default: null, select: false },
  passwordResetExpires: { type: Date, default: null, select: false },
  tokenVersion: { type: Number, default: 0 },

  role: {
    type: String,
    enum: ["student", "tutor", "admin"]
  },
  active: { type: Boolean, default: true },

  // For tutors: assigned students
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  phone: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;
