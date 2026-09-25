import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import useAuth from "../hooks/useAuth";

export default function ChangePassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      setError("New password must be between 8 and 128 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message || "Password changed. Please sign in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to change your password right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignInAgain = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-teal-50 to-indigo-100 px-4 py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-teal-700 text-center">
          Change Password
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your current password and choose a new one.
        </p>

        {message ? (
          <div className="space-y-5">
            <div role="status" className="bg-green-100 text-green-800 p-3 rounded-lg text-sm text-center">
              {message}
            </div>
            <button
              type="button"
              onClick={handleSignInAgain}
              className="w-full p-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
            >
              Sign in again
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div role="alert" className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="current-password">
                  Current password
                </label>
                <input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="change-new-password">
                  New password
                </label>
                <input
                  id="change-new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="change-confirm-password">
                  Confirm new password
                </label>
                <input
                  id="change-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 rounded-lg bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition disabled:opacity-60"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
            <div className="text-center mt-5">
              <Link to="/forgot" className="text-sm text-teal-700 hover:underline">
                Forgot your current password?
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}