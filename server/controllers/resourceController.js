import Resource from "../models/resource.js";
import Category from "../models/category.js";
import cloudinary from "../config/cloudinary.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE category (Admin)
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

// DELETE category (Admin)
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE Resource (Admin Upload)
export const createResource = async (req, res) => {
  try {
    const { title, category, department } = req.body;

    let fileUrl = "";
    let filePublicId = "";
    let imageUrl = "";
    let imagePublicId = "";

    if (req.files?.file) {
      const file = req.files.file[0];
      const uploadedFile = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "resources", resource_type: "raw" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        stream.end(file.buffer);
      });
      fileUrl = uploadedFile.secure_url;
      filePublicId = uploadedFile.public_id;
    }

    if (req.files?.image) {
      const image = req.files.image[0];
      const uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "resource-images", resource_type: "image" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        stream.end(image.buffer);
      });
      imageUrl = uploadedImage.secure_url;
      imagePublicId = uploadedImage.public_id;
    }

    const resource = await Resource.create({
      title,
      category,
      department,
      fileUrl,
      publicId: filePublicId,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET All Resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category === "grade6-8") {
      filter.category = { $in: ["grade6", "grade7", "grade8"] };
    } else if (category === "grade9-12") {
      filter.category = { $in: ["grade9", "grade10", "grade11", "grade12"] };
    } else {
      filter.category = category;
    }

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET Single Resource
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Resource
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource.publicId) {
      await cloudinary.uploader.destroy(resource.publicId, { resource_type: "raw" });
    }

    await resource.deleteOne();
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Resource
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    resource.title = req.body.title || resource.title;
    resource.category = req.body.category || resource.category;
    resource.department =
      req.body.category === "exit"
        ? req.body.department || resource.department
        : null;

    if (req.files?.file) {
      if (resource.publicId) {
        await cloudinary.uploader.destroy(resource.publicId, { resource_type: "raw" });
      }
      const file = req.files.file[0];
      resource.fileUrl = file.path;
      resource.publicId = file.filename;
    }

    if (req.files?.image) {
      if (resource.imagePublicId) {
        await cloudinary.uploader.destroy(resource.imagePublicId);
      }
      const image = req.files.image[0];
      resource.imageUrl = image.path;
      resource.imagePublicId = image.filename;
    }

    await resource.save();
    res.json({ message: "Resource updated successfully", resource });
  } catch (error) {
    console.error("UPDATE RESOURCE ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};
