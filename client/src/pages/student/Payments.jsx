import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUpload,
  FaPaperPlane,
} from "react-icons/fa";

const PAYMENT_METHODS = [
  "Telebirr",
  "Bank Transfer",
  "Credit Card",
  "PayPal",
  "Cash",
];
const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ amount: "", method: "", receipt: null });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await API.get("/payments", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPayments(res.data);
    } catch {
      setPayments([]);
    }
  };

  useEffect(() => {
    if (user && user.token) fetchPayments();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "receipt" && files[0]) {
      setForm((prev) => ({ ...prev, receipt: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!form.method) {
      setError("Please select a payment method.");
      return;
    }

    setSubmitting(true);
    try {
      await API.post(
        "/payments",
        {
          amount: Number(form.amount),
          method: form.method,
          studentId:    user._id   || user.id,
          studentName:  user.name  || "",
          studentEmail: user.email || "",
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setSuccess("Payment submitted successfully!");
      setForm({ amount: "", method: "", receipt: null });
      setPreview(null);
      fetchPayments();
    } catch {
      setError("Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered =
    filter === "All"
      ? payments
      : payments.filter((p) => p.status === filter.toLowerCase());

  const statusBadge = (status) => {
    if (status === "approved")
      return (
        <span className="text-green-600 flex items-center gap-1">
          <FaCheckCircle /> Approved
        </span>
      );
    if (status === "pending")
      return (
        <span className="text-yellow-600 flex items-center gap-1">
          <FaHourglassHalf /> Pending
        </span>
      );
    return (
      <span className="text-red-600 flex items-center gap-1">
        <FaTimesCircle /> Rejected
      </span>
    );
  };

  return (
    <section id="payments" className="mb-10 space-y-8">
      {/* Submit Payment Form */}
      <div className="bg-white/95 rounded-2xl shadow-md border border-green-100 p-6">
        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 text-green-700">
          <FaMoneyBillWave /> Submit a Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Amount (Birr)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              placeholder="e.g. 50.00"
              className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Payment Method
            </label>
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
            >
              <option value="">-- Select a method --</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Receipt / Proof of Payment{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <label className="flex items-center gap-3 border border-dashed border-green-300 rounded-xl px-4 py-3 cursor-pointer hover:bg-green-50 transition">
              <FaUpload className="text-green-500" />
              <span className="text-gray-500 text-sm">
                {form.receipt ? form.receipt.name : "Click to upload image"}
              </span>
              <input
                type="file"
                name="receipt"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Receipt preview"
                className="w-36 h-24 object-cover rounded-xl border border-green-200 mt-1"
              />
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition"
          >
            <FaPaperPlane />
            {submitting ? "Submitting..." : "Submit Payment"}
          </button>
        </form>
      </div>

      {/* Payment History */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-green-700">
            <FaMoneyBillWave /> Payment History
          </h2>
          {/* Status Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  filter === f
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-700"
                }`}
              >
                {f}
                <span className="ml-1 text-xs opacity-75">
                  (
                  {f === "All"
                    ? payments.length
                    : payments.filter((p) => p.status === f.toLowerCase())
                        .length}
                  )
                </span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500">
            No {filter !== "All" ? filter.toLowerCase() : ""} payment records
            found.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-white/90 p-5 rounded-2xl shadow border border-green-100 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">Amount:</span>
                  <span className="text-green-700 font-semibold">
                    ${p.amount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">Method:</span>
                  <span className="text-gray-700">{p.method}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">Status:</span>
                  {statusBadge(p.status)}
                </div>
                {p.receiptImage && (
                  <img
                    src={p.receiptImage}
                    alt="Receipt"
                    className="w-32 h-20 object-cover rounded mt-2 border"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
