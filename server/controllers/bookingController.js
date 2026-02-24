import Booking from "../models/booking.js";

// CREATE
export const createBooking = async (req, res) => {
  const booking = await Booking.create({
    studentId: req.user.id,
    ...req.body
  });
  res.json(booking);
};

// READ ALL (Admin)
export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("studentId")
    .populate("tutorId");
  res.json(bookings);
};

// READ MY BOOKINGS
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ studentId: req.user.id })
    .populate("tutorId");
  res.json(bookings);
};

// UPDATE
export const updateBooking = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(booking);
};

// DELETE
export const deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ msg: "Booking deleted" });
};
