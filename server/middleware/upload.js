// middleware/upload.js
import multer from "multer";
import CloudinaryStorage  from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resources", // folder in Cloudinary
    allowed_formats: ["pdf", "doc", "docx", "ppt", "pptx"],
  },
});

export const upload = multer({ storage: multer.memoryStorage() });