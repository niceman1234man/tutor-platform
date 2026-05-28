import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentName:  { type: String, default: "" },
  studentEmail: { type: String, default: "" },
  courseId:     { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  amount:       Number,
  receiptImage: String,
  method:       String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
