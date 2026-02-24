import Payment from "../models/payment.js";

// CREATE
export const createPayment = async (req, res) => {
  const payment = await Payment.create({
    ...req.body,
    receiptImage: req.file?.path
  });
  res.json(payment);
};

// READ ALL
export const getPayments = async (req, res) => {
  const payments = await Payment.find().populate("bookingId");
  res.json(payments);
};

// READ ONE
export const getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
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
