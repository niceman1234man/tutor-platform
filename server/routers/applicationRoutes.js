import express from "express";
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  deleteApplication,
  getMyApplications,
} from "../controllers/applicationController.js";
import { upload, uploadCV } from "../middleware/upload.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Use memory storage (for Cloudinary) when credentials are set, disk otherwise
const cvMiddleware = process.env.CLOUDINARY_CLOUD_NAME ? upload : uploadCV;

// Tutor
router.post("/", protect, authorize("tutor"), cvMiddleware.single("cv"), submitApplication);
router.get("/me", protect, authorize("tutor"), getMyApplications);

// Admin
router.get("/", protect, authorize("admin"), getAllApplications);
router.get("/:id", getApplicationById);
router.put("/:id/approve", protect, authorize("admin"), approveApplication);
router.put("/:id/reject", protect, authorize("admin"), rejectApplication);

// Delete
router.delete("/:id", deleteApplication);

export default router;
