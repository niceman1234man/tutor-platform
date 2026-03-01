import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { label: "Grade 1-5", value: "grade1-5" },
  { label: "Grade 6-8", value: "grade6-8" },
  { label: "Grade 9-12", value: "grade9-12" },
  { label: "Exit Exams", value: "exit" },
  { label: "Web Development", value: "web" },
  { label: "Others", value: "others" },
];

export default function Resources() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">

      <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-12">
        Resource Library
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => navigate(`/resources/${cat.value}`)}
            className="py-6 rounded-xl text-lg font-semibold shadow-md
                       bg-teal-500 text-white hover:bg-teal-600 transition"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}