import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../api/api";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token") || "";
  const isResetMode = Boolean(resetToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (isResetMode && password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (isResetMode) {
        const response = await API.post("/auth/reset-password", {
          token: resetToken,
          password,
        });
        setMessage(response.data.message || "Your password has been reset.");
      } else {
        const response = await API.post("/auth/forgot-password", { email });
        setMessage(
          response.data.message ||
            "If an account with that email exists, a password reset link will be sent."
        );
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (isResetMode
            ? "Unable to reset your password. The link may have expired."
            : "Unable to send a reset link right now.")
      );
    } finally {
      setLoading(false);
    }
  };

  const completed = isResetMode && Boolean(message);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4 py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-2 text-blue-700 text-center">
          {isResetMode ? "Reset Password" : "Forgot Password"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {isResetMode
            ? "Choose a new password for your account."
            : "Enter your account email and we’ll send you a secure reset link."}
        </p>

        {message && (
          <div
            role="status"
            className="bg-green-100 text-green-800 p-3 mb-4 rounded-lg text-sm text-center"
          >
            {message}
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-sm text-center"
          >
            {error}
          </div>
        )}

        {!completed && (
          <form onSubmit={handleSubmit} className="w-full">
            {!isResetMode ? (
              <div className="mb-5">
                <label className="block text-gray-700 mb-1" htmlFor="reset-email">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your account email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1" htmlFor="new-password">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="At least 8 characters"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-1" htmlFor="confirm-password">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter the new password again"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white w-full p-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading
                ? isResetMode
                  ? "Resetting…"
                  : "Sending…"
                : isResetMode
                  ? "Reset Password"
                  : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-5 flex flex-col items-center gap-2 text-sm">
          <Link to="/login" className="text-teal-700 hover:underline">
            Back to Login
          </Link>
          {!isResetMode && (
            <Link to="/change-password" className="text-teal-700 hover:underline">
              Already signed in? Change your password
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}