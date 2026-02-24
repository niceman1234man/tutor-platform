// routes/resourceRoutes.js
import express from "express";
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
} from "../controllers/resourceController.js";

import { upload } from "../middleware/upload.js";
// import { protect, adminOnly } from "../middleware/auth.js"; // optional

const router = express.Router();

// Admin upload
router.post("/", upload.single("file"), createResource);

// Get all / filter
router.get("/", getResources);

// Get one
router.get("/:id", getResourceById);

// Update
router.put("/:id", upload.single("file"), updateResource);

// Delete
router.delete("/:id", deleteResource);

export default router;