import mongoose from "mongoose";





const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

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
