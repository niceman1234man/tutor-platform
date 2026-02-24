import express from "express";
import { createBooking, getAllBookings, getMyBookings, updateBooking, deleteBooking } from "../controllers/bookingController.js";
const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/my", getMyBookings);
router.patch("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
