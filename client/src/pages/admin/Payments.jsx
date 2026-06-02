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
  FaTrash,
  FaReceipt,
} from "react-icons/fa";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

const STATUS_META = {
  pending:  { label: "Pending",  icon: <FaHourglassHalf />, classes: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "Approved", icon: <FaCheckCircle />,   classes: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "Rejected", icon: <FaTimesCircle />,   classes: "bg-red-100 text-red-700 border-red-200" },
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await API.delete(`/payments/${id}`);
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete payment.");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const downloadCSV = () => {
    const headers = ["Student Name", "Email", "Course", "Amount", "Method", "Status", "Date"];
    const rows = displayed.map((p) => [
      `"${p.studentId?.name || p.studentName || "Unknown"}"`,
      `"${p.studentId?.email || p.studentEmail || ""}"`,
      `"${p.courseId?.title || ""}"`,
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
    a.download = `payments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const total        = payments.length;
  const pendingCount  = payments.filter((p) => p.status === "pending").length;
  const approvedCount = payments.filter((p) => p.status === "approved").length;
  const rejectedCount = payments.filter((p) => p.status === "rejected").length;
  const totalRevenue  = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const displayed = payments.filter((p) => {
    const matchStatus = filter === "All" || p.status === filter.toLowerCase();
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (p.studentId?.name || p.studentName || "").toLowerCase().includes(q) ||
      (p.studentId?.email || p.studentEmail || "").toLowerCase().includes(q) ||
      (p.method || "").toLowerCase().includes(q) ||
      (p.courseId?.title || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const reportCards = [
    { label: "Total",    value: total,          color: "from-teal-500 to-teal-700",     icon: <FaMoneyBillWave />, filter: "All" },
    { label: "Pending",  value: pendingCount,   color: "from-amber-400 to-amber-600",   icon: <FaHourglassHalf />, filter: "Pending" },
    { label: "Approved", value: approvedCount,  color: "from-green-500 to-green-700",   icon: <FaCheckCircle />,   filter: "Approved" },
    { label: "Rejected", value: rejectedCount,  color: "from-red-400 to-red-600",       icon: <FaTimesCircle />,   filter: "Rejected" },
    { label: "Revenue",  value: `${totalRevenue.toLocaleString()} ETB`, color: "from-indigo-500 to-indigo-700", icon: <FaChartBar />, filter: null },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-teal-700">
        <FaMoneyBillWave /> Payments Management
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {reportCards.map((card) => (
          <button
            key={card.label}
            onClick={() => card.filter !== null && setFilter(card.filter)}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white text-center shadow hover:scale-105 transition-transform ${card.filter === null ? "cursor-default" : "cursor-pointer"}`}
          >
            <div className="text-xl mb-1 flex justify-center">{card.icon}</div>
            <div className="text-2xl font-extrabold">{card.value}</div>
            <div className="text-xs mt-1 opacity-90">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Distribution bar */}
      {total > 0 && (
        <div className="bg-white rounded-xl shadow px-5 py-3 mb-6 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Status Distribution</p>
          <div className="flex h-3 rounded-full overflow-hidden w-full">
            {approvedCount > 0 && <div className="bg-green-500 transition-all" style={{ width: `${(approvedCount / total) * 100}%` }} />}
            {pendingCount  > 0 && <div className="bg-amber-400 transition-all" style={{ width: `${(pendingCount  / total) * 100}%` }} />}
            {rejectedCount > 0 && <div className="bg-red-400   transition-all" style={{ width: `${(rejectedCount / total) * 100}%` }} />}
          </div>
          <div className="flex gap-5 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Approved ({approvedCount})</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Pending ({pendingCount})</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400   inline-block" /> Rejected ({rejectedCount})</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                filter === f
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-700"
              }`}
            >
              {f} <span className="opacity-60 text-xs">({f === "All" ? total : payments.filter((p) => p.status === f.toLowerCase()).length})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm ml-auto">
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search name, email, course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm w-48"
          />
          {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-red-400 text-xs">✕</button>}
        </div>

        <button
          onClick={downloadCSV}
          disabled={displayed.length === 0}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl font-semibold text-sm transition"
        >
          <FaDownload /> CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow animate-pulse">
          {[1,2,3,4,5].map((n) => (
            <div key={n} className="flex gap-4 px-5 py-4 border-b border-gray-50">
              <div className="h-4 bg-gray-200 rounded w-1/5" />
              <div className="h-4 bg-gray-200 rounded w-1/5" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
              <div className="h-6 bg-gray-200 rounded-full w-20 ml-auto" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaMoneyBillWave className="text-4xl mx-auto mb-3 text-gray-200" />
          <p>No payments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="px-5 py-2.5 border-b border-gray-100 text-xs text-gray-400">
            Showing {displayed.length} of {total} payments
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Student</th>
                  <th className="px-4 py-3 text-left font-semibold">Course</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Method</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Receipt</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((p, idx) => {
                  const meta = STATUS_META[p.status] || STATUS_META.pending;
                  const studentName  = p.studentId?.name  || p.studentName  || "—";
                  const studentEmail = p.studentId?.email || p.studentEmail || "";
                  const isUpdating   = updating === p._id;
                  const isDeleting   = deleting === p._id;

                  return (
                    <tr key={p._id} className="hover:bg-gray-50 transition">
                      {/* # */}
                      <td className="px-4 py-3 text-gray-400 font-medium">{idx + 1}</td>

                      {/* Student */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 leading-tight">{studentName}</p>
                        {studentEmail && <p className="text-xs text-gray-400 mt-0.5">{studentEmail}</p>}
                      </td>

                      {/* Course */}
                      <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                        {p.courseId?.title || <span className="text-gray-300">—</span>}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-bold text-green-600 whitespace-nowrap">
                        {p.amount ?? 0} ETB
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3 text-gray-600">
                        {p.method || <span className="text-gray-300">—</span>}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                      </td>

                      {/* Receipt */}
                      <td className="px-4 py-3">
                        {p.receiptImage ? (
                          <a href={p.receiptImage} target="_blank" rel="noopener noreferrer">
                            <img
                              src={p.receiptImage}
                              alt="Receipt"
                              className="w-10 h-10 object-cover rounded-lg border hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          <span className="text-gray-300"><FaReceipt /></span>
                        )}
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.classes}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {p.status !== "approved" && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(p._id, "approved")}
                              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                            >
                              <FaCheckCircle /> Approve
                            </button>
                          )}
                          {p.status !== "rejected" && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(p._id, "rejected")}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                            >
                              <FaTimesCircle /> Reject
                            </button>
                          )}
                          {p.status !== "pending" && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(p._id, "pending")}
                              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                            >
                              <FaHourglassHalf /> Pending
                            </button>
                          )}
                          <button
                            disabled={isDeleting}
                            onClick={() => setConfirmDelete(p._id)}
                            className="flex items-center gap-1 bg-gray-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 text-gray-500 px-2.5 py-1 rounded-lg text-xs font-semibold transition border border-gray-200 hover:border-red-200"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Payment?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The payment record will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deleting === confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-60"
                >
                  {deleting === confirmDelete ? "Deleting…" : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
