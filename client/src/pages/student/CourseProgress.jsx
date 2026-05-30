import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { FaChartLine, FaCheckCircle } from "react-icons/fa";

export default function CourseProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get("/courses/progress");
        setProgress(res.data);
      } catch {
        setProgress([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-700">
          <FaChartLine /> Course Progress
        </h2>
        {[1, 2].map((n) => (
          <div key={n} className="bg-white rounded-2xl shadow border border-purple-100 p-5 animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section id="progress" className="mb-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-700">
        <FaChartLine /> Course Progress
      </h2>

      {progress.length === 0 ? (
        <div className="bg-white rounded-2xl shadow border border-purple-100 p-10 text-center">
          <FaChartLine className="text-4xl text-purple-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No progress tracked yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Open a course and mark chapters as complete to see your progress here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {progress.map((item) => (
            <div key={item.courseId} className="bg-white p-5 rounded-2xl shadow border border-purple-100">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-800 leading-snug">{item.courseTitle}</h3>
                {item.percent === 100 && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold flex-shrink-0 ml-2">
                    <FaCheckCircle /> Done
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    item.percent === 100
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gradient-to-r from-purple-400 to-pink-400"
                  }`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {item.completedChapters} / {item.totalChapters} chapter{item.totalChapters !== 1 ? "s" : ""} completed
                </span>
                <span className="font-semibold text-purple-600">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
