

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../api/api";

export default function TutorCard({ tutor }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Only show Start button. On click: check login, then registration, then go to registered course or registration page.
  const handleStart = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      // Check if registered
      const regRes = await API.get("/courses/registered", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const found = regRes.data.find((c) => c._id === tutor._id);
      if (found) {
        // Already registered: go to registered course page
        navigate(`/courses/${tutor._id}/start`);
      } else {
        // Not registered: go to registration page (or register directly)
        navigate(`/courses/${tutor._id}/register`);
      }
    } catch (err) {
      alert("Could not check registration status");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={tutor.imageUrl || "/default.jpg"}
          alt="Tutor Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
          {tutor.userId?.name || tutor.title}
        </h3>

        {/* Bio */}
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {tutor.title} - {tutor.description}
        </p>

        {/* Subjects */}
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Subjects:</span>{" "}
          {tutor.subjects?.join(", ")}
        </p>

        {/* Type Badge */}
        <div className="mb-2">
          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${tutor.type === "pro" ? "bg-yellow-200 text-yellow-800" : "bg-green-100 text-green-700"}`}>
            {tutor.type === "pro" ? "Pro" : "Free"} Course
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500 font-semibold">
            ⭐ {tutor.rating || 4.5}
          </span>
          <span className="text-gray-500 text-sm">
            ({tutor.reviewsCount || 120} ratings)
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-black">
            ${tutor.pricePerHour}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ${(tutor.pricePerHour * 1.5).toFixed(2)}
          </span>
        </div>

        {/* Only Start Button */}
        <button
          onClick={handleStart}
          className="mt-4 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Start
        </button>
      </div>
    </div>
  );
}