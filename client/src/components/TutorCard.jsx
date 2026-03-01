import React from "react";
import { useNavigate } from "react-router-dom";

export default function TutorCard({ tutor }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tutors/${tutor._id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={tutor.profileImage || "/default.jpg"}
          alt={tutor.userId.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
          {tutor.userId.name}
        </h3>

        {/* Bio */}
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {tutor.bio}
        </p>

        {/* Subjects */}
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Subjects:</span>{" "}
          {tutor.subjects?.join(", ")}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500 font-semibold">
            ⭐ {tutor.rating || 4.5}
          </span>
          <span className="text-gray-500 text-sm">
            ({tutor.reviewsCount || 120} ratings)
          </span>
        </div>

        {/* Badge */}
        <div className="mb-2">
          <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-md font-semibold">
            Bestseller
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

        {/* Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tutors/${tutor._id}`);
          }}
          className="mt-4 text-teal-700 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}