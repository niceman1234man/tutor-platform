import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import formateDate from "../../utils/formateDate";

export default function AdminTutors() {
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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-slate-800 border-b pb-3">Tutor Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow-xl rounded-2xl border border-slate-100 p-7 flex flex-col justify-between transition hover:shadow-2xl"
          >
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
  );
}