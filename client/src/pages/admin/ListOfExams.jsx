
import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function ListOfExams() {
  // Animation styles for this component only
  const animationStyles = `
    .animate-fade-in { animation: fadeIn 0.5s; }
    .animate-pop { animation: popIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
    @keyframes popIn { 0% { transform: scale(0.95); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
  `;
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchExams = async () => {
      try {
        const { data } = await API.get("/admin/exams");
        if (!mounted) return;
        setExams(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load exams.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchExams();
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="p-6">Loading exams…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <>
      <style>{animationStyles}</style>
      <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-teal-50 shadow-2xl rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-teal-700 drop-shadow-sm tracking-tight">Exams</h2>
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by title or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border-2 border-teal-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-700 text-sm transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {(() => {
          const filtered = exams.filter((ex) => {
            const q = search.toLowerCase();
            return (
              ex.title?.toLowerCase().includes(q) ||
              (ex.category || "").toLowerCase().includes(q)
            );
          });
          return filtered.length === 0 ? (
          <div className="text-gray-600">{exams.length === 0 ? "No exams found." : "No exams match your search."}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((ex, idx) => (
              <div
                key={ex._id}
                className="p-6 border-2 border-indigo-100 rounded-2xl bg-white shadow-xl flex flex-col justify-between animate-pop hover:shadow-2xl hover:border-teal-300 transition-all duration-200"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div>
                  <div className="font-bold text-lg text-indigo-700 mb-1 truncate">{ex.title}</div>
                  <div className="text-sm text-gray-500 mb-2">Category: <span className="font-semibold text-indigo-600">{ex.category || "—"}</span></div>
                  <div className="text-xs text-gray-400 mb-4">Duration: <span className="font-semibold">{ex.duration ? `${ex.duration} min` : "—"}</span></div>
                </div>
                <button
                  className="mt-auto bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-5 py-2 rounded-lg shadow-md font-semibold text-base hover:scale-105 active:scale-100 transition-transform duration-150"
                  onClick={() => window.location.href = `/exam/${ex._id}`}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        );
        })()}
      </div>
    </>
  );
}
