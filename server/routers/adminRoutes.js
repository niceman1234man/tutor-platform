
import express from "express";
import { getUsers, deleteUser, toggleUserStatus, updateUserRole } from "../controllers/userController.js";
import { getAllTutors, getApprovedTutorApplications, getAssignedStudents, approveTutor, approvePayment, assignStudentToTutor, createExam, getExams, getExamById, updateQuestion, deleteQuestion, deleteExam, addQuestion, importExamFromHTML, updateCourseType } from "../controllers/adminCotroller.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/students/assigned", getAssignedStudents);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id", assignStudentToTutor);
router.post("/exams", createExam);
router.post("/exams/import-html", importExamFromHTML);
router.get("/exams", getExams);
router.get("/exams/:id", getExamById);
router.put("/exams/:examId/questions/:questionId", updateQuestion);
router.post("/exams/:examId/questions", addQuestion);
router.delete("/exams/:examId/questions/:questionId", deleteQuestion);
router.delete("/exams/:id", deleteExam);
router.patch("/users/:id/status", toggleUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.get("/tutors", getAllTutors);
router.get("/tutors/approved-applications", getApprovedTutorApplications);
router.patch("/tutors/:id/approve", approveTutor);
router.patch("/payments/:id/approve", approvePayment);
router.patch("/courses/:id/type", updateCourseType);

export default router;
