// src/pages/tutor/TutorDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";

export default function Course() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        image: null,
    });
    const [chapterForm, setChapterForm] = useState({
        title: "",
        description: "",
        order: 1,
        files: [],
    });
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Edit modals
    const [editCourse, setEditCourse] = useState(null);
    const [editChapter, setEditChapter] = useState(null);

    // Fetch tutor courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await API.get("/courses/my", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setCourses(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (user) fetchCourses();
    }, [user]);

    /** CREATE COURSE */
    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newCourse).forEach((key) => {
            if (newCourse[key]) formData.append(key, newCourse[key]);
        });
        try {
            const res = await API.post("/courses", formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${user.token}` },
            });
            setCourses([res.data, ...courses]);
            setNewCourse({ title: "", description: "", category: "", price: "", image: null });
        } catch (err) {
            console.error(err);
        }
    };

    /** ADD CHAPTER */
    const handleAddChapter = async (e) => {
        e.preventDefault();

        if (!selectedCourse) return alert("Select a course first");

        try {
            const formData = new FormData();

            // Append normal fields
            formData.append("title", chapterForm.title);
            formData.append("description", chapterForm.description);
            formData.append("order", chapterForm.order);

            // ✅ Append multiple files properly
            if (chapterForm.files && chapterForm.files.length > 0) {
                for (let i = 0; i < chapterForm.files.length; i++) {
                    formData.append("files", chapterForm.files[i]);
                }
            }

            const res = await API.post(
                `/courses/${selectedCourse._id}/chapters`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            // Update UI
            setCourses(
                courses.map((c) =>
                    c._id === selectedCourse._id ? res.data : c
                )
            );

            // Reset form
            setChapterForm({
                title: "",
                description: "",
                order: 1,
                files: [],
            });

        } catch (err) {
            console.error("ADD CHAPTER ERROR 👉", err);
        }
    };
    /** DELETE CHAPTER */
    const handleDeleteChapter = async (courseId, chapterId) => {
        try {
            const res = await API.delete(`/courses/${courseId}/chapters/${chapterId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCourses(courses.map(c => c._id === courseId ? res.data.course : c));
        } catch (err) {
            console.error(err);
        }
    };

    /** DELETE COURSE */
    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await API.delete(`/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCourses(courses.filter(c => c._id !== courseId));
        } catch (err) {
            console.error(err);
        }
    };

    /** EDIT COURSE */
    const handleEditCourseSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(editCourse).forEach((key) => {
            if (editCourse[key]) formData.append(key, editCourse[key]);
        });
        try {
            const res = await API.patch(`/courses/${editCourse._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${user.token}` },
            });
            setCourses(courses.map(c => c._id === editCourse._id ? res.data : c));
            setEditCourse(null);
        } catch (err) {
            console.error(err);
        }
    };

    /** EDIT CHAPTER */
    const handleEditChapterSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(editChapter).forEach((key) => {
            if (editChapter[key]) formData.append(key, editChapter[key]);
        });
        try {
            const res = await API.patch(
                `/courses/${editChapter.courseId}/chapters/${editChapter._id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${user.token}` },
                }
            );
            setCourses(courses.map(c => c._id === editChapter.courseId ? res.data : c));
            setEditChapter(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Tutor Dashboard</h2>

            {/* Create New Course */}
            <div className="mb-8 p-6 bg-white shadow rounded">
                <h3 className="text-xl font-semibold mb-4">Create New Course</h3>
                <form onSubmit={handleCourseSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newCourse.title}
                        onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                        className="border px-3 py-2 w-full rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newCourse.description}
                        onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                        className="border px-3 py-2 w-full rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newCourse.category}
                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                        className="border px-3 py-2 w-full rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newCourse.price}
                        onChange={e => setNewCourse({ ...newCourse, price: e.target.value })}
                        className="border px-3 py-2 w-full rounded"
                        required
                    />
                    <div>
                        <p className="text-sm text-gray-600">Course Image (optional)</p>
                        <input
                        type="file"
                        accept="image/*"
                        onChange={e => setNewCourse({ ...newCourse, image: e.target.files[0] })}
                    />
                    </div>
                    
                    <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                        Create Course
                    </button>
                </form>
            </div>

            {/* Add Chapters */}
            {courses.length > 0 && (
                <div className="mb-8 p-6 bg-white shadow rounded">
                    <h3 className="text-xl font-semibold mb-3">Add Chapters</h3>
                    <select
                        className="border px-3 py-2 rounded mb-3 w-full"
                        value={selectedCourse?._id || ""}
                        onChange={e => setSelectedCourse(courses.find(c => c._id === e.target.value))}
                    >
                        <option value="">Select a course</option>
                        {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>
                    {selectedCourse && (
                        <form onSubmit={handleAddChapter} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Chapter Title"
                                value={chapterForm.title}
                                onChange={e => setChapterForm({ ...chapterForm, title: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <textarea
                                placeholder="Chapter Description"
                                value={chapterForm.description}
                                onChange={e => setChapterForm({ ...chapterForm, description: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Order"
                                value={chapterForm.order}
                                onChange={e => setChapterForm({ ...chapterForm, order: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <input
                                type="file"
                                multiple
                                onChange={e => setChapterForm({ ...chapterForm, files: e.target.files })}
                            />
                            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                                Add Chapter
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Display Courses */}
            <div className="space-y-6">
                {courses.map(course => (
                    <div key={course._id} className="p-6 bg-white shadow rounded">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditCourse(course)}
                                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCourse(course._id)}
                                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <p className="mb-2">{course.description}</p>
                        <p className="mb-2 font-medium">Category: {course.category} | Price: ${course.price}</p>
                        {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="w-48 h-32 object-cover mb-3 rounded" />}

                        {/* Chapters */}
                        {/* Chapters */}
<h4 className="font-semibold mb-2">Chapters</h4>

{course.chapters.length === 0 ? (
  <p className="text-gray-600">No chapters yet.</p>
) : (
  course.chapters.map((ch) => (
    <div
      key={ch._id}
      className="border p-3 rounded mb-2 flex justify-between items-start"
    >
      <div className="flex-1">
        <p>
          <strong>{ch.title}</strong> (Chapter {ch.order})
        </p>
        <p className="mb-2">{ch.description}</p>

        {/* ✅ DISPLAY CONTENTS */}
        {ch.contents && ch.contents.length > 0 && (
          <div className="space-y-2 mt-2">
            {ch.contents.map((item, i) => (
              <div key={i}>
                {/* 🎥 VIDEO */}
                {item.type === "video" && (
                  <video
                    src={item.url}
                    controls
                    className="w-64 h-36 rounded"
                  />
                )}

                {/* 📄 FILE (PDF / DOC) */}
                {item.type === "file" && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    📄 {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() =>
            setEditChapter({ ...ch, courseId: course._id })
          }
          className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
        >
          Edit
        </button>

        <button
          onClick={() =>
            handleDeleteChapter(course._id, ch._id)
          }
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  ))
)}
                    </div>
                ))}
            </div>

            {/* Edit Course Modal */}
            {editCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-xl font-semibold mb-4">Edit Course</h3>
                        <form onSubmit={handleEditCourseSubmit} className="space-y-3">
                            <input
                                type="text"
                                value={editCourse.title}
                                onChange={e => setEditCourse({ ...editCourse, title: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <textarea
                                value={editCourse.description}
                                onChange={e => setEditCourse({ ...editCourse, description: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <input
                                type="text"
                                value={editCourse.category}
                                onChange={e => setEditCourse({ ...editCourse, category: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <input
                                type="number"
                                value={editCourse.price}
                                onChange={e => setEditCourse({ ...editCourse, price: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <input type="file" onChange={e => setEditCourse({ ...editCourse, image: e.target.files[0] })} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditCourse(null)} className="px-3 py-1 border rounded">Cancel</button>
                                <button type="submit" className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Chapter Modal */}
            {editChapter && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-xl font-semibold mb-4">Edit Chapter</h3>
                        <form onSubmit={handleEditChapterSubmit} className="space-y-3">
                            <input
                                type="text"
                                value={editChapter.title}
                                onChange={e => setEditChapter({ ...editChapter, title: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <textarea
                                value={editChapter.description}
                                onChange={e => setEditChapter({ ...editChapter, description: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <input
                                type="number"
                                value={editChapter.order}
                                onChange={e => setEditChapter({ ...editChapter, order: e.target.value })}
                                className="border px-3 py-2 w-full rounded"
                                required
                            />
                            <input type="file" onChange={e => setEditChapter({ ...editChapter, video: e.target.files[0] })} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditChapter(null)} className="px-3 py-1 border rounded">Cancel</button>
                                <button type="submit" className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}