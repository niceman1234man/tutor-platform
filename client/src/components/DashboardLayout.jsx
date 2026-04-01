
import { FaUserGraduate, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import React from "react";

export default function DashboardLayout({
  children,
  links = [],
  title = "Dashboard",
  numStudents = 0,
  numTutors = 0,
  numCourses = 0,
}) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ===== HEADER ===== */}

      <div className="flex items-center justify-between px-10 py-4 bg-white shadow">
        {/* Dynamic Title */}
        <h2 className="text-xl font-semibold text-gray-700">
          {title}
        </h2>
        {/* Notification */}
        <div className="text-2xl cursor-pointer">
          🔔
        </div>
      </div>

      <div className="">

        {/* ===== SIDEBAR ===== */}
        <aside className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10 max-w-4xl mx-auto">
          {links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="block bg-teal-600 text-white text-center py-4 rounded-full shadow hover:bg-teal-700 transition"
            >
              {link.label}
            </a>
          ))}
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-10">

          

          {children}
        </main>

      </div>
      {/* ===== DASHBOARD STATS ===== */}
      <div className="flex flex-wrap justify-center gap-8 px-10 py-8">
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-lg p-8 min-w-[200px] text-center text-white flex flex-col items-center hover:shadow-2xl transition-all duration-300"
        >
          <FaUserGraduate className="text-5xl mb-3 drop-shadow-lg" />
          <div className="text-4xl font-extrabold">{numStudents}</div>
          <div className="text-lg mt-2 tracking-wide font-medium">Students</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-700 rounded-2xl shadow-lg p-8 min-w-[200px] text-center text-white flex flex-col items-center hover:shadow-2xl transition-all duration-300"
        >
          <FaChalkboardTeacher className="text-5xl mb-3 drop-shadow-lg" />
          <div className="text-4xl font-extrabold">{numTutors}</div>
          <div className="text-lg mt-2 tracking-wide font-medium">Tutors</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg p-8 min-w-[200px] text-center text-white flex flex-col items-center hover:shadow-2xl transition-all duration-300"
        >
          <FaBookOpen className="text-5xl mb-3 drop-shadow-lg" />
          <div className="text-4xl font-extrabold">{numCourses}</div>
          <div className="text-lg mt-2 tracking-wide font-medium">Courses</div>
        </motion.div>
      </div>

    </div>
  );
}