import TutorApplication from "../models/application.js";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";

/**
 * @desc Submit Tutor Application
 * @route POST /api/applications
 * @access Tutor
 */
export const submitApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    // prevent duplicate applications
    const existing = await TutorApplication.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        message: "You already submitted an application",
      });
    }

    const { letter, experiences } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "CV is required" });
    }

    // 🔥 Upload to Cloudinary
  
const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "cv-resumes",
          resource_type: "raw", // important for PDFs, DOCs, PPTs
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      stream.end(req.file.buffer);
    });

    // Parse experiences
    let parsedExperiences = [];
    if (experiences) {
      parsedExperiences = JSON.parse(experiences);

      parsedExperiences = parsedExperiences.map((exp) => {
        if (exp.isCurrent) {
          exp.endDate = null;
        }
        return exp;
      });
    }

    const application = await TutorApplication.create({
      userId,
      letter,
      cvUrl: uploaded.secure_url,
      cvPublicId: uploaded.public_id, // for delete later
      experiences: parsedExperiences,
    });

    res.status(201).json(application);
  } catch (error) {
      console.error("FULL ERROR 👉", error); // 👈 IMPORTANT
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
    console.log ("User ID 👉", req.user.id); // 👈 DEBUG
    const applications = await TutorApplication.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(applications);
    console.log("My Applications 👉", applications); // 👈 DEBUG
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
    const application = await TutorApplication.findById(req.params.id)
      .populate("userId", "name email");

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

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.status = "approved";
    await app.save();

    // update user role
    await User.findByIdAndUpdate(app.userId, {
      role: "tutor",
    });

    res.json({ message: "Application approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Admin - Reject Application
 */
export const rejectApplication = async (req, res) => {
  try {
    const app = await TutorApplication.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

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

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      app.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔥 delete from Cloudinary
    if (app.cvPublicId) {
      await cloudinary.uploader.destroy(app.cvPublicId, {
        resource_type: "raw",
      });
    }

    await app.deleteOne();

    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};