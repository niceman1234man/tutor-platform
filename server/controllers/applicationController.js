import TutorApplication from "../models/application.js";
import User from "../models/user.js";
import Tutor from "../models/tutor.js";
import cloudinary from "../config/cloudinary.js";

const cloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

/**
 * @desc Submit Tutor Application
 * @route POST /api/applications
 * @access Tutor
 */
export const submitApplication = async (req, res) => {
  try {
    console.log("[submitApplication] headers.content-type:", req.headers["content-type"]);
    console.log("[submitApplication] req.file:", req.file);
    console.log("[submitApplication] req.body (keys):", Object.keys(req.body || {}));
    const userId = req.user.id;

    // prevent duplicate applications
    const existing = await TutorApplication.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "You already submitted an application" });
    }

    const { letter, experiences } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "CV is required" });
    }

    let cvUrl = "";
    let cvPublicId = "";

    if (cloudinaryConfigured && req.file && req.file.buffer) {
      // Upload to Cloudinary using memory buffer
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "cv-resumes", resource_type: "raw" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
      cvUrl = uploaded?.secure_url || "";
      cvPublicId = uploaded?.public_id || req.file.originalname || `cloud_cv_${Date.now()}`;
    } else {
      // Fallback: file was saved to disk by uploadCV middleware
      cvUrl = `/uploads/cv/${req.file.filename || req.file.originalname}`;
      // use the stored filename or original name as a local public id so the field is always populated
      cvPublicId = req.file.filename || req.file.originalname || `local_cv_${Date.now()}`;
    }

    // Parse experiences
    let parsedExperiences = [];
    if (experiences) {
      parsedExperiences = JSON.parse(experiences).map((exp) => {
        if (exp.isCurrent) exp.endDate = null;
        return exp;
      });
    }

    console.log("Creating application with cvUrl, cvPublicId:", cvUrl, cvPublicId);

    const application = await TutorApplication.create({
      userId,
      letter,
      cvUrl,
      cvPublicId,
      experiences: parsedExperiences,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Submit application error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get My Application
 * @route GET /api/applications/me
 * @access Tutor
 */
export const getMyApplications = async (req, res) => {
  try {
    const applications = await TutorApplication.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Admin - Get All Applications
 * @route GET /api/applications
 * @access Admin
 */
export const getAllApplications = async (req, res) => {
  try {
    const applications = await TutorApplication.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Admin - Get Single Application
 */
export const getApplicationById = async (req, res) => {
  try {
    const application = await TutorApplication.findById(req.params.id).populate("userId", "name email");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Admin - Approve Application
 */
export const approveApplication = async (req, res) => {
  try {
    const app = await TutorApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = "approved";
    app.approvedBy = req.user.id;
    app.approvedAt = new Date();
    await app.save();

    await User.findByIdAndUpdate(app.userId, { role: "tutor" });

    // Ensure a Tutor profile exists and is approved so admins can assign students
    try {
      const existingTutor = await Tutor.findOne({ userId: app.userId });
      if (existingTutor) {
        existingTutor.approved = true;
        await existingTutor.save();
      } else {
        await Tutor.create({ userId: app.userId, approved: true });
      }
    } catch (tErr) {
      console.error("Error creating/updating Tutor profile:", tErr);
    }

    res.json({ message: "Application approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsApprovedByMe = async (req, res) => {
  try {
    const apps = await TutorApplication.find({ approvedBy: req.user.id })
      .populate("userId", "name email")
      .sort({ approvedAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error("GET APPS APPROVED BY ME ERROR:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/**
 * @desc Admin - Reject Application
 */
export const rejectApplication = async (req, res) => {
  try {
    const app = await TutorApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = "rejected";
    await app.save();

    res.json({ message: "Application rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete Application (Admin or Owner)
 */
export const deleteApplication = async (req, res) => {
  try {
    const app = await TutorApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (app.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (cloudinaryConfigured && app.cvPublicId) {
      await cloudinary.uploader.destroy(app.cvPublicId, { resource_type: "raw" });
    }

    await app.deleteOne();
    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
