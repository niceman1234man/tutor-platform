import express from "express";
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  deleteApplication,
  getMyApplications,
  getApplicationsApprovedByMe,
} from "../controllers/applicationController.js";
import { upload, uploadCV } from "../middleware/upload.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tutor
// Choose upload middleware at request time so env changes don't require a restart
router.post("/", protect, authorize("tutor"), (req, res, next) => {
  const mw = process.env.CLOUDINARY_CLOUD_NAME ? upload.single("cv") : uploadCV.single("cv");
  mw(req, res, next);
}, submitApplication);
router.get("/me", protect, authorize("tutor"), getMyApplications);
// Applications approved by current admin
router.get("/approved-by-me", protect, authorize("admin"), getApplicationsApprovedByMe);

// Admin
router.get("/", protect, authorize("admin"), getAllApplications);
router.get("/:id", getApplicationById);
router.put("/:id/approve", protect, authorize("admin"), approveApplication);
router.put("/:id/reject", protect, authorize("admin"), rejectApplication);

// Delete
router.delete("/:id", deleteApplication);

export default router;
