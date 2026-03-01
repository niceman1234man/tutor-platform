import Resource from "../models/resource.js";
import cloudinary from "../config/cloudinary.js";

// CREATE Resource (Admin Upload)
export const createResource = async (req, res) => {
  try {
    const { title, category, department } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Upload file to Cloudinary (non-image files)
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "resources",
          resource_type: "raw", // important for PDFs, DOCs, PPTs
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      stream.end(req.file.buffer);
    });

    // Save resource in DB
    const resource = await Resource.create({
      title,
      category,
      department: category === "exit" ? department : null,
      fileUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      fileName: req.file.originalname,
      uploadedBy: req.user?.id, // optional, if you have authentication
    });

    res.status(201).json({ message: "Resource uploaded successfully", resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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

    resource.title = req.body.title || resource.title;
    resource.category = req.body.category || resource.category;
    resource.department =
      req.body.category === "exit" ? req.body.department || resource.department : null;

    if (req.file) {
      // Delete old file from Cloudinary
      if (resource.publicId) {
        await cloudinary.uploader.destroy(resource.publicId);
      }

      resource.fileUrl = req.file.path;
      resource.publicId = req.file.filename;
    }

    await resource.save();

    res.json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

