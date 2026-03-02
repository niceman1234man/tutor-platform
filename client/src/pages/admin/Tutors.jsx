import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import formateDate from "../../utils/formateDate";

export default function AdminTutors() {
  const { user } = useAuth(); // Admin must be logged in
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // track approve/reject

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
    return <p className="text-center text-gray-500">Loading applications...</p>;
  }

  if (!applications.length) {
    return <p className="text-center text-gray-500">No tutor applications found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Tutor Applications</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">{app.userId.name}</h3>
              <p className="mb-1"><strong>Email:</strong> {app.userId.email}</p>
              <p className="mb-2"><strong>Letter:</strong> {app.letter}</p>
              <p className="mb-2">
                <strong>CV:</strong>{" "}
                <a
                  href={app.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  View CV
                </a>
              </p>
              {app.experiences?.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-semibold mb-1">Experiences:</h4>
                  {app.experiences.map((exp, i) => (
                    <div key={i} className="border p-2 rounded mb-1">
                      <p><strong>Company:</strong> {exp.company}</p>
                      <p><strong>Position:</strong> {exp.position}</p>
                      <p>
                        <strong>Duration:</strong> {formateDate(exp.startDate)} → {formateDate(exp.isCurrent ? new Date() : exp.endDate || "N/A")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-1"><strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    app.status === "approved"
                      ? "text-green-600"
                      : app.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status || "pending"}
                </span>
              </p>
            </div>

            {app.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleApprove(app._id)}
                  disabled={actionLoading === app._id}
                  className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                    actionLoading === app._id ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {actionLoading === app._id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(app._id)}
                  disabled={actionLoading === app._id}
                  className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                    actionLoading === app._id ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
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