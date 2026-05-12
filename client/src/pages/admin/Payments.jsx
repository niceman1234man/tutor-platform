import React, { useEffect, useState } from "react";
import API from "../../api/api";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaMoneyBillWave,
} from "react-icons/fa";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

const STATUS_META = {
  pending:  { label: "Pending",  icon: <FaHourglassHalf />, classes: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", icon: <FaCheckCircle />,   classes: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", icon: <FaTimesCircle />,   classes: "bg-red-100 text-red-700"   },
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
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

  const filtered =
    filter === "All"
      ? payments
      : payments.filter((p) => p.status === filter.toLowerCase());

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-teal-700">
        <FaMoneyBillWave className="text-4xl" /> Payments Management
      </h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
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
              ({f === "All"
                ? payments.length
                : payments.filter((p) => p.status === f.toLowerCase()).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-teal-600 font-semibold text-lg">
          <FaHourglassHalf className="animate-spin text-2xl mr-2" /> Loading payments...
        </div>
      ) : error ? (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-center">No {filter !== "All" ? filter.toLowerCase() : ""} payments found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => {
            const meta = STATUS_META[p.status] || STATUS_META.pending;
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
                    <div className="font-bold text-lg text-gray-800">
                      {p.bookingId?.studentId?.name || p.studentId?.name || "Student"}
                    </div>
                    <div className="text-gray-500 text-sm">
                      Amount: <span className="font-semibold text-green-600">${p.amount}</span>
                      {p.method && (
                        <span className="ml-3">Method: <span className="font-medium text-gray-700">{p.method}</span></span>
                      )}
                    </div>
                    <div className="text-xs mt-1 text-gray-400">ID: {p._id}</div>
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
