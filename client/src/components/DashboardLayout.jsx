import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardLayout({ children, links = [], title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-teal-700">
        <h1 className="text-xl font-extrabold text-white tracking-wide">EduLink</h1>
        <p className="text-teal-300 text-sm mt-1">{title}</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin" || link.to === "/tutor" || link.to === "/student"}
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

      <div className="px-4 py-4 border-t border-teal-700 space-y-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-teal-100 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <FaSignOutAlt className="text-base" />
          Logout
        </button>
        <p className="text-teal-400 text-xs px-1">© 2026 EduLink</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-teal-700 to-teal-900 shadow-xl fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
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

      {/* Main Area */}
      <div className="flex-1 flex flex-col md:ml-64">

        <header className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
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

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
