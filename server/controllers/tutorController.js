import Tutor from "../models/tutor.js";

// CREATE
export const createTutor = async (req, res) => {
  const tutor = await Tutor.create({
    userId: req.user.id,
    ...req.body
  });
  res.json(tutor);
};

// READ ALL
export const getTutors = async (req, res) => {
  const tutors = await Tutor.find({ approved: true })
    .populate("userId")
    .populate("subjects")
    .populate("grades");

  res.json(tutors);
};

// READ ONE
export const getTutorById = async (req, res) => {
  const tutor = await Tutor.findById(req.params.id)
    .populate("userId")
    .populate("subjects")
    .populate("grades");

  res.json(tutor);
};

// UPDATE
export const updateTutor = async (req, res) => {
  const tutor = await Tutor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(tutor);
};

// DELETE
export const deleteTutor = async (req, res) => {
  await Tutor.findByIdAndDelete(req.params.id);
  res.json({ msg: "Tutor deleted" });
};
