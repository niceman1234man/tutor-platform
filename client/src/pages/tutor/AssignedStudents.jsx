import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaEnvelope, FaInfoCircle, FaSearch } from "react-icons/fa";
import API from "../../api/api";

export default function AssignedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold flex items-center gap-2 text-teal-700">
          <FaUserGraduate /> My Assigned Students
        </h1>
        {students.length > 0 && (
          <span className="bg-teal-50 text-teal-700 border border-teal-200 text-sm font-semibold px-3 py-1 rounded-full">
            {students.length} student{students.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <FaInfoCircle className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && students.length === 0 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg">
          <FaInfoCircle className="mt-0.5 shrink-0" />
          <span>No students have been assigned to you yet. An admin will assign students from the dashboard.</span>
        </div>
      )}

      {/* Table */}
      {!loading && students.length > 0 && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          {/* Search bar */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-semibold">#</th>
                  <th className="px-5 py-3 text-left font-semibold">Student</th>
                  <th className="px-5 py-3 text-left font-semibold">Email</th>
                  <th className="px-5 py-3 text-left font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-gray-400 italic">
                      No students match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((student, idx) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-gray-400 font-medium">{idx + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                            {student.name?.charAt(0).toUpperCase() || "S"}
                          </div>
                          <span className="font-semibold text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <FaEnvelope className="text-teal-400 shrink-0" />
                          {student.email}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize">
                          {student.role || "Student"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-5 py-2.5 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {students.length} student{students.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden animate-pulse">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="h-8 bg-gray-200 rounded-lg w-48" />
          </div>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
              <div className="h-4 bg-gray-200 rounded w-4" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-28" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-40 ml-4" />
              <div className="h-5 bg-gray-200 rounded-full w-16 ml-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
