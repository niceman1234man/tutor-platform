import express from "express";
import { createPayment, getPayments, getMyPayments, getPaymentById, updatePayment, deletePayment, approvePayment } from "../controllers/paymentController.js";
import { uploadReceipt } from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, uploadReceipt.single("receiptImage"), createPayment);
router.get("/my", protect, getMyPayments);
router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.patch("/:id", updatePayment);
router.delete("/:id", deletePayment);
router.patch("/:id/approve", approvePayment);

export default router;
