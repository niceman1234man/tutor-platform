// controllers/resourceController.js
import Resource from "../models/resource.js";
import fs from "fs";

// CREATE Resource (Admin Upload)
export const createResource = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const resource = new Resource({
      title,
      category,
      fileUrl: `/uploads/resources/${req.file.filename}`,
      fileName: req.file.originalname,
      uploadedBy: req.user?.id, // optional
    });

    await resource.save();

    res.status(201).json({
      message: "Resource uploaded successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET All Resources (optional filter by category)
export const getResources = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const resources = await Resource.find(filter).sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Resource
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Resource
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.title = req.body.title || resource.title;
    resource.category = req.body.category || resource.category;

    if (req.file) {
      // delete old file
      fs.unlinkSync("." + resource.fileUrl);

      resource.fileUrl = `/uploads/resources/${req.file.filename}`;
      resource.fileName = req.file.originalname;
    }

    await resource.save();

    res.json({
      message: "Resource updated",
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Resource
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // delete file
    fs.unlinkSync("." + resource.fileUrl);

    await resource.deleteOne();

    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};