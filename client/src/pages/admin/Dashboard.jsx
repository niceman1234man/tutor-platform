import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import API from "../../api/api";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaMoneyBillWave,
  FaUsers,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaFileAlt,
  FaChartBar,
  FaUserTie,
} from "react-icons/fa";

function StatCard({ icon, label, value, sub, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left w-full transition-all duration-200 hover:shadow-md ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${bg} ${color}`}>
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

function MiniBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="font-semibold">{value} <span className="text-gray-300">({pct}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RecentPaymentRow({ p }) {
  const meta =
    p.status === "approved" ? { cls: "bg-green-100 text-green-700", icon: <FaCheckCircle /> } :
    p.status === "rejected" ? { cls: "bg-red-100 text-red-600",   icon: <FaTimesCircle /> } :
                               { cls: "bg-amber-100 text-amber-700", icon: <FaHourglassHalf /> };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800 leading-tight">
          {p.studentId?.name || p.studentName || "Unknown"}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {p.courseId?.title || "—"} · {p.amount} ETB
        </p>
      </div>
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${meta.cls}`}>
        {meta.icon} {p.status}
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const adminName = user?.user?.name || user?.name || "Admin";

  const [users, setUsers]       = useState([]);
  const [courses, setCourses]   = useState([]);
  const [payments, setPayments] = useState([]);
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const token = user?.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.allSettled([
      API.get("/admin/users",  { headers }),
      API.get("/courses"),
      API.get("/payments"),
      API.get("/applications", { headers }),
    ]).then(([usersRes, coursesRes, paymentsRes, appsRes]) => {
      if (usersRes.status    === "fulfilled") setUsers(usersRes.value.data     || []);
      if (coursesRes.status  === "fulfilled") setCourses(coursesRes.value.data  || []);
      if (paymentsRes.status === "fulfilled") setPayments(paymentsRes.value.data || []);
      if (appsRes.status     === "fulfilled") setApps(appsRes.value.data        || []);
    }).finally(() => setLoading(false));
  }, [user]);

  // Derived counts
  const students       = users.filter((u) => u.role === "student").length;
  const tutors         = users.filter((u) => u.role === "tutor").length;
  const admins         = users.filter((u) => u.role === "admin").length;
  const activeUsers    = users.filter((u) => u.active).length;
  const inactiveUsers  = users.filter((u) => !u.active).length;

  const pendingPay     = payments.filter((p) => p.status === "pending").length;
  const approvedPay    = payments.filter((p) => p.status === "approved").length;
  const rejectedPay    = payments.filter((p) => p.status === "rejected").length;
  const revenue        = payments
    .filter((p) => p.status === "approved")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const pendingApps    = apps.filter((a) => a.status === "pending").length;

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickLinks = [
    { label: "Manage Users",    icon: <FaUsers />,          path: "/admin/users",        color: "bg-teal-500" },
    { label: "Manage Courses",  icon: <FaBookOpen />,       path: "/admin/courses",      color: "bg-indigo-500" },
    { label: "Payments",        icon: <FaMoneyBillWave />,  path: "/admin/payments",     color: "bg-green-500" },
    { label: "Applications",    icon: <FaFileAlt />,        path: "/admin/applications", color: "bg-amber-500" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-2 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-teal-200 text-sm font-medium mb-1">{greeting} 👋</p>
          <h2 className="text-2xl font-extrabold mb-1">{adminName}</h2>
          <p className="text-teal-100 text-sm">
            {loading
              ? "Loading platform overview…"
              : `Platform has ${users.length} users, ${courses.length} courses, and ${revenue.toLocaleString()} ETB in approved revenue.`}
          </p>
          {!loading && pendingPay > 0 && (
            <button
              onClick={() => navigate("/admin/payments")}
              className="inline-flex items-center gap-1.5 mt-3 bg-white/20 hover:bg-white/30 transition text-white text-xs font-bold px-3 py-1.5 rounded-full"
            >
              <FaHourglassHalf /> {pendingPay} payment{pendingPay !== 1 ? "s" : ""} pending review
              <FaArrowRight className="text-xs" />
            </button>
          )}
          {!loading && pendingApps > 0 && (
            <button
              onClick={() => navigate("/admin/applications")}
              className="inline-flex items-center gap-1.5 mt-2 ml-2 bg-white/20 hover:bg-white/30 transition text-white text-xs font-bold px-3 py-1.5 rounded-full"
            >
              <FaFileAlt /> {pendingApps} tutor application{pendingApps !== 1 ? "s" : ""} pending
              <FaArrowRight className="text-xs" />
            </button>
          )}
        </div>
        <div className="absolute bottom-4 right-6 text-6xl opacity-10">
          <FaUserShield />
        </div>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<FaUsers />}             label="Total Users"   value={loading ? "—" : users.length}   sub="registered"     color="text-teal-600"    bg="bg-teal-100"    onClick={() => navigate("/admin/users")} />
        <StatCard icon={<FaBookOpen />}           label="Courses"       value={loading ? "—" : courses.length} sub="available"       color="text-indigo-600"  bg="bg-indigo-100"  onClick={() => navigate("/admin/courses")} />
        <StatCard icon={<FaMoneyBillWave />}      label="Revenue"       value={loading ? "—" : `${revenue.toLocaleString()} ETB`} sub="from approved payments" color="text-green-600" bg="bg-green-100" onClick={() => navigate("/admin/payments")} />
        <StatCard icon={<FaHourglassHalf />}      label="Pending"       value={loading ? "—" : pendingPay}     sub="payments"        color="text-amber-600"   bg="bg-amber-100"   onClick={() => navigate("/admin/payments")} />
      </div>

      {/* Secondary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<FaUserGraduate />}       label="Students"      value={loading ? "—" : students}        color="text-sky-600"     bg="bg-sky-100"     onClick={() => navigate("/admin/users")} />
        <StatCard icon={<FaChalkboardTeacher />}  label="Tutors"        value={loading ? "—" : tutors}          color="text-purple-600"  bg="bg-purple-100"  onClick={() => navigate("/admin/users")} />
        <StatCard icon={<FaCheckCircle />}        label="Approved Pay." value={loading ? "—" : approvedPay}     color="text-green-600"   bg="bg-green-100"   onClick={() => navigate("/admin/payments")} />
        <StatCard icon={<FaTimesCircle />}        label="Rejected Pay." value={loading ? "—" : rejectedPay}     color="text-red-500"     bg="bg-red-100"     onClick={() => navigate("/admin/payments")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartBar className="text-teal-500" /> User Breakdown
          </h3>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3,4].map((n) => <div key={n} className="h-6 bg-gray-100 rounded-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              <MiniBar label="Students"  value={students}     total={users.length} color="bg-sky-400" />
              <MiniBar label="Tutors"    value={tutors}       total={users.length} color="bg-purple-400" />
              <MiniBar label="Admins"    value={admins}       total={users.length} color="bg-indigo-400" />
              <div className="pt-1 border-t border-gray-50 mt-3 space-y-3">
                <MiniBar label="Active"    value={activeUsers}  total={users.length} color="bg-green-400" />
                <MiniBar label="Inactive"  value={inactiveUsers}total={users.length} color="bg-red-300" />
              </div>
            </div>
          )}
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 w-full text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center justify-center gap-1"
          >
            Manage users <FaArrowRight className="text-xs" />
          </button>
        </div>

        {/* Payment breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-green-500" /> Payment Breakdown
          </h3>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map((n) => <div key={n} className="h-6 bg-gray-100 rounded-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              <MiniBar label="Approved" value={approvedPay} total={payments.length} color="bg-green-400" />
              <MiniBar label="Pending"  value={pendingPay}  total={payments.length} color="bg-amber-400" />
              <MiniBar label="Rejected" value={rejectedPay} total={payments.length} color="bg-red-400" />
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400 mb-0.5">Total Revenue</p>
                <p className="text-2xl font-extrabold text-green-600">{revenue.toLocaleString()} ETB</p>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate("/admin/payments")}
            className="mt-4 w-full text-xs text-green-600 hover:text-green-800 font-semibold flex items-center justify-center gap-1"
          >
            Manage payments <FaArrowRight className="text-xs" />
          </button>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
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
      </div>

      {/* Recent payments */}
      {!loading && recentPayments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" /> Recent Payments
            </h3>
            <button
              onClick={() => navigate("/admin/payments")}
              className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              View all <FaArrowRight className="text-xs" />
            </button>
          </div>
          <div>
            {recentPayments.map((p) => (
              <RecentPaymentRow key={p._id} p={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
