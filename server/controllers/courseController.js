import Course from "../models/course.js";
import cloudinary from "../config/cloudinary.js";

/**
 * @desc Create a new course
 * @route POST /api/courses
 * @access Tutor
 */
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    // optional course image
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "courses" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        stream.end(req.file.buffer);
      });

      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const course = await Course.create({
      tutorId: req.user.id,
      title,
      description,
      category,
      price,
      imageUrl,
      imagePublicId,
      chapters: [],
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("CREATE COURSE ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Add a chapter to a course
 * @route POST /api/courses/:courseId/chapters
 * @access Tutor
 */
export const addChapter = async (req, res) => {
  try {
    const { title, description, order } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    if (course.tutorId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const contents = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {

        const isVideo = file.mimetype.startsWith("video");

        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "course-contents",
              resource_type: isVideo ? "video" : "raw",
            },
            (error, result) => (result ? resolve(result) : reject(error))
          );

          stream.end(file.buffer);
        });

        contents.push({
          type: isVideo ? "video" : "file",
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          name: file.originalname,
        });
      }
    }

    course.chapters.push({
      title,
      description,
      order,
      contents,
    });

    await course.save();

    res.status(201).json(course);
  } catch (err) {
    console.error("ADD CHAPTER ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};
/**
 * @desc Update a chapter
 * @route PATCH /api/courses/:courseId/chapters/:chapterId
 * @access Tutor
 */
export const updateChapter = async (req, res) => {
  try {
    const { title, description, order } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Authorization check
    if (course.tutorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const chapter = course.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // Update basic fields
    if (title) chapter.title = title;
    if (description) chapter.description = description;
    if (order) chapter.order = order;

    // If new file uploaded
    if (req.file) {
      // Delete old video from Cloudinary
      if (chapter.videoPublicId) {
        await cloudinary.uploader.destroy(chapter.videoPublicId, {
          resource_type: "video",
        });
      }

      // Detect file type
      const isVideo = req.file.mimetype.startsWith("video");

      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "course-contents",
            resource_type: isVideo ? "video" : "raw",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      // Save new file data
      chapter.videoUrl = uploaded.secure_url;
      chapter.videoPublicId = uploaded.public_id;
    }

    await course.save();

    res.json({
      message: "Chapter updated successfully",
      course,
    });

  } catch (err) {
    console.error("UPDATE CHAPTER ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Delete a chapter
 * @route DELETE /api/courses/:courseId/chapters/:chapterId
 * @access Tutor
 */
export const deleteChapter = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Authorization check
    if (course.tutorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const chapter = course.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // 🔥 Delete video from Cloudinary (if exists)
    if (chapter.videoPublicId) {
      try {
        await cloudinary.uploader.destroy(chapter.videoPublicId, {
          resource_type: "video",
        });
      } catch (cloudErr) {
        console.error("Cloudinary delete error 👉", cloudErr.message);
        // continue anyway (don't block deletion)
      }
    }

    // ✅ Remove chapter safely
    course.chapters = course.chapters.filter(
      (ch) => ch._id.toString() !== chapterId
    );

    await course.save();

    res.json({
      message: "Chapter deleted successfully",
      course,
    });

  } catch (err) {
    console.error("DELETE CHAPTER ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get all courses for tutor
 * @route GET /api/courses/my
 * @access Tutor
 */
export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ tutorId: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error("GET MY COURSES ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get a single course (with chapters)
 * @route GET /api/courses/:id
 * @access Tutor / Student
 */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("GET COURSE ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.tutorId.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });
    
    // Update fields
    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.category = category ?? course.category;
    course.price = price ?? course.price;

    // Update image if new file is uploaded
    if (req.file) {
      // delete old image from Cloudinary
      if (course.imagePublicId) {
        await cloudinary.uploader.destroy(course.imagePublicId);
      }

      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "courses" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        stream.end(req.file.buffer);
      });

      course.imageUrl = uploaded.secure_url;
      course.imagePublicId = uploaded.public_id;
    }

    await course.save();
    res.json(course);
  } catch (err) {
    console.error("UPDATE COURSE ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Authorization check
    if (course.tutorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔥 Delete course image from Cloudinary
    if (course.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(course.imagePublicId, { resource_type: "image" });
      } catch (cloudErr) {
        console.error("Cloudinary delete image error 👉", cloudErr.message);
      }
    }

    // 🔥 Delete all chapter videos from Cloudinary
    for (const chapter of course.chapters) {
      if (chapter.videoPublicId) {
        try {
          await cloudinary.uploader.destroy(chapter.videoPublicId, { resource_type: "video" });
        } catch (cloudErr) {
          console.error("Cloudinary delete video error 👉", cloudErr.message);
        }
      }

      // If you later allow files (PDFs, docs), you can delete them like this:
      if (chapter.contents && chapter.contents.length > 0) {
        for (const content of chapter.contents) {
          if (content.publicId) {
            try {
              await cloudinary.uploader.destroy(content.publicId, { resource_type: content.type === "video" ? "video" : "raw" });
            } catch (cloudErr) {
              console.error("Cloudinary delete content error 👉", cloudErr.message);
            }
          }
        }
      }
    }

    // ✅ Delete course from DB
    await Course.deleteOne({ _id: course._id });

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("DELETE COURSE ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Admin - Approve Application
 */
