import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { FaCheckCircle, FaHourglassHalf, FaMoneyBillWave } from "react-icons/fa";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    API.get("/payments")
      .then(res => setPayments(res.data))
      .catch(() => setError("Failed to fetch payments"))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.patch(`/payments/${id}/approve`);
      setPayments(payments.map(p => p._id === id ? { ...p, status: "approved" } : p));
    } catch {
      alert("Failed to approve payment");
    }
  };

  // Only show pending payments
  const pendingPayments = payments.filter(p => p.status === "pending");

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-teal-700">
        <FaMoneyBillWave className="text-4xl" /> Payments Management
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-40 text-teal-600 font-semibold text-lg">
          <FaHourglassHalf className="animate-spin text-2xl mr-2" /> Loading payments...
        </div>
      ) : error ? (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      ) : pendingPayments.length === 0 ? (
        <p className="text-gray-500 text-center">No pending payments</p>
      ) : (
        <div className="space-y-4">
          {pendingPayments.map(p => (
            <div key={p._id} className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-l-4 border-amber-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-4">
                <FaHourglassHalf className="text-3xl text-amber-500" title="Pending" />
                <div>
                  <div className="font-bold text-lg text-gray-800">{p.bookingId?.studentId?.name || "Unknown Student"}</div>
                  <div className="text-gray-500 text-sm">Amount: <span className="font-semibold text-green-600">${p.amount}</span></div>
                  <div className="text-xs mt-1 text-gray-400">Payment ID: {p._id}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
                  <FaHourglassHalf /> Pending
                </span>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center gap-2"
                  onClick={() => handleApprove(p._id)}
                >
                  <FaCheckCircle /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
