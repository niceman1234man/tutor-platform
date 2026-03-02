import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import formatDate from "../../utils/formateDate";

export default function MyApplications() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        if (!user) return; // ✅ STOP if user not loaded yet

        const fetchApplications = async () => {
            try {
                const res = await API.get("/applications/me", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                setApplications(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchApplications();
    }, [user]);
    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold mb-6">My Applications</h2>
                <a href="/tutor/applications" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    New Application
                </a>
            </div>

            {applications.length === 0 ? (
                <p>No applications submitted yet.</p>
            ) : (
                applications.map((app) => (
                    <div
                        key={app._id}
                        className="bg-white shadow-lg rounded-xl p-5 mb-6"
                    >
                        <h3 className="text-lg font-semibold mb-2">Application</h3>

                        {/* Letter */}
                        <p className="mb-3">
                            <strong>Letter:</strong> {app.letter}
                        </p>

                        {/* CV */}
                        <p className="mb-3">
                            <strong>CV:</strong>{" "}
                            <a
                                href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.cvUrl)}&embedded=true`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-700 underline"
                            >
                                View CV
                            </a>
                        </p>

                        {/* Experiences */}
                        <div>
                            <h4 className="font-semibold mb-2">Experiences</h4>

                            {app.experiences.map((exp, i) => (
                                <div key={i} className="border p-3 rounded mb-2">
                                    <p><strong>Company:</strong> {exp.company}</p>
                                    <p><strong>Position:</strong> {exp.position}</p>
                                    <p><strong>Description:</strong> {exp.description}</p>
                                    <p>
                                        <strong>Duration:</strong>{" "}
                                        {formatDate(exp.startDate)} →{" "}
                                        {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}