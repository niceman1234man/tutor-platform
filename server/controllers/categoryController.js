import Category from "../models/category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { label, value } = req.body;
    if (!label || !value) {
      return res.status(400).json({ message: "Label and value are required" });
    }
    const existing = await Category.findOne({ value });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.create({ label, value });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
