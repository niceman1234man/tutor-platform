import FollowUp from "../models/followUp.js";

// CREATE
export const createFollowUp = async (req, res) => {
  const followUp = await FollowUp.create(req.body);
  res.json(followUp);
};

// READ ALL
export const getFollowUps = async (req, res) => {
  const followUps = await FollowUp.find().populate("bookingId");
  res.json(followUps);
};

// READ ONE
export const getFollowUpById = async (req, res) => {
  const followUp = await FollowUp.findById(req.params.id);
  res.json(followUp);
};

// UPDATE
export const updateFollowUp = async (req, res) => {
  const followUp = await FollowUp.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(followUp);
};

// DELETE
export const deleteFollowUp = async (req, res) => {
  await FollowUp.findByIdAndDelete(req.params.id);
  res.json({ msg: "FollowUp deleted" });
};
