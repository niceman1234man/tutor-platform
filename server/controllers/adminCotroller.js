// ADD QUESTION TO EXAM

import User from "../models/user.js";
import Tutor from "../models/tutor.js";
import Payment from "../models/payment.js";
import Exam from "../models/exam.js";

// USERS
export const getAssignedStudents = async (req, res) => {
  try {
    console.log("[getAssignedStudents] fetching from Tutor.assignedStudents...");
    
    // Fetch all tutors with their assigned students
    const tutors = await Tutor.find({ assignedStudents: { $exists: true, $ne: [] } })
      .populate({
        path: "assignedStudents",
        select: "name email",
        model: "User"
      })
      .populate("userId", "name email")
      .lean();
    
    console.log(`[getAssignedStudents] found ${tutors.length} tutors with assignedStudents`);
    
    // Flatten the result: for each tutor, create a row for each assigned student
    const result = [];
    for (const tutor of tutors) {
      const tutorName = tutor.userId?.name || "Unknown";
      const tutorEmail = tutor.userId?.email || "";
      
      if (Array.isArray(tutor.assignedStudents)) {
        for (const student of tutor.assignedStudents) {
          result.push({
            _id: student._id,
            name: student.name,
            email: student.email,
            tutorName,
            tutorEmail,
          });
        }
      }
    }
    
    console.log(`[getAssignedStudents] returning ${result.length} assigned student records`);
    res.json(result);
  } catch (err) {
    console.error("GET ASSIGNED STUDENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch assigned students", error: err.message });
  }
};

export const assignStudentToTutor = async (req, res) => {
  const { tutorId, studentId } = req.body;

  try {
    const tutor = await Tutor.findById(tutorId);
    const student = await User.findById(studentId);

    if (!tutor || !student) {
      return res.status(404).json({ msg: "Tutor or Student not found" });
    }

    if (!tutor.assignedStudents.includes(studentId)) {
      tutor.assignedStudents.push(studentId);
      await tutor.save();
    }
    
    // Also update student's tutorId
    await User.findByIdAndUpdate(studentId, { tutorId });

    res.json({ msg: "Student assigned to tutor successfully" });
  } catch (error) {
    console.error("Assign student error:", error.message);
    res.status(500).json({ msg: "Error assigning student to tutor", detail: error.message });
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
  try {
    // Allow debug mode: ?all=true to return all tutor profiles
    const filter = req.query.all === "true" ? {} : { approved: true };
    const tutors = await Tutor.find(filter).populate("userId", "name email");
    console.log(`[getAllTutors] returning ${tutors.length} tutors (filter: ${JSON.stringify(filter)})`);
    // log ids for debugging
    console.log("[getAllTutors] tutor ids:", tutors.map(t => t._id.toString()));
    res.json(tutors);
  } catch (err) {
    console.error("GET ALL TUTORS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch tutors" });
  }
};

export const getApprovedTutorApplications = async (req, res) => {
  try {
    // Fetch tutors whose applications have been approved
    const TutorApplication = await import("../models/application.js").then(m => m.default);
    const approvedApps = await TutorApplication.find({ status: "approved" })
      .populate("userId", "name email _id")
      .lean();
    
    console.log(`[getApprovedTutorApplications] found ${approvedApps.length} approved applications`);
    
    // For each application, find or create the corresponding Tutor profile
    const tutors = await Promise.all(approvedApps.map(async (app) => {
      let tutorProfile = await Tutor.findOne({ userId: app.userId._id });
      if (!tutorProfile) {
        // Create if doesn't exist
        tutorProfile = await Tutor.create({ userId: app.userId._id, approved: true });
      }
      
      return {
        _id: tutorProfile._id, // Tutor profile ID for assignment
        userId: app.userId,
        displayName: app.userId?.name || "Unnamed Tutor",
        status: app.status,
        applicationId: app._id,
      };
    }));
    
    res.json(tutors);
  } catch (err) {
    console.error("GET APPROVED TUTOR APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch approved tutors" });
  }
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
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Add student to the course's students array upon approval
    if (payment.courseId && payment.studentId) {
      const Course = (await import("../models/course.js")).default;
      await Course.findByIdAndUpdate(
        payment.courseId,
        { $addToSet: { students: payment.studentId } }
      );
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to approve payment", error: err.message });
  }
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


export const updateQuestion = async (req, res) => {
  try {
    const { examId, questionId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const question = exam.questions.id(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.question = req.body.question || question.question;
    question.options = req.body.options || question.options;
    question.correctAnswer =
      req.body.correctAnswer ?? question.correctAnswer;
    question.explanation =
      req.body.explanation || question.explanation;

    await exam.save();

    res.json({ message: "Question updated", exam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { examId, questionId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const question = exam.questions.id(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    // Remove the question using array filter
    exam.questions = exam.questions.filter(q => q._id.toString() !== questionId);
    exam.markModified && exam.markModified("questions");

    await exam.save();

    res.json({ message: "Question deleted", exam });
  } catch (err) {
    console.error("DELETE QUESTION ERROR 👉", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};


export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    await exam.deleteOne(); // ✅ correct method

    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addQuestion = async (req, res) => {
  try {
    const { examId } = req.params;
    const { question, options, correctAnswer, explanation } = req.body;

    if (!question || !options || options.length !== 4 || correctAnswer === undefined) {
      return res.status(400).json({ message: "Invalid question data" });
    }

    // Normalize options
    const normalizedOptions = options.map((opt) =>
      typeof opt === "object" && opt !== null && typeof opt.text === "string"
        ? { text: opt.text }
        : { text: String(opt) }
    );

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const newQuestion = {
      question,
      options: normalizedOptions,
      correctAnswer: typeof correctAnswer === "number" ? correctAnswer : Number(correctAnswer),
      explanation: explanation || "",
    };

    exam.questions.push(newQuestion);
    await exam.save();

    // Return the newly added question (last in array)
    res.status(201).json(exam.questions[exam.questions.length - 1]);
  } catch (err) {
    console.error("ADD QUESTION ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};