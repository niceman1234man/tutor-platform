
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  amount: Number,
  receiptImage: String,
  method: String, // Telebirr, Bank
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
