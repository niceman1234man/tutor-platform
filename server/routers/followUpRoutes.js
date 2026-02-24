import express from "express";
import { createFollowUp, getFollowUps, getFollowUpById, updateFollowUp, deleteFollowUp } from "../controllers/followUpController.js";
const router = express.Router();

router.post("/", createFollowUp);
router.get("/", getFollowUps);
router.get("/:id", getFollowUpById);
router.patch("/:id", updateFollowUp);
router.delete("/:id", deleteFollowUp);

export default router;
