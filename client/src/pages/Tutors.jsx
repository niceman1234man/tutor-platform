import React, { useEffect, useState, useMemo } from "react";
import TutorCard from "../components/TutorCard";
import API from "../api/api";
import { FaSearch, FaBook, FaTimes } from "react-icons/fa";

const TYPE_FILTERS = [
  { label: "All", value: "" },
  { label: "Free", value: "free" },
  { label: "Pro", value: "pro" },
];

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await API.get("/courses");
        setTutors(res.data);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tutors.filter((t) => {
      const matchesSearch =
        !q ||
        t.title?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q);
      const matchesType = !typeFilter || t.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [tutors, search, typeFilter]);

  const clearSearch = () => {
    setSearch("");
    setTypeFilter("");
  };

  const hasFilters = search || typeFilter;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
          {/* Text search */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by title, category, or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-gray-50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* Type filter pills */}
          <div className="flex gap-2 flex-shrink-0">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  typeFilter === f.value
                    ? f.value === "pro"
                      ? "bg-yellow-400 border-yellow-400 text-white"
                      : f.value === "free"
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-teal-600 border-teal-600 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Results summary */}
        {!loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {hasFilters ? (
                <>
                  <span className="font-semibold text-gray-700">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} found
                  {search && <span> for "<span className="font-medium text-teal-700">{search}</span>"</span>}
                </>
              ) : (
                <><span className="font-semibold text-gray-700">{tutors.length}</span> courses available</>
              )}
            </p>
            {hasFilters && (
              <button
                onClick={clearSearch}
                className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
              >
                <FaTimes className="text-xs" /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow animate-pulse overflow-hidden">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <FaBook className="text-5xl text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">No courses found</h3>
            <p className="text-gray-400 text-sm mb-4">
              {hasFilters ? "Try adjusting your search or filters." : "No courses are available yet."}
            </p>
            {hasFilters && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition"
              >
                <FaTimes /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* Course grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((t) => (
              <TutorCard key={t._id} tutor={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
