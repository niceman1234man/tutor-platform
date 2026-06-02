import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import API from "../../api/api";
import {
  FaBook,
  FaUsers,
  FaFileAlt,
  FaChalkboardTeacher,
  FaArrowRight,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaLayerGroup,
  FaUserGraduate,
  FaPlusCircle,
} from "react-icons/fa";

const STATUS_META = {
  approved: { label: "Approved", icon: <FaCheckCircle />, classes: "bg-green-100 text-green-700" },
  pending:  { label: "Pending",  icon: <FaHourglassHalf />, classes: "bg-amber-100 text-amber-700" },
  rejected: { label: "Rejected", icon: <FaTimesCircle />, classes: "bg-red-100 text-red-600" },
};

function StatCard({ icon, label, value, sub, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left w-full hover:shadow-md transition-all duration-200 ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${bg} ${color}`}>
          {icon}
        </div>
      </div>
      {onClick && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
          View <FaArrowRight className="text-xs" />
        </div>
      )}
    </button>
  );
}

function CourseRow({ course, index }) {
  const navigate = useNavigate();
  const chapters = course.chapters?.length ?? 0;
  const students = course.students?.length ?? 0;
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
      onClick={() => navigate("/tutor/courses")}
    >
      <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{course.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{chapters} chapter{chapters !== 1 ? "s" : ""} · {students} student{students !== 1 ? "s" : ""}</p>
      </div>
      <FaArrowRight className="text-gray-300 group-hover:text-purple-500 transition text-xs flex-shrink-0" />
    </div>
  );
}

function StudentRow({ student, index }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
      <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
        {(student.name || "?")[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{student.name}</p>
        <p className="text-xs text-gray-400 truncate">{student.email}</p>
      </div>
    </div>
  );
}

export default function TutorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const tutorName = user?.user?.name || user?.name || "Tutor";

  const [courses, setCourses]     = useState([]);
  const [students, setStudents]   = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const token = user?.token;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.allSettled([
      API.get("/courses/my",        { headers }),
      API.get("/tutors/me/students",{ headers }),
      API.get("/applications/me",   { headers }),
    ]).then(([coursesRes, studentsRes, appRes]) => {
      if (coursesRes.status  === "fulfilled") setCourses(coursesRes.value.data  || []);
      if (studentsRes.status === "fulfilled") setStudents(studentsRes.value.data || []);
      if (appRes.status      === "fulfilled") setApplication(appRes.value.data  || null);
    }).finally(() => setLoading(false));
  }, [user]);

  const totalChapters = courses.reduce((sum, c) => sum + (c.chapters?.length ?? 0), 0);
  const totalStudentsInCourses = courses.reduce((sum, c) => sum + (c.students?.length ?? 0), 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const appStatus = application?.status;
  const appMeta   = STATUS_META[appStatus] || null;

  const quickLinks = [
    { label: "My Courses",       icon: <FaBook />,               path: "/tutor/courses",      color: "bg-purple-500" },
    { label: "Assigned Students",icon: <FaUsers />,              path: "/tutor/students",     color: "bg-teal-500" },
    { label: "My Application",   icon: <FaFileAlt />,            path: "/tutor/applications", color: "bg-indigo-500" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-purple-200 text-sm font-medium mb-1">{greeting} 👋</p>
          <h2 className="text-2xl font-extrabold mb-1">{tutorName}</h2>
          <p className="text-purple-100 text-sm">
            {loading
              ? "Loading your dashboard…"
              : courses.length > 0
              ? `You have ${courses.length} course${courses.length !== 1 ? "s" : ""} with ${totalChapters} chapter${totalChapters !== 1 ? "s" : ""} published.`
              : "Welcome! Start by creating your first course."}
          </p>

          {/* Application status badge */}
          {!loading && appMeta && (
            <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold ${appMeta.classes}`}>
              {appMeta.icon} Application: {appMeta.label}
            </span>
          )}
        </div>
        <div className="absolute bottom-4 right-6 text-6xl opacity-10">
          <FaChalkboardTeacher />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<FaBook />}
          label="Courses"
          value={loading ? "—" : courses.length}
          sub="published"
          color="text-purple-600"
          bg="bg-purple-100"
          onClick={() => navigate("/tutor/courses")}
        />
        <StatCard
          icon={<FaLayerGroup />}
          label="Chapters"
          value={loading ? "—" : totalChapters}
          sub="total"
          color="text-indigo-600"
          bg="bg-indigo-100"
          onClick={courses.length > 0 ? () => navigate("/tutor/courses") : null}
        />
        <StatCard
          icon={<FaUserGraduate />}
          label="Enrolled"
          value={loading ? "—" : totalStudentsInCourses}
          sub="in your courses"
          color="text-teal-600"
          bg="bg-teal-100"
          onClick={() => navigate("/tutor/students")}
        />
        <StatCard
          icon={<FaUsers />}
          label="Assigned"
          value={loading ? "—" : students.length}
          sub="students"
          color="text-amber-600"
          bg="bg-amber-100"
          onClick={() => navigate("/tutor/students")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My courses list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FaBook className="text-purple-500" /> My Courses
            </h3>
            <button
              onClick={() => navigate("/tutor/courses")}
              className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
            >
              View all <FaArrowRight className="text-xs" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((n) => (
                <div key={n} className="flex gap-3 items-center animate-pulse">
                  <div className="w-9 h-9 rounded-lg bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-1.5" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <FaBook className="text-3xl text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No courses yet</p>
              <button
                onClick={() => navigate("/tutor/courses")}
                className="mt-3 inline-flex items-center gap-1.5 text-xs bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                <FaPlusCircle /> Create first course
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {courses.slice(0, 5).map((c, i) => (
                <CourseRow key={c._id} course={c} index={i} />
              ))}
              {courses.length > 5 && (
                <p className="text-xs text-center text-gray-400 pt-2">
                  +{courses.length - 5} more —{" "}
                  <button onClick={() => navigate("/tutor/courses")} className="text-purple-600 underline">
                    view all
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group text-left"
                >
                  <div className={`w-9 h-9 rounded-xl ${link.color} text-white flex items-center justify-center text-sm flex-shrink-0`}>
                    {link.icon}
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">{link.label}</span>
                  <FaArrowRight className="ml-auto text-gray-300 group-hover:text-gray-500 text-xs transition" />
                </button>
              ))}
            </div>
          </div>

          {/* Assigned students */}
          {!loading && students.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaUsers className="text-teal-500" /> Assigned Students
                </h3>
                <button
                  onClick={() => navigate("/tutor/students")}
                  className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
                >
                  View all <FaArrowRight className="text-xs" />
                </button>
              </div>
              <div className="space-y-1">
                {students.slice(0, 4).map((s, i) => (
                  <StudentRow key={s._id || i} student={s} index={i} />
                ))}
                {students.length > 4 && (
                  <p className="text-xs text-center text-gray-400 pt-1">
                    +{students.length - 4} more —{" "}
                    <button onClick={() => navigate("/tutor/students")} className="text-teal-600 underline">
                      view all
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Application status card */}
          {!loading && (
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/tutor/applications")}
            >
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaFileAlt className="text-indigo-500" /> Application Status
              </h3>
              {application ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Submitted {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : ""}
                    </p>
                    {application.letter && (
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{application.letter}</p>
                    )}
                  </div>
                  {appMeta && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${appMeta.classes}`}>
                      {appMeta.icon} {appMeta.label}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">No application submitted yet.</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate("/tutor/applications"); }}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
