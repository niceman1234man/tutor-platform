import React, { useEffect, useState } from "react";
import API from "../../api/api";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaSearch,
  FaDownload,
  FaChartBar,
  FaUser,
} from "react-icons/fa";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

const STATUS_META = {
  pending:  { label: "Pending",  icon: <FaHourglassHalf />, classes: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", icon: <FaCheckCircle />,   classes: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", icon: <FaTimesCircle />,   classes: "bg-red-100 text-red-700" },
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get("/payments")
      .then((res) => setPayments(res.data))
      .catch(() => setError("Failed to fetch payments"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await API.patch(`/payments/${id}`, { status: newStatus });
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch {
      alert("Failed to update payment status.");
    } finally {
      setUpdating(null);
    }
  };

  const downloadCSV = () => {
    const headers = ["Student Name", "Email", "Amount", "Method", "Status", "Date"];
    const rows = displayed.map((p) => [
      `"${p.studentId?.name || "Unknown"}"`,
      `"${p.studentId?.email || ""}"`,
      `"${p.amount || 0}"`,
      `"${p.method || ""}"`,
      `"${p.status || ""}"`,
      `"${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Report stats
  const total = payments.length;
  const pending  = payments.filter((p) => p.status === "pending").length;
  const approved = payments.filter((p) => p.status === "approved").length;
  const rejected = payments.filter((p) => p.status === "rejected").length;
  const totalRevenue = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Filter + search
  const displayed = payments.filter((p) => {
    const matchStatus = filter === "All" || p.status === filter.toLowerCase();
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      (p.studentId?.name || "").toLowerCase().includes(q) ||
      (p.studentId?.email || "").toLowerCase().includes(q) ||
      (p.method || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const reportCards = [
    { label: "Total",    value: total,    color: "from-teal-500 to-teal-700",     icon: <FaMoneyBillWave /> },
    { label: "Pending",  value: pending,  color: "from-amber-400 to-amber-600",   icon: <FaHourglassHalf /> },
    { label: "Approved", value: approved, color: "from-green-500 to-green-700",   icon: <FaCheckCircle /> },
    { label: "Rejected", value: rejected, color: "from-red-400 to-red-600",       icon: <FaTimesCircle /> },
    { label: "Revenue",  value: `$${totalRevenue.toLocaleString()}`, color: "from-indigo-500 to-indigo-700", icon: <FaChartBar /> },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-teal-700">
        <FaMoneyBillWave className="text-4xl" /> Payments Management
      </h2>

      {/* Report Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-600 flex items-center gap-2 mb-3">
          <FaChartBar className="text-teal-500" /> Payment Report
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {reportCards.map((card) => (
            <button
              key={card.label}
              onClick={() => {
                if (["Pending","Approved","Rejected"].includes(card.label)) setFilter(card.label);
                else setFilter("All");
              }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white text-center shadow-lg hover:scale-105 transition-transform duration-200`}
            >
              <div className="text-2xl mb-1 flex justify-center">{card.icon}</div>
              <div className="text-2xl font-extrabold">{card.value}</div>
              <div className="text-xs mt-1 font-medium opacity-90">{card.label}</div>
            </button>
          ))}
        </div>

        {/* Status distribution bar */}
        {total > 0 && (
          <div className="mt-4 bg-white rounded-xl shadow px-5 py-4">
            <p className="text-sm font-semibold text-gray-500 mb-2">Status Distribution</p>
            <div className="flex h-4 rounded-full overflow-hidden w-full">
              {approved > 0 && <div className="bg-green-500" style={{ width: `${(approved/total)*100}%` }} title={`Approved: ${approved}`} />}
              {pending  > 0 && <div className="bg-amber-400" style={{ width: `${(pending/total)*100}%`  }} title={`Pending: ${pending}`} />}
              {rejected > 0 && <div className="bg-red-400"   style={{ width: `${(rejected/total)*100}%` }} title={`Rejected: ${rejected}`} />}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Approved {approved}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Pending {pending}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400   inline-block" /> Rejected {rejected}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter + Search bar */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                filter === f
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-teal-400 hover:text-teal-700"
              }`}
            >
              {f}
              <span className="ml-1 text-xs opacity-75">
                ({f === "All" ? total : payments.filter((p) => p.status === f.toLowerCase()).length})
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm ml-auto">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or method…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm w-52"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-red-400 text-xs">✕</button>
          )}
        </div>

        <button
          onClick={downloadCSV}
          disabled={displayed.length === 0}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg font-semibold shadow text-sm transition"
        >
          <FaDownload /> Download CSV
        </button>
      </div>

      {displayed.length > 0 && (
        <p className="text-sm text-gray-400 mb-3">Showing {displayed.length} of {total} payments</p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40 text-teal-600 font-semibold text-lg">
          <FaHourglassHalf className="animate-spin text-2xl mr-2" /> Loading payments...
        </div>
      ) : error ? (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      ) : displayed.length === 0 ? (
        <p className="text-gray-500 text-center">No payments found.</p>
      ) : (
        <div className="space-y-4">
          {displayed.map((p) => {
            const meta = STATUS_META[p.status] || STATUS_META.pending;
            const studentName  = p.studentId?.name  || "Unknown Student";
            const studentEmail = p.studentId?.email || "";
            return (
              <div
                key={p._id}
                className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-l-4 border-teal-400 hover:shadow-lg transition-all duration-200"
              >
                {/* Info */}
                <div className="flex items-start gap-4">
                  <div className={`text-2xl mt-1 ${meta.classes.split(" ")[1]}`}>
                    {meta.icon}
                  </div>
                  <div>
                    {/* Student name */}
                    <div className="flex items-center gap-2 mb-1">
                      <FaUser className="text-teal-500 text-sm" />
                      <span className="font-bold text-gray-800">{studentName}</span>
                      {studentEmail && (
                        <span className="text-xs text-gray-400">({studentEmail})</span>
                      )}
                    </div>
                    <div className="text-gray-500 text-sm">
                      Amount: <span className="font-semibold text-green-600">${p.amount}</span>
                      {p.method && (
                        <span className="ml-3">Method: <span className="font-medium text-gray-700">{p.method}</span></span>
                      )}
                      {p.createdAt && (
                        <span className="ml-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {p.courseId?.title && (
                      <div className="text-xs text-indigo-500 mt-0.5">Course: {p.courseId.title}</div>
                    )}
                    <div className="text-xs mt-1 text-gray-300">ID: {p._id}</div>
                    {p.receiptImage && (
                      <a href={p.receiptImage} target="_blank" rel="noopener noreferrer">
                        <img
                          src={p.receiptImage}
                          alt="Receipt"
                          className="w-24 h-16 object-cover rounded mt-2 border hover:opacity-80 transition"
                        />
                      </a>
                    )}
                  </div>
                </div>

                {/* Status badge + actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm ${meta.classes}`}>
                    {meta.icon} {meta.label}
                  </span>

                  {p.status !== "approved" && (
                    <button
                      disabled={updating === p._id}
                      onClick={() => handleStatusChange(p._id, "approved")}
                      className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg font-semibold text-sm shadow transition flex items-center gap-1"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                  )}
                  {p.status !== "rejected" && (
                    <button
                      disabled={updating === p._id}
                      onClick={() => handleStatusChange(p._id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg font-semibold text-sm shadow transition flex items-center gap-1"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  )}
                  {p.status !== "pending" && (
                    <button
                      disabled={updating === p._id}
                      onClick={() => handleStatusChange(p._id, "pending")}
                      className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg font-semibold text-sm shadow transition flex items-center gap-1"
                    >
                      <FaHourglassHalf /> Set Pending
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
