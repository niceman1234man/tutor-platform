import express from "express";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  toggleContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.get("/", getContacts);
router.post("/", createContact);
router.put("/:id", updateContact);
router.patch("/:id/toggle", toggleContact);
router.delete("/:id", deleteContact);

export default router;
