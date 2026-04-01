import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import formateDate from "../../utils/formateDate";
import { FaTrash } from "react-icons/fa";

export default function AdminTutors() {
    // Delete application
    const handleDelete = async (id) => {
      if (!user?.token) return;
      if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
      try {
        setActionLoading(id);
        await API.delete(`/applications/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications((prev) => prev.filter((app) => app._id !== id));
      } catch (err) {
        console.error("Delete failed:", err.response || err);
        alert("Failed to delete application.");
      } finally {
        setActionLoading(null);
      }
    };
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await API.get("/applications", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleApprove = async (id) => {
    if (!user?.token) return;
    try {
      setActionLoading(id);
      await API.put(`/applications/${id}/approve`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: "approved" } : app))
      );
    } catch (err) {
      console.error("Approve failed:", err.response || err);
      alert("Failed to approve application.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!user?.token) return;
    try {
      setActionLoading(id);
      await API.put(`/applications/${id}/reject`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: "rejected" } : app))
      );
    } catch (err) {
      console.error("Reject failed:", err.response || err);
      alert("Failed to reject application.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="text-lg text-gray-500">Loading applications...</div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="text-lg text-gray-500">No tutor applications found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-0 px-0">
      <div className="relative w-full h-48 md:h-56 bg-gradient-to-r from-blue-400 via-teal-400 to-green-300 flex items-center justify-center shadow-lg mb-10">
        <div className="absolute inset-0 bg-black/20 rounded-b-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-2">
            <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" /></svg>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">Tutor Applications</h2>
          </div>
          <p className="text-white/90 font-medium max-w-xl mx-auto drop-shadow">Review, approve, reject, or delete tutor applications.</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white/90 shadow-xl rounded-2xl border border-slate-100 p-7 flex flex-col justify-between transition hover:shadow-2xl relative group"
            >
              <button
                onClick={() => handleDelete(app._id)}
                disabled={actionLoading === app._id}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition text-xl z-10"
                title="Delete Application"
              >
                <FaTrash/>
              </button>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl uppercase">
                    {app.userId.name?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{app.userId.name}</h3>
                    <p className="text-sm text-slate-500">{app.userId.email}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-slate-700">Letter:</span>
                  <p className="text-slate-600 bg-slate-50 rounded p-2 mt-1">{app.letter}</p>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-slate-700">CV:</span>{" "}
                  <a
                    href={app.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-800"
                  >
                    View CV
                  </a>
                </div>
                {app.experiences?.length > 0 && (
                  <div className="mb-2">
                    <h4 className="font-semibold text-slate-700 mb-1">Experiences:</h4>
                    <ul className="space-y-2">
                      {app.experiences.map((exp, i) => (
                        <li key={i} className="border border-slate-100 bg-slate-50 rounded-lg p-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Company:</span>
                            <span>{exp.company}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Position:</span>
                            <span>{exp.position}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Duration:</span>
                            <span>
                              {formateDate(exp.startDate)} &rarr;{" "}
                              {formateDate(exp.isCurrent ? new Date() : exp.endDate || "N/A")}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-2">
                  <span className="font-medium text-slate-700">Status:</span>{" "}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      app.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status || "pending"}
                  </span>
                </div>
              </div>
              {app.status === "pending" && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleApprove(app._id)}
                    disabled={actionLoading === app._id}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold shadow-sm transition text-white ${
                      actionLoading === app._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {actionLoading === app._id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(app._id)}
                    disabled={actionLoading === app._id}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold shadow-sm transition text-white ${
                      actionLoading === app._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {actionLoading === app._id ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}