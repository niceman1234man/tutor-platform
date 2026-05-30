import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import formatDate from "../../utils/formateDate";
import {
  FaFileAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";

const STATUS_CONFIG = {
  pending:  { label: "Pending Review", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <FaClock className="text-yellow-500" /> },
  approved: { label: "Approved",       color: "bg-green-100 text-green-700 border-green-200",   icon: <FaCheckCircle className="text-green-500" /> },
  rejected: { label: "Rejected",       color: "bg-red-100 text-red-700 border-red-200",         icon: <FaTimesCircle className="text-red-500" /> },
};

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">My Applications</h1>
            <p className="text-teal-100 text-sm">Track the status of your tutor applications</p>
          </div>
          <a
            href="/tutor/applications"
            className="flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-semibold px-4 py-2 rounded-xl shadow transition text-sm"
          >
            <FaPlus /> New Application
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-5">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow border border-gray-100 p-6 animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded-full w-28" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-16 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && applications.length === 0 && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-14 text-center">
            <FaFileAlt className="text-5xl text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No applications yet</h3>
            <p className="text-gray-400 text-sm mb-6">Submit your first tutor application to get started.</p>
            <a
              href="/tutor/applications"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow"
            >
              <FaPlus /> Apply Now
            </a>
          </div>
        )}

        {/* Application cards */}
        {!loading && applications.length > 0 && (
          <div className="space-y-6">
            {applications.map((app, index) => {
              const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <FaFileAlt className="text-teal-500 text-lg" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Application #{index + 1}</p>
                        {app.createdAt && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <FaCalendarAlt /> Submitted {formatDate(app.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  <div className="px-6 py-5 space-y-5">
                    {/* Cover letter */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Cover Letter</p>
                      <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                        {app.letter}
                      </p>
                    </div>

                    {/* CV link */}
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">CV / Resume</p>
                      <a
                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.cvUrl)}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 font-semibold underline underline-offset-2 transition"
                      >
                        <FaExternalLinkAlt className="text-xs" /> View CV
                      </a>
                    </div>

                    {/* Experiences */}
                    {app.experiences && app.experiences.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                          <FaBriefcase /> Work Experience
                        </p>
                        <div className="space-y-3">
                          {app.experiences.map((exp, i) => (
                            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                              <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                                <div>
                                  <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                                    <FaUserTie className="text-teal-400 text-sm" /> {exp.position}
                                  </p>
                                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                    <FaBuilding className="text-gray-400 text-xs" /> {exp.company}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-lg px-2 py-1 whitespace-nowrap">
                                  {formatDate(exp.startDate)} → {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                </span>
                              </div>
                              {exp.description && (
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Approved info */}
                    {app.status === "approved" && app.approvedAt && (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl px-4 py-2.5 border border-green-100">
                        <FaCheckCircle />
                        <span>Approved on {formatDate(app.approvedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
