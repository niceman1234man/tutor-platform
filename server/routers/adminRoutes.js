import express from "express";
import { getUsers, deleteUser,toggleUserStatus,updateUserRole } from "../controllers/userController.js";
import { getAllTutors, approveTutor, approvePayment, assignStudentToTutor, createExam, getExams, getExamById } from "../controllers/adminCotroller.js";
const router = express.Router();

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id", assignStudentToTutor);
router.post("/exams", createExam);
router.get("/exams", getExams);
router.get("/exams/:id", getExamById);
router.patch("/users/:id/status", toggleUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.get("/tutors", getAllTutors);
router.patch("/tutors/:id/approve", approveTutor);
router.patch("/payments/:id/approve", approvePayment);


export default router;
