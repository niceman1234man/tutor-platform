// src/pages/tutor/TutorDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";

export default function TutorsMaterials() {
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
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Manage Tutor Materials</h2>

            {/* Create New Course */}
            
            {/* Add Chapters */}
            
        

            {/* Display Courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="p-6 bg-white shadow rounded">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            
                        </div>
                        <p className="mb-2">{course.description}</p>
                        <p className="mb-2 font-medium">Category: {course.category} | Price: ${course.price}</p>
                        {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="w-48 h-32 object-cover mb-3 rounded" />}

                     
                   
                      
                    </div>
                ))}
            </div>

        
            
        </div>
    );
}