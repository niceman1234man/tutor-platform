
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
        <h2 className="text-3xl font-extrabold text-teal-700 drop-shadow-sm tracking-tight mb-6 animate-fade-in">Exams</h2>

        {exams.length === 0 ? (
          <div className="text-gray-600">No exams found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {exams.map((ex, idx) => (
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
        )}
      </div>
    </>
  );
}
