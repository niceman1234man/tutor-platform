import express from "express";
import { createTutor, getTutors, getTutorById, updateTutor, deleteTutor, getMyAssignedStudents } from "../controllers/tutorController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createTutor);
router.get("/", getTutors);
router.get("/me/students", protect, authorize("tutor"), getMyAssignedStudents);
router.get("/:id", getTutorById);
router.patch("/:id", updateTutor);
router.delete("/:id", deleteTutor);

export default router;
