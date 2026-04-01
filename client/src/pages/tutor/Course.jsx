// src/pages/tutor/TutorDashboard.jsx

import React, { useEffect, useState } from "react";
import { FaBookOpen, FaPlus, FaEdit, FaTrash, FaLayerGroup, FaChalkboardTeacher, FaDollarSign, FaImage, FaListOl, FaRegSave, FaTimes, FaFileUpload, FaVideo, FaFileAlt } from "react-icons/fa";
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10">
            {/* Hero Header */}
            <div className="max-w-4xl mx-auto text-center mb-10">
                <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shadow-lg">
                        <FaBookOpen className="text-white text-4xl" />
                    </span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight drop-shadow-lg">Tutor Dashboard</h2>
                <p className="text-lg text-gray-600">Manage your courses and chapters. Create, edit, and organize your teaching content with ease!</p>
            </div>

            {/* Create New Course */}
            <div className="mb-10 max-w-3xl mx-auto p-8 bg-white/90 shadow-2xl rounded-3xl border border-purple-100">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800"><FaPlus className="text-blue-500" /> Create New Course</h3>
                <form onSubmit={handleCourseSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Title"
                            value={newCourse.title}
                            onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                            className="border-2 border-blue-200 p-3 rounded-xl bg-blue-50 focus:ring-2 focus:ring-blue-300"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={newCourse.category}
                            onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                            className="border-2 border-purple-200 p-3 rounded-xl bg-purple-50 focus:ring-2 focus:ring-purple-300"
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Description"
                        value={newCourse.description}
                        onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                        className="border-2 border-pink-200 p-3 rounded-xl bg-pink-50 focus:ring-2 focus:ring-pink-300 w-full"
                        required
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                        <input
                            type="number"
                            placeholder="Price"
                            value={newCourse.price}
                            onChange={e => setNewCourse({ ...newCourse, price: e.target.value })}
                            className="border-2 border-green-200 p-3 rounded-xl bg-green-50 focus:ring-2 focus:ring-green-300"
                            required
                        />
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1"><FaImage className="text-purple-400" /> Course Image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setNewCourse({ ...newCourse, image: e.target.files[0] })}
                                className="w-full border-2 border-purple-200 p-2 rounded-xl bg-purple-50"
                            />
                        </div>
                    </div>
                    <button type="submit" className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-2 text-lg font-bold">
                        <FaPlus /> Create Course
                    </button>
                </form>
            </div>

            {/* Add Chapters */}
            {courses.length > 0 && (
                <div className="mb-10 max-w-3xl mx-auto p-8 bg-white/90 shadow-2xl rounded-3xl border border-pink-100">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800"><FaLayerGroup className="text-pink-500" /> Add Chapters</h3>
                    <select
                        className="border-2 border-blue-200 p-3 rounded-xl mb-4 w-full bg-blue-50"
                        value={selectedCourse?._id || ""}
                        onChange={e => setSelectedCourse(courses.find(c => c._id === e.target.value))}
                    >
                        <option value="">Select a course</option>
                        {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>
                    {selectedCourse && (
                        <form onSubmit={handleAddChapter} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    placeholder="Chapter Title"
                                    value={chapterForm.title}
                                    onChange={e => setChapterForm({ ...chapterForm, title: e.target.value })}
                                    className="border-2 border-blue-200 p-3 rounded-xl bg-blue-50 focus:ring-2 focus:ring-blue-300"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Order"
                                    value={chapterForm.order}
                                    onChange={e => setChapterForm({ ...chapterForm, order: e.target.value })}
                                    className="border-2 border-purple-200 p-3 rounded-xl bg-purple-50 focus:ring-2 focus:ring-purple-300"
                                    required
                                />
                            </div>
                            <textarea
                                placeholder="Chapter Description"
                                value={chapterForm.description}
                                onChange={e => setChapterForm({ ...chapterForm, description: e.target.value })}
                                className="border-2 border-pink-200 p-3 rounded-xl bg-pink-50 focus:ring-2 focus:ring-pink-300 w-full"
                                required
                            />
                            <div>
                                <label className="flex items-center gap-2 text-gray-700 font-medium mb-1"><FaFileUpload className="text-green-400" /> Upload Files</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={e => setChapterForm({ ...chapterForm, files: e.target.files })}
                                    className="w-full border-2 border-green-200 p-2 rounded-xl bg-green-50"
                                />
                            </div>
                            <button type="submit" className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-2 text-lg font-bold">
                                <FaPlus /> Add Chapter
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Display Courses */}
            <div className="grid gap-8 max-w-6xl mx-auto">
                {courses.map(course => (
                    <div key={course._id} className="p-8 bg-white/90 shadow-2xl rounded-3xl border border-blue-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shadow-lg">
                                    <FaChalkboardTeacher className="text-white text-2xl" />
                                </span>
                                <h3 className="text-2xl font-bold text-gray-800">{course.title}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditCourse(course)}
                                    className="bg-yellow-400 px-4 py-2 rounded-xl hover:bg-yellow-500 flex items-center gap-2 font-semibold shadow"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCourse(course._id)}
                                    className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 text-white flex items-center gap-2 font-semibold shadow"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                        <p className="mb-2 text-gray-700">{course.description}</p>
                        <div className="flex flex-wrap gap-4 mb-3">
                            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-xl font-medium"><FaListOl /> {course.category}</span>
                            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-xl font-medium"><FaDollarSign /> ${course.price}</span>
                        </div>
                        {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="w-48 h-32 object-cover mb-3 rounded-xl shadow" />}

                        {/* Chapters */}
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-700"><FaLayerGroup /> Chapters</h4>

                        {course.chapters.length === 0 ? (
                            <p className="text-gray-500">No chapters yet.</p>
                        ) : (
                            <div className="grid gap-3">
                                {course.chapters.map((ch) => (
                                    <div
                                        key={ch._id}
                                        className="border-2 border-pink-100 p-4 rounded-2xl bg-pink-50 shadow flex flex-col md:flex-row md:justify-between md:items-start gap-4"
                                    >
                                        <div className="flex-1">
                                            <p className="font-bold text-lg text-gray-800 flex items-center gap-2"><FaBookOpen className="text-pink-400" /> {ch.title} <span className="text-xs text-gray-500">(Chapter {ch.order})</span></p>
                                            <p className="mb-2 text-gray-700">{ch.description}</p>

                                            {/* ✅ DISPLAY CONTENTS */}
                                            {ch.contents && ch.contents.length > 0 && (
                                                <div className="space-y-2 mt-2">
                                                    {ch.contents.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            {/* 🎥 VIDEO */}
                                                            {item.type === "video" && (
                                                                <span className="inline-flex items-center gap-1 text-blue-600"><FaVideo />
                                                                    <video
                                                                        src={item.url}
                                                                        controls
                                                                        className="w-40 h-24 rounded shadow"
                                                                    />
                                                                </span>
                                                            )}

                                                            {/* 📄 FILE (PDF / DOC) */}
                                                            {item.type === "file" && (
                                                                <a
                                                                    href={item.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 text-purple-600 underline"
                                                                >
                                                                    <FaFileAlt /> {item.name}
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 md:ml-4">
                                            <button
                                                onClick={() => setEditChapter({ ...ch, courseId: course._id })}
                                                className="bg-yellow-400 px-4 py-2 rounded-xl hover:bg-yellow-500 flex items-center gap-2 font-semibold shadow"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChapter(course._id, ch._id)}
                                                className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 text-white flex items-center gap-2 font-semibold shadow"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Edit Course Modal */}
            {editCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-96 shadow-2xl border border-blue-100">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800"><FaEdit className="text-yellow-500" /> Edit Course</h3>
                        <form onSubmit={handleEditCourseSubmit} className="space-y-5">
                            <input
                                type="text"
                                value={editCourse.title}
                                onChange={e => setEditCourse({ ...editCourse, title: e.target.value })}
                                className="border-2 border-blue-200 p-3 w-full rounded-xl bg-blue-50"
                                required
                            />
                            <textarea
                                value={editCourse.description}
                                onChange={e => setEditCourse({ ...editCourse, description: e.target.value })}
                                className="border-2 border-pink-200 p-3 w-full rounded-xl bg-pink-50"
                                required
                            />
                            <input
                                type="text"
                                value={editCourse.category}
                                onChange={e => setEditCourse({ ...editCourse, category: e.target.value })}
                                className="border-2 border-purple-200 p-3 w-full rounded-xl bg-purple-50"
                                required
                            />
                            <input
                                type="number"
                                value={editCourse.price}
                                onChange={e => setEditCourse({ ...editCourse, price: e.target.value })}
                                className="border-2 border-green-200 p-3 w-full rounded-xl bg-green-50"
                                required
                            />
                            <input type="file" onChange={e => setEditCourse({ ...editCourse, image: e.target.files[0] })} className="w-full border-2 border-purple-200 p-2 rounded-xl bg-purple-50" />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditCourse(null)} className="px-4 py-2 border rounded-xl flex items-center gap-2"><FaTimes /> Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl flex items-center gap-2 font-bold"><FaRegSave /> Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Chapter Modal */}
            {editChapter && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-96 shadow-2xl border border-pink-100">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800"><FaEdit className="text-yellow-500" /> Edit Chapter</h3>
                        <form onSubmit={handleEditChapterSubmit} className="space-y-5">
                            <input
                                type="text"
                                value={editChapter.title}
                                onChange={e => setEditChapter({ ...editChapter, title: e.target.value })}
                                className="border-2 border-blue-200 p-3 w-full rounded-xl bg-blue-50"
                                required
                            />
                            <textarea
                                value={editChapter.description}
                                onChange={e => setEditChapter({ ...editChapter, description: e.target.value })}
                                className="border-2 border-pink-200 p-3 w-full rounded-xl bg-pink-50"
                                required
                            />
                            <input
                                type="number"
                                value={editChapter.order}
                                onChange={e => setEditChapter({ ...editChapter, order: e.target.value })}
                                className="border-2 border-purple-200 p-3 w-full rounded-xl bg-purple-50"
                                required
                            />
                            <input type="file" onChange={e => setEditChapter({ ...editChapter, video: e.target.files[0] })} className="w-full border-2 border-green-200 p-2 rounded-xl bg-green-50" />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditChapter(null)} className="px-4 py-2 border rounded-xl flex items-center gap-2"><FaTimes /> Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-pink-500 text-white rounded-xl flex items-center gap-2 font-bold"><FaRegSave /> Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}