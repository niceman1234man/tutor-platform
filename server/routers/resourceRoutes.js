// routes/resourceRoutes.js
import express from "express";
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByCategory,
} from "../controllers/resourceController.js";

import { upload } from "../middleware/upload.js";
// import { protect, adminOnly } from "../middleware/auth.js"; // optional

const router = express.Router();

// Admin upload
router.post("/",  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]), createResource);

// Get all / filter
router.get("/", getResources);

// Get resources by category
router.get("/category", getResourcesByCategory);

// Get one
router.get("/:id", getResourceById);

// Update
router.put("/:id",  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]), updateResource);

// Delete
router.delete("/:id", deleteResource);

export default router;