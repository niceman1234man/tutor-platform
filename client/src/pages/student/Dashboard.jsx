import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import API from "../../api/api";
import {
  FaBook,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaMoneyBillWave,
  FaArrowRight,
  FaGraduationCap,
  FaChartLine,
  FaLayerGroup,
} from "react-icons/fa";

function StatCard({ icon, label, value, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left w-full hover:shadow-md transition-all duration-200 ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${color.replace("text-", "bg-")}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color.replace("text-", "bg-").replace("-600", "-100").replace("-500", "-100")} ${color}`}>
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
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
      onClick={() => navigate(`/student/courses`)}
    >
      <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-600 font-bold text-sm">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{course.title}</p>
        {course.category && (
          <p className="text-xs text-gray-400 mt-0.5">{course.category}</p>
        )}
      </div>
      <FaArrowRight className="text-gray-300 group-hover:text-teal-500 transition text-xs flex-shrink-0" />
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentName = user?.user?.name || user?.name || "Student";

  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = user?.token;
    if (!token) return;

    Promise.allSettled([
      API.get("/courses/registered", { headers: { Authorization: `Bearer ${token}` } }),
      API.get("/payments"),
    ]).then(([coursesRes, paymentsRes]) => {
      if (coursesRes.status === "fulfilled") setCourses(coursesRes.value.data || []);
      if (paymentsRes.status === "fulfilled") {
        const studentId = user?.user?._id || user?._id;
        const myPayments = (paymentsRes.value.data || []).filter(
          (p) => p.studentId?._id === studentId || p.studentId === studentId
        );
        setPayments(myPayments);
      }
    }).finally(() => setLoading(false));
  }, [user]);

  const pending  = payments.filter((p) => p.status === "pending").length;
  const approved = payments.filter((p) => p.status === "approved").length;
  const rejected = payments.filter((p) => p.status === "rejected").length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickLinks = [
    { label: "Browse Courses",  icon: <FaLayerGroup />,    path: "/tutors",          color: "bg-teal-500" },
    { label: "My Courses",      icon: <FaBook />,           path: "/student/courses", color: "bg-indigo-500" },
    { label: "Payments",        icon: <FaMoneyBillWave />,  path: "/student/payments",color: "bg-green-500" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-teal-200 text-sm font-medium mb-1">{greeting} 👋</p>
          <h2 className="text-2xl font-extrabold mb-1">{studentName}</h2>
          <p className="text-teal-100 text-sm">
            {loading
              ? "Loading your progress…"
              : courses.length > 0
              ? `You are enrolled in ${courses.length} course${courses.length !== 1 ? "s" : ""}. Keep it up!`
              : "You haven't enrolled in any courses yet. Browse and start learning!"}
          </p>
        </div>
        <div className="absolute bottom-4 right-6 text-6xl opacity-10">
          <FaGraduationCap />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<FaBook />}
          label="Enrolled"
          value={loading ? "—" : courses.length}
          sub="courses"
          color="text-teal-600"
          onClick={() => navigate("/student/courses")}
        />
        <StatCard
          icon={<FaHourglassHalf />}
          label="Pending"
          value={loading ? "—" : pending}
          sub="payments"
          color="text-amber-500"
          onClick={() => navigate("/student/payments")}
        />
        <StatCard
          icon={<FaCheckCircle />}
          label="Approved"
          value={loading ? "—" : approved}
          sub="payments"
          color="text-green-600"
          onClick={() => navigate("/student/payments")}
        />
        <StatCard
          icon={<FaTimesCircle />}
          label="Rejected"
          value={loading ? "—" : rejected}
          sub="payments"
          color="text-red-500"
          onClick={() => navigate("/student/payments")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enrolled courses list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FaChartLine className="text-teal-500" /> My Courses
            </h3>
            <button
              onClick={() => navigate("/student/courses")}
              className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
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
                onClick={() => navigate("/tutors")}
                className="mt-3 text-xs text-teal-600 hover:text-teal-800 font-semibold underline"
              >
                Browse courses →
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {courses.slice(0, 5).map((c, i) => (
                <CourseRow key={c._id} course={c} index={i} />
              ))}
              {courses.length > 5 && (
                <p className="text-xs text-center text-gray-400 pt-2">
                  +{courses.length - 5} more — <button onClick={() => navigate("/student/courses")} className="text-teal-600 underline">view all</button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Quick links + recent payments */}
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

          {/* Recent payments */}
          {!loading && payments.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" /> Recent Payments
                </h3>
                <button onClick={() => navigate("/student/payments")} className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1">
                  View all <FaArrowRight className="text-xs" />
                </button>
              </div>
              <div className="space-y-2">
                {payments.slice(0, 3).map((p) => {
                  const statusColor =
                    p.status === "approved" ? "text-green-600 bg-green-50" :
                    p.status === "rejected" ? "text-red-500 bg-red-50" :
                    "text-amber-600 bg-amber-50";
                  return (
                    <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{p.amount} ETB</p>
                        <p className="text-xs text-gray-400">{p.method || "—"}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColor}`}>
                        {p.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
