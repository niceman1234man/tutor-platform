// src/pages/tutor/TutorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";

export default function TutorsMaterials() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
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
                const res = await API.get("/courses", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setCourses(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (user) fetchCourses();
    }, [user]);

    // 

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-0 px-0">
            {/* Hero Header */}
            <div className="relative w-full h-48 md:h-56 bg-gradient-to-r from-blue-400 via-teal-400 to-green-300 flex items-center justify-center shadow-lg mb-10">
                <div className="absolute inset-0 bg-black/20 rounded-b-3xl" />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex items-center gap-4 mb-2">
                        <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" /></svg>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">Manage Tutor Materials</h2>
                    </div>
                    <p className="text-white/90 font-medium max-w-xl mx-auto drop-shadow">View and manage all your courses and materials in one place.</p>
                </div>
            </div>

            {/* Display Courses */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <div
                            key={course._id}
                            className="group p-6 bg-white/90 shadow-xl rounded-2xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition border border-slate-100 relative overflow-hidden"
                            onClick={() => navigate(`/admin/tutors/${course._id}`)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-2">
                                    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                    {course.title}
                                </h3>
                            </div>
                            <p className="mb-2 text-gray-700 min-h-[48px]">{course.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="inline-block bg-slate-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">Category: <span className="font-semibold">{course.category}</span></span>
                                <span className="inline-block bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs">Price: <span className="font-bold">${course.price}</span></span>
                            </div>
                            {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover mb-3 rounded-xl border shadow" />}
                            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}