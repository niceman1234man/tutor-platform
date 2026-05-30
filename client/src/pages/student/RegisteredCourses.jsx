import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import {
  FaBook,
  FaVideo,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaPlayCircle,
  FaTimes,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";
import LiveClassRoom from "../../components/LiveClassRoom";

export default function RegisteredCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveClass, setLiveClass] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  // { [courseId]: Set of completed chapterIds }
  const [completedMap, setCompletedMap] = useState({});
  const [toggling, setToggling] = useState({}); // { [chapterId]: bool }

  useEffect(() => {
    if (!user?.token) { setLoading(false); return; }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const studentId = user.user?._id?.toString() || user.user?.id?.toString() || user._id?.toString() || user.id?.toString();
        const studentEmail = user.user?.email || user.email;

        const [registeredRes, paymentsRes, progressRes] = await Promise.all([
          API.get("/courses/registered", { headers }),
          API.get("/payments", { headers }),
          API.get("/courses/progress", { headers }),
        ]);

        const registered = registeredRes.data || [];
        const approvedCourseIds = (paymentsRes.data || [])
          .filter((p) => {
            if (p.status !== "approved" || !p.courseId) return false;
            const pid = p.studentId?._id?.toString() || p.studentId?.toString();
            return pid === studentId || p.studentEmail === studentEmail;
          })
          .map((p) => (typeof p.courseId === "object" ? p.courseId._id : p.courseId));

        const registeredIds = new Set(registered.map((c) => c._id?.toString()));
        const missingIds = [...new Set(approvedCourseIds.filter((id) => id && !registeredIds.has(id.toString())))];
        const extraCourses = await Promise.all(
          missingIds.map((id) => API.get(`/courses/${id}`, { headers }).then((r) => r.data).catch(() => null))
        );

        setCourses([...registered, ...extraCourses.filter(Boolean)]);

        // Build completedMap from progress data
        const map = {};
        for (const p of progressRes.data || []) {
          map[p.courseId.toString()] = new Set((p.completedChapterIds || []).map(String));
        }
        setCompletedMap(map);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const toggleCourse = (id) => {
    setExpandedCourse((prev) => (prev === id ? null : id));
    setActiveVideo(null);
  };

  const sortedChapters = (chapters = []) =>
    [...chapters].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleToggleChapter = async (courseId, chapterId) => {
    const key = `${courseId}-${chapterId}`;
    if (toggling[key]) return;
    setToggling((t) => ({ ...t, [key]: true }));
    try {
      const res = await API.post(`/courses/${courseId}/chapters/${chapterId}/complete`);
      const completedIds = new Set((res.data.completedChapters || []).map(String));
      setCompletedMap((prev) => ({ ...prev, [courseId.toString()]: completedIds }));
    } catch {
      // silent fail — UI stays unchanged
    } finally {
      setToggling((t) => ({ ...t, [key]: false }));
    }
  };

  const getCoursePercent = (course) => {
    const chapters = sortedChapters(course.chapters);
    if (!chapters.length) return 0;
    const done = completedMap[course._id.toString()];
    const count = done ? chapters.filter((ch) => done.has(ch._id.toString())).length : 0;
    return Math.round((count / chapters.length) * 100);
  };

  return (
    <>
      {liveClass && (
        <LiveClassRoom course={liveClass} role="student" onClose={() => setLiveClass(null)} />
      )}

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-black rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
              <p className="text-white font-semibold text-sm truncate pr-4">{activeVideo.name}</p>
              <button onClick={() => setActiveVideo(null)} className="text-gray-400 hover:text-white transition flex-shrink-0">
                <FaTimes />
              </button>
            </div>
            <video src={activeVideo.url} controls autoPlay className="w-full max-h-[70vh]" />
          </div>
        </div>
      )}

      <section id="courses" className="mb-10 space-y-5">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
          <FaBook /> My Registered Courses
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow border border-blue-100 animate-pulse">
                <div className="h-36 bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow border border-blue-100 p-10 text-center">
            <FaBook className="text-4xl text-blue-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">You haven't enrolled in any courses yet.</p>
            <p className="text-gray-400 text-sm mt-1">Browse courses and click "Start" to enroll.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              const isExpanded = expandedCourse === course._id;
              const chapters = sortedChapters(course.chapters);
              const totalVideos = chapters.reduce((sum, ch) => sum + ch.contents.filter((c) => c.type === "video").length, 0);
              const totalFiles = chapters.reduce((sum, ch) => sum + ch.contents.filter((c) => c.type === "file").length, 0);
              const percent = getCoursePercent(course);
              const completedSet = completedMap[course._id.toString()] || new Set();

              return (
                <div key={course._id} className="bg-white rounded-2xl shadow border border-blue-100 overflow-hidden">
                  {/* Course header */}
                  <div className="flex gap-4 p-4">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.title} className="w-24 h-20 object-cover rounded-xl flex-shrink-0" />
                    ) : (
                      <div className="w-24 h-20 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaBook className="text-blue-300 text-2xl" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2">{course.title}</h3>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-xs font-semibold ${course.type === "pro" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                          {course.type === "pro" ? "Pro" : "Free"}
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{course.description}</p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {course.category && (
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-xs font-medium">{course.category}</span>
                        )}
                        <span className="text-gray-400 text-xs">{chapters.length} chapter{chapters.length !== 1 ? "s" : ""}</span>
                        {totalVideos > 0 && (
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <FaVideo className="text-teal-400" /> {totalVideos} video{totalVideos !== 1 ? "s" : ""}
                          </span>
                        )}
                        {totalFiles > 0 && (
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <FaFileAlt className="text-orange-400" /> {totalFiles} file{totalFiles !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {chapters.length > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{completedSet.size}/{chapters.length} chapters done</span>
                            <span className="font-semibold text-purple-600">{percent}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${percent === 100 ? "bg-green-500" : "bg-gradient-to-r from-purple-400 to-pink-400"}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 px-4 pb-3">
                    <button
                      onClick={() => setLiveClass(course)}
                      className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-xl font-semibold transition"
                    >
                      <FaVideo /> Join Live Class
                    </button>
                    {chapters.length > 0 && (
                      <button
                        onClick={() => toggleCourse(course._id)}
                        className="flex items-center gap-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm px-4 py-2 rounded-xl font-semibold transition"
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        {isExpanded ? "Hide" : "View"} Chapters
                      </button>
                    )}
                  </div>

                  {/* Chapters accordion */}
                  {isExpanded && chapters.length > 0 && (
                    <div className="border-t border-blue-50 divide-y divide-gray-100">
                      {chapters.map((chapter, idx) => {
                        const isDone = completedSet.has(chapter._id.toString());
                        const toggleKey = `${course._id}-${chapter._id}`;
                        const isToggling = !!toggling[toggleKey];

                        return (
                          <div key={chapter._id} className={`px-4 py-3 transition-colors ${isDone ? "bg-green-50/50" : ""}`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-700 text-sm">
                                Chapter {idx + 1}: {chapter.title}
                              </p>
                              <button
                                onClick={() => handleToggleChapter(course._id, chapter._id)}
                                disabled={isToggling}
                                title={isDone ? "Mark as incomplete" : "Mark as complete"}
                                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition ${
                                  isDone
                                    ? "text-green-600 bg-green-100 hover:bg-green-200"
                                    : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                                } disabled:opacity-50`}
                              >
                                {isDone ? <FaCheckCircle /> : <FaRegCircle />}
                                {isDone ? "Done" : "Mark done"}
                              </button>
                            </div>

                            {chapter.description && (
                              <p className="text-gray-500 text-xs mb-2">{chapter.description}</p>
                            )}

                            {chapter.contents && chapter.contents.length > 0 ? (
                              <div className="space-y-2 mt-2">
                                {chapter.contents.map((content) =>
                                  content.type === "video" ? (
                                    <button
                                      key={content._id}
                                      onClick={() => setActiveVideo(content)}
                                      className="flex items-center gap-2 w-full text-left bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl px-3 py-2 transition"
                                    >
                                      <FaPlayCircle className="text-teal-600 text-base flex-shrink-0" />
                                      <span className="text-sm text-teal-800 font-medium truncate">{content.name || "Video"}</span>
                                    </button>
                                  ) : (
                                    <a
                                      key={content._id}
                                      href={content.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl px-3 py-2 transition"
                                    >
                                      <FaDownload className="text-orange-500 text-sm flex-shrink-0" />
                                      <span className="text-sm text-orange-800 font-medium truncate">{content.name || "Download File"}</span>
                                    </a>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-xs italic">No content yet.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
