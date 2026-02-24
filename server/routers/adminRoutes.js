import express from "express";
import { getUsers, deleteUser } from "../controllers/userController.js";
import { getAllTutors, approveTutor, approvePayment } from "../controllers/adminCotroller.js";
const router = express.Router();

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/tutors", getAllTutors);
router.patch("/tutors/:id/approve", approveTutor);
router.patch("/payments/:id/approve", approvePayment);

export default router;
