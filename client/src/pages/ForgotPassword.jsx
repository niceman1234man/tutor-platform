import React, { useState } from "react";
import API from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setMessage("If an account exists, a password reset link has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="w-full">
          {message && (
            <div className="bg-green-100 text-green-700 p-2 mb-3 rounded text-center">{message}</div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-3 rounded text-center">{error}</div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white w-full p-2 rounded font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
