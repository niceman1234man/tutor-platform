import Resource from "../models/resource.js";
import cloudinary from "../config/cloudinary.js";

// CREATE Resource (Admin Upload)
export const createResource = async (req, res) => {
  try {
    const { title, category, department } = req.body;

    let fileUrl = "";
    let filePublicId = "";

    let imageUrl = "";
    let imagePublicId = "";

    // Upload FILE
    if (req.files?.file) {
      const file = req.files.file[0];

      const uploadedFile = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resources",
            resource_type: "raw"
          },
          (error, result) => (result ? resolve(result) : reject(error))
        );

        stream.end(file.buffer);
      });

      fileUrl = uploadedFile.secure_url;
      filePublicId = uploadedFile.public_id;
    }

    // Upload IMAGE
    if (req.files?.image) {
      const image = req.files.image[0];

      const uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resource-images",
            resource_type: "image"
          },
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
      imagePublicId
    });

    res.status(201).json(resource);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET All Resources (optional filter by category)
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
    } 
    else if (category === "grade9-12") {
      filter.category = { $in: ["grade9", "grade10", "grade11", "grade12"] };
    } 
    else {
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

    // Delete file from Cloudinary
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

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Update text fields
    resource.title = req.body.title || resource.title;
    resource.category = req.body.category || resource.category;

    resource.department =
      req.body.category === "exit"
        ? req.body.department || resource.department
        : null;

    // =========================
    // UPDATE RESOURCE FILE
    // =========================
    if (req.files?.file) {
      // delete old file
      if (resource.publicId) {
        await cloudinary.uploader.destroy(resource.publicId, {
          resource_type: "raw",
        });
      }

      const file = req.files.file[0];

      resource.fileUrl = file.path;
      resource.publicId = file.filename;
    }

    // =========================
    // UPDATE IMAGE
    // =========================
    if (req.files?.image) {
      if (resource.imagePublicId) {
        await cloudinary.uploader.destroy(resource.imagePublicId);
      }

      const image = req.files.image[0];

      resource.imageUrl = image.path;
      resource.imagePublicId = image.filename;
    }

    await resource.save();

    res.json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error("UPDATE RESOURCE ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

