import Payment from "../models/payment.js";
import Notification from "../models/notification.js";

// CREATE — saves studentId + name/email from the authenticated user or request body
export const createPayment = async (req, res) => {
  try {
    const receiptImage = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const payment = await Payment.create({
      ...req.body,
      studentId:    req.user?._id    || req.body.studentId,
      studentName:  req.user?.name   || req.body.studentName  || "",
      studentEmail: req.user?.email  || req.body.studentEmail || "",
      ...(receiptImage && { receiptImage }),
    });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to create payment", error: err.message });
  }
};

// READ ALL (admin)
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("courseId", "title")
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments", error: err.message });
  }
};

// READ ONE
export const getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("studentId", "name email");
  res.json(payment);
};

// UPDATE — fires notification if status changed to approved/rejected
export const updatePayment = async (req, res) => {
  try {
    const previous = await Payment.findById(req.params.id);
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("studentId", "name email");

    const newStatus = req.body.status;
    const recipientId = payment?.studentId?._id;
    if (previous && newStatus && newStatus !== previous.status && recipientId) {
      let message, type;
      if (newStatus === "approved") {
        message = `Your payment of $${payment.amount} has been approved. ✅`;
        type = "success";
      } else if (newStatus === "rejected") {
        message = `Your payment of $${payment.amount} was rejected. Please contact support.`;
        type = "warning";
      }
      if (message) {
        await Notification.create({ userId: recipientId, message, type });
      }
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment", error: err.message });
  }
};

// DELETE
export const deletePayment = async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);
  res.json({ msg: "Payment deleted" });
};

// APPROVE (ADMIN)
export const approvePayment = async (req, res) => {
  try {
    const previous = await Payment.findById(req.params.id);
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("studentId", "name email");

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (previous?.status !== "approved" && payment.studentId?._id) {
      await Notification.create({
        userId: payment.studentId._id,
        message: `Your payment of $${payment.amount} has been approved. ✅`,
        type: "success",
      });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to approve payment" });
  }
};
