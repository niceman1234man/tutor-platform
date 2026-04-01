import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { FaChartLine } from "react-icons/fa";

export default function CourseProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get("/courses/progress", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProgress(res.data);
      } catch (err) {
        setProgress([]);
      }
    };
    if (user && user.token) fetchProgress();
  }, [user]);

  return (
    <section id="progress" className="mb-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-700"><FaChartLine /> Course Progress</h2>
      {progress.length === 0 ? (
        <p className="text-gray-500">No progress data available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {progress.map((item) => (
            <div key={item.courseId} className="bg-white/90 p-5 rounded-2xl shadow border border-purple-100">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{item.courseTitle}</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-4 rounded-full"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{item.completedChapters} / {item.totalChapters} chapters completed</span>
                <span>{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}