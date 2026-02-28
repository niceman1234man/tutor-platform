import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-gray-800 flex items-center"> <span><img src={logo} alt="Skill Nest Logo" className="w-20 h-20" /></span>
Skill <span className="text-teal-600">Nest</span>
      </h1>

      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span className={`block h-0.5 w-6 bg-gray-800 mb-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block h-0.5 w-6 bg-gray-800 mb-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Links (Desktop) */}
      <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <Link to="/tutors" className="hover:text-teal-600">Tutors</Link>
        <Link to="/resources" className="hover:text-teal-600">Resources</Link>
      </div>

      {/* Right Side (Desktop) */}
      <div className="hidden md:flex items-center space-x-4">
        {!user ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-teal-600">
              Login
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 z-50 md:hidden animate-fade-in">
          <Link to="/" className="py-2 w-full text-center hover:text-teal-600" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/tutors" className="py-2 w-full text-center hover:text-teal-600" onClick={() => setMenuOpen(false)}>Tutors</Link>
          <Link to="/resources" className="py-2 w-full text-center hover:text-teal-600" onClick={() => setMenuOpen(false)}>Resources</Link>
          <div className="border-t w-4/5 my-2" />
          {!user ? (
            <>
              <Link to="/login" className="py-2 w-full text-center hover:text-teal-600" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 my-2"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 py-2 w-full justify-center text-gray-700 hover:text-teal-600"
                onClick={() => setMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span>Profile</span>
              </Link>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="text-red-500 hover:text-red-600 font-medium py-2 w-full text-center"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}