import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { FaBook, FaVideo } from "react-icons/fa";
import LiveClassRoom from "../../components/LiveClassRoom";

export default function RegisteredCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [liveClass, setLiveClass] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses/registered", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCourses(res.data);
      } catch (err) {
        setCourses([]);
      }
    };
    if (user && user.token) fetchCourses();
  }, [user]);

  return (
    <>
      {liveClass && (
        <LiveClassRoom
          course={liveClass}
          role="student"
          onClose={() => setLiveClass(null)}
        />
      )}
      <section id="courses" className="mb-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-700"><FaBook /> My Registered Courses</h2>
        {courses.length === 0 ? (
          <p className="text-gray-500">You have not registered for any courses yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white/90 p-5 rounded-2xl shadow border border-blue-100">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{course.title}</h3>
                <p className="text-gray-600 mb-2">{course.description}</p>
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-sm font-medium mb-2">{course.category}</span>
                <div className="text-green-700 font-semibold mb-3">${course.price}</div>
                <button
                  onClick={() => setLiveClass(course)}
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition text-sm"
                >
                  <FaVideo /> Join Live Class
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}