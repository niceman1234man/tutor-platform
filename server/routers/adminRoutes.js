import express from "express";
import { getUsers, deleteUser,toggleUserStatus,updateUserRole } from "../controllers/userController.js";
import { getAllTutors, approveTutor, approvePayment } from "../controllers/adminCotroller.js";
const router = express.Router();

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/status", toggleUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.get("/tutors", getAllTutors);
router.patch("/tutors/:id/approve", approveTutor);
router.patch("/payments/:id/approve", approvePayment);

export default router;
