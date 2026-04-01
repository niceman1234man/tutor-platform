import express from "express";
import { createPayment, getPayments, getPaymentById, updatePayment, deletePayment, approvePayment } from "../controllers/paymentController.js";
const router = express.Router();


router.post("/", createPayment);
router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.patch("/:id", updatePayment);
router.delete("/:id", deletePayment);

// Admin approve payment
router.patch("/:id/approve", approvePayment);

export default router;
