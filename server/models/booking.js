const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" },

  date: Date,

  status: {
    type: String,
    enum: ["pending", "approved", "completed", "cancelled"],
    default: "pending"
  },

  meetingLink: String
});
