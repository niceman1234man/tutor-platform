import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../api/api";

const PAYMENT_METHODS = ["Telebirr", "Bank Transfer"];

export default function TutorCard({ tutor }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(false);
  const [priorStatus, setPriorStatus] = useState(null);
  const [method, setMethod] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleStart = async (e) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    setChecking(true);
    try {
      const [registeredRes, paymentsRes] = await Promise.all([
        API.get("/courses/registered", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        API.get("/payments", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      const isEnrolled = registeredRes.data.some((c) => c._id === tutor._id);
      if (isEnrolled) {
        navigate("/student/courses");
        return;
      }

      const studentId = user._id || user.id;
      const coursePayments = paymentsRes.data.filter(
        (p) =>
          p.courseId === tutor._id &&
          (p.studentId === studentId ||
            p.studentId?._id === studentId ||
            p.studentId === user.email ||
            p.studentEmail === user.email)
      );

      const latest = coursePayments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      setPriorStatus(latest?.status ?? null);
      setShowModal(true);
    } catch {
      setPriorStatus(null);
      setShowModal(true);
    } finally {
      setChecking(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!method) {
      setError("Please select a payment method.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("courseId", tutor._id);
      formData.append("amount", tutor.price || 0);
      formData.append("method", method);
      formData.append("studentId", user._id || user.id);
      formData.append("studentName", user.name || "");
      formData.append("studentEmail", user.email || "");
      if (receipt) formData.append("receiptImage", receipt);

      await API.post("/payments", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
    } catch {
      setError("Failed to submit enrollment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMethod("");
    setReceipt(null);
    setError("");
    setSuccess(false);
    setPriorStatus(null);
  };

  const modalHeader = (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-bold text-gray-800">Enroll in Course</h3>
        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{tutor.title}</p>
      </div>
      <button
        onClick={closeModal}
        className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
      >
        &times;
      </button>
    </div>
  );

  const renderModalContent = () => {
    if (success) {
      return (
        <div className="text-center py-6">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Enrollment Submitted!</h3>
          <p className="text-gray-500 text-sm mb-6">
            Your enrollment request is pending admin approval. You'll be notified once it's approved.
          </p>
          <button
            onClick={closeModal}
            className="bg-teal-600 text-white px-8 py-2.5 rounded-xl hover:bg-teal-700 transition"
          >
            Done
          </button>
        </div>
      );
    }

    if (priorStatus === "pending") {
      return (
        <>
          {modalHeader}
          <div className="text-center py-6">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Request Under Review</h3>
            <p className="text-gray-500 text-sm mb-2">
              You've already submitted an enrollment request for this course.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              An admin will review your payment and notify you once it's approved.
            </p>
            <button
              onClick={() => navigate("/student/payments")}
              className="bg-teal-600 text-white px-8 py-2.5 rounded-xl hover:bg-teal-700 transition"
            >
              View My Payments
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        {modalHeader}

        {priorStatus === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex gap-2 items-start">
            <span className="text-red-500 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-700">Previous request was rejected</p>
              <p className="text-xs text-red-500 mt-0.5">
                You can re-submit with updated payment details.
              </p>
            </div>
          </div>
        )}

        <div className="bg-teal-50 rounded-xl p-3 mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-teal-700">Course Fee</span>
          <span className="font-bold text-teal-800">{tutor.price || 0} ETB</span>
        </div>

        <form onSubmit={handleEnroll} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-800"
            >
              <option value="">-- Select method --</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Receipt / Proof of Payment{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <label className="flex items-center gap-2 border border-dashed border-teal-300 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-teal-50 transition">
              <span className="text-teal-500 text-base">📎</span>
              <span className="text-sm text-gray-500 truncate">
                {receipt ? receipt.name : "Upload payment receipt"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceipt(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl hover:bg-teal-700 transition disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : priorStatus === "rejected"
                ? "Re-submit Enrollment"
                : "Submit Enrollment"}
            </button>
          </div>
        </form>
      </>
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
        <div className="h-40 w-full overflow-hidden">
          <img
            src={tutor.imageUrl || "/default.jpg"}
            alt="Tutor Image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{tutor.title}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{tutor.description}</p>

          <div className="mb-2">
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${tutor.type === "pro" ? "bg-yellow-200 text-yellow-800" : "bg-green-100 text-green-700"}`}>
              {tutor.type === "pro" ? "Pro" : "Free"} Course
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div>
              <span className="text-yellow-500 font-semibold">⭐ {tutor.rating || 4.5}</span>
              <span className="text-gray-500 text-sm"> ({tutor.reviewsCount || 120} ratings)</span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">{tutor.price} ETB</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={checking}
            className="mt-auto bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-60"
          >
            {checking ? "Checking..." : "Start"}
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
}
