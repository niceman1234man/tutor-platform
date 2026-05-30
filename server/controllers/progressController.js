import Progress from "../models/progress.js";
import Course from "../models/course.js";

export const toggleChapterComplete = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let progress = await Progress.findOne({ studentId, courseId });
    if (!progress) {
      progress = new Progress({ studentId, courseId, completedChapters: [] });
    }

    const alreadyDone = progress.completedChapters.some(
      (id) => id.toString() === chapterId
    );

    if (alreadyDone) {
      progress.completedChapters = progress.completedChapters.filter(
        (id) => id.toString() !== chapterId
      );
    } else {
      progress.completedChapters.push(chapterId);
    }

    await progress.save();
    res.json({ completedChapters: progress.completedChapters });
  } catch (err) {
    console.error("TOGGLE CHAPTER ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};

export const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.user.id;

    const progressList = await Progress.find({ studentId });
    if (!progressList.length) return res.json([]);

    const courseIds = progressList.map((p) => p.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } });

    const result = progressList.map((p) => {
      const course = courses.find((c) => c._id.toString() === p.courseId.toString());
      if (!course) return null;
      const totalChapters = course.chapters.length;
      const completedCount = p.completedChapters.length;
      const percent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
      return {
        courseId: course._id,
        courseTitle: course.title,
        totalChapters,
        completedChapters: completedCount,
        completedChapterIds: p.completedChapters,
        percent,
      };
    }).filter(Boolean);

    res.json(result);
  } catch (err) {
    console.error("GET PROGRESS ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};
