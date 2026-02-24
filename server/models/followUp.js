const followUpSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },

  notes: String,
  assignment: String,
  submission: String,
  feedback: String,

  nextSessionDate: Date,

  status: {
    type: String,
    enum: ["pending", "submitted", "reviewed"],
    default: "pending"
  }
});
