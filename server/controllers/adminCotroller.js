import User from "../models/user.js";
import Tutor from "../models/tutor.js";
import Payment from "../models/payment.js";
import Exam from "../models/exam.js";

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


export const createExam = async (req, res) => {
  try {
    let { title, category, duration, questions } = req.body;

    // Normalize incoming questions to match the schema:
    // question: String
    // options: [{ text: String }]
    // correctAnswer: Number
    // explanation: String
    if (!Array.isArray(questions)) questions = [];

    const normalizedQuestions = questions.map((q) => {
      const opts = Array.isArray(q.options)
        ? q.options.map((opt) => {
            // If option is already an object with text, keep it
            if (opt && typeof opt === "object" && typeof opt.text === "string") return { text: opt.text };
            // If option is a primitive (string/number), coerce to string
            return { text: String(opt) };
          })
        : [];

      return {
        question: q.question || "",
        options: opts,
        correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : Number(q.correctAnswer),
        explanation: q.explanation || "",
      };
    });

    const exam = await Exam.create({
      title,
      category,
      duration,
      questions: normalizedQuestions,
    });

    res.status(201).json(exam);
  } catch (err) {
    console.error("CREATE EXAM ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};


// EXAMS
export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({}, "title category duration createdAt").sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    console.error("GET EXAMS ERROR 👉", err);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
};

export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) {
    console.error("GET EXAM ERROR 👉", err);
    res.status(500).json({ message: "Failed to fetch exam" });
  }
};
