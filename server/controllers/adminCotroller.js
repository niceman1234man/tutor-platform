import User from "../models/user.js";
import Tutor from "../models/tutor.js";
import Payment from "../models/payment.js";

// USERS
export const assignStudentToTutor = async (req, res) => {
  const { tutorId, studentId } = req.body;

  try {
    const tutor = await Tutor.findById(tutorId);
    const student = await User.findById(studentId);

    if (!tutor || !student) {
      return res.status(404).json({ msg: "Tutor or Student not found" });
    }

    tutor.assignedStudents.push(studentId);
    await tutor.save();

    res.json({ msg: "Student assigned to tutor successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error assigning student to tutor" });
  }
};

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
