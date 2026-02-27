import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold text-gray-800">
        Skill <span className="text-teal-600">Nest</span>
      </h1>

      {/* Links */}
      <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <Link to="/tutors" className="hover:text-teal-600">Tutors</Link>
        <Link to="/resources" className="hover:text-teal-600">Resources</Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-teal-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* Profile */}
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 hover:text-teal-600"
            >
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="hidden md:block">Profile</span>
            </Link>

            {/* Logout */}
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}