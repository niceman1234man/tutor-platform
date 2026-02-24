import User from "../models/user.js";
import Tutor from "../models/tutor.js";
import Payment from "../models/payment.js";

// USERS
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
};

// TUTORS
export const getAllTutors = async (req, res) => {
  const tutors = await Tutor.find().populate("userId");
  res.json(tutors);
};

export const approveTutor = async (req, res) => {
  const tutor = await Tutor.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );
  res.json(tutor);
};

// PAYMENTS
export const approvePayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json(payment);
};
