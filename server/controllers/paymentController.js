import Payment from "../models/payment.js";

// CREATE
export const createPayment = async (req, res) => {
  try {
    const receiptImage = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const payment = await Payment.create({
      ...req.body,
      studentId: req.user?._id,
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

// UPDATE
export const updatePayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(payment);
};

// DELETE
export const deletePayment = async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);
  res.json({ msg: "Payment deleted" });
};

// APPROVE (ADMIN)
export const approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to approve payment" });
  }
};
