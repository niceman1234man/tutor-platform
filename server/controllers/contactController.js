import Contact from "../models/contact.js";

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ order: 1, createdAt: 1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { platform, label, value, isActive, order } = req.body;
    if (!platform || !value)
      return res.status(400).json({ message: "Platform and value are required." });
    const contact = await Contact.create({ platform, label, value, isActive, order });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact not found." });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found." });
    res.json({ message: "Contact deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found." });
    contact.isActive = !contact.isActive;
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
