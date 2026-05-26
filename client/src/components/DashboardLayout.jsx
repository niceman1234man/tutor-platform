import { FaUserGraduate, FaChalkboardTeacher, FaBookOpen, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
  links = [],
  title = "Dashboard",
  numStudents = 0,
  numTutors = 0,
  numCourses = 0,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="px-6 py-6 border-b border-teal-700">
        <h1 className="text-xl font-extrabold text-white tracking-wide">EduLink</h1>
        <p className="text-teal-300 text-sm mt-1">{title}</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-white text-teal-700 shadow font-semibold"
                  : "text-teal-100 hover:bg-teal-700 hover:text-white"
              }`
            }
          >
            {link.icon && <span className="text-lg">{link.icon}</span>}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom branding */}
      <div className="px-6 py-4 border-t border-teal-700">
        <p className="text-teal-400 text-xs">© 2026 EduLink</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-teal-700 to-teal-900 shadow-xl fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-teal-700 to-teal-900 shadow-xl z-50 md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-white text-xl"
              >
                <FaTimes />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-teal-700 text-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
          </div>
          <div className="text-2xl cursor-pointer">🔔</div>
        </header>

        {/* Stats */}
        {(numStudents > 0 || numTutors > 0 || numCourses > 0) && (
          <div className="flex flex-wrap gap-5 px-8 pt-8">
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
        )}

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
