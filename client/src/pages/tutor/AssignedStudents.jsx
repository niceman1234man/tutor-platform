import React, { useEffect, useState } from "react";
// Route: /tutor/students
import { FaUserGraduate, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import API from "../../api/api";

export default function AssignedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/tutors/me/students")
      .then((res) => setStudents(res.data))
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to fetch assigned students.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-teal-700">
        <FaUserGraduate className="text-4xl" /> My Assigned Students
      </h1>

      {loading && (
        <div className="text-gray-400 italic">Loading students...</div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <FaInfoCircle className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg">
          <FaInfoCircle className="mt-0.5 shrink-0" />
          <span>No students have been assigned to you yet. An admin will assign students from the dashboard.</span>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white border border-gray-200 rounded-xl shadow p-5 flex flex-col gap-2 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xl font-bold shrink-0">
                  {student.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-400 capitalize">Student</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <FaEnvelope className="text-teal-400 shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
