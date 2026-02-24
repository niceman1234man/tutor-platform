import Review from "../models/review.js";

// CREATE
export const createReview = async (req, res) => {
  const review = await Review.create({
    studentId: req.user.id,
    ...req.body
  });
  res.json(review);
};

// READ ALL
export const getReviews = async (req, res) => {
  const reviews = await Review.find().populate("tutorId");
  res.json(reviews);
};

// READ ONE
export const getReviewById = async (req, res) => {
  const review = await Review.findById(req.params.id);
  res.json(review);
};

// UPDATE
export const updateReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(review);
};

// DELETE
export const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ msg: "Review deleted" });
};
