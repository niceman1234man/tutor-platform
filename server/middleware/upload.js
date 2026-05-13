import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const cvDir = path.join(__dirname, "../uploads/cv");
if (!fs.existsSync(cvDir)) fs.mkdirSync(cvDir, { recursive: true });

// Disk storage for receipt images
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `receipt_${Date.now()}${ext}`);
  },
});

// Disk storage for CV files (fallback when Cloudinary not configured)
const cvDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, cvDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cv_${Date.now()}${ext}`);
  },
});

export const uploadReceipt = multer({
  storage: diskStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// CV upload — uses memory storage so buffer is available for Cloudinary,
// but also exposes the original name/size for local fallback
export const upload = multer({ storage: multer.memoryStorage() });

// CV upload with disk storage — used as fallback when Cloudinary is not set
export const uploadCV = multer({
  storage: cvDiskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
