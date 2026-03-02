// routes/tutorRoutes.js
import express from "express";
import {protect,authorize} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  createCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
  addChapter,
  updateChapter,
  deleteChapter,
  getAllCourses
} from "../controllers/courseController.js";


const router = express.Router();



// =======================
// Courses
// =======================

// Get all courses of the logged-in tutor
router.get("/",protect,authorize("admin"), getAllCourses);
router.get("/my", protect, authorize("tutor"), getMyCourses);

// Create a new course
router.post("/", protect, authorize("tutor"), upload.single("image"), createCourse);

// Update a course
router.patch("/:id", protect, authorize("tutor"), upload.single("image"), updateCourse);

// Delete a course
router.delete("/:id", protect, authorize("tutor"), deleteCourse);


// Add a new chapter to a course
router.post("/:courseId/chapters", protect, authorize("tutor"), upload.array("files", 10), addChapter);

// Update a chapter
router.patch("/:courseId/chapters/:chapterId", protect, authorize("tutor"), upload.single("video"), updateChapter);

// Delete a chapter
router.delete("/:courseId/chapters/:chapterId", protect, authorize("tutor"), deleteChapter);

export default router;