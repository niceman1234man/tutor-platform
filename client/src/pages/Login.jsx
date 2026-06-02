import React, { useState } from "react";
import API from "../api/api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaBan } from "react-icons/fa";

function SuspendedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-2xl flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <FaBan className="text-red-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-extrabold text-red-600 mb-2">Account Suspended</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your account has been deactivated. Please contact the administrator to restore access.
        </p>
        <a
          href="mailto:admin@skillnest.com"
          className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold transition"
        >
          Contact Admin
        </a>
      </div>
    </div>
  );
}

export default function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [suspended, setSuspended] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuspended(false);
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);

      const role = res.data.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "tutor") navigate("/tutor");
      else navigate("/student");
    } catch (err) {
      const message = err?.response?.data?.message || "";
      if (message === "SUSPENDED") {
        setSuspended(true);
      } else {
        setError(message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (suspended) return <SuspendedScreen />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-teal-700">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="w-full">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-3 rounded text-center text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Email"
              type="email"
              autoComplete="username"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Password"
              autoComplete="current-password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            className="bg-teal-600 text-white w-full p-2 rounded font-semibold shadow hover:bg-teal-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between mt-4 text-sm">
            <span
              className="text-teal-600 hover:underline cursor-pointer"
              onClick={() => navigate("/forgot")}
            >
              Forgot Password?
            </span>
            <span
              className="text-teal-600 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Create Account
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
