import React, { useState, useEffect } from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import API from "../../api/api";

export default function AdminDashboard() {
  const [numStudents, setNumStudents] = useState(0);
  const [numTutors, setNumTutors] = useState(0);
  const [numCourses, setNumCourses] = useState(0);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNumStudents(res.data.filter((u) => u.role === "student").length);
          setNumTutors(res.data.filter((u) => u.role === "tutor").length);
        }
      })
      .catch(() => {});
    API.get("/courses")
      .then((res) => setNumCourses(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-5 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-lg p-6 min-w-[160px] text-center text-white flex flex-col items-center"
        >
          <FaUserGraduate className="text-4xl mb-2 drop-shadow" />
          <div className="text-3xl font-extrabold">{numStudents}</div>
          <div className="text-sm mt-1 font-medium">Students</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-700 rounded-2xl shadow-lg p-6 min-w-[160px] text-center text-white flex flex-col items-center"
        >
          <FaChalkboardTeacher className="text-4xl mb-2 drop-shadow" />
          <div className="text-3xl font-extrabold">{numTutors}</div>
          <div className="text-sm mt-1 font-medium">Tutors</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg p-6 min-w-[160px] text-center text-white flex flex-col items-center"
        >
          <FaBookOpen className="text-4xl mb-2 drop-shadow" />
          <div className="text-3xl font-extrabold">{numCourses}</div>
          <div className="text-sm mt-1 font-medium">Courses</div>
        </motion.div>
      </div>

      <h3 className="text-2xl font-bold text-gray-700 mb-2">Welcome, Admin</h3>
      <p className="text-gray-500">Use the sidebar to manage users, tutors, resources, exams and payments.</p>
    </div>
  );
}
