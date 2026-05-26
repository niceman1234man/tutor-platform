// routes/resourceRoutes.js
import express from "express";
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByCategory,
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/resourceController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Category routes (must come before /:id)
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.delete("/categories/:id", deleteCategory);

// Admin upload
router.post("/", upload.fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
]), createResource);

// Get all
router.get("/", getResources);

// Get resources by category
router.get("/category", getResourcesByCategory);

// Get one
router.get("/:id", getResourceById);

// Update
router.put("/:id", upload.fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
]), updateResource);

// Delete
router.delete("/:id", deleteResource);

export default router;
