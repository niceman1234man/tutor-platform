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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-0 px-0">
            {/* Hero Header */}
            <div className="relative w-full h-44 md:h-52 bg-gradient-to-r from-blue-400 via-teal-400 to-green-300 flex items-center justify-center shadow-lg mb-10">
                <div className="absolute inset-0 bg-black/20 rounded-b-3xl" />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex items-center gap-4 mb-2">
                        <svg className="w-9 h-9 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" /></svg>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">My Applications</h2>
                    </div>
                    <a href="/tutor/applications" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition mt-2">New Application</a>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-16">
                {applications.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">No applications submitted yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {applications.map((app) => (
                            <div
                                key={app._id}
                                className="bg-white/95 shadow-xl rounded-2xl p-7 mb-2 border border-slate-100 flex flex-col gap-4 hover:shadow-2xl transition"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <h3 className="text-lg font-bold text-slate-900">Application</h3>
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-slate-700">Letter:</span>
                                    <span className="text-slate-700 ml-1">{app.letter}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-slate-700">CV:</span>{" "}
                                    <a
                                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.cvUrl)}&embedded=true`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-700 underline hover:text-teal-900"
                                    >
                                        View CV
                                    </a>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-slate-700">Experiences</h4>
                                    {app.experiences.map((exp, i) => (
                                        <div key={i} className="border border-slate-100 bg-slate-50 rounded-lg p-3 mb-2">
                                            <p><span className="font-medium">Company:</span> {exp.company}</p>
                                            <p><span className="font-medium">Position:</span> {exp.position}</p>
                                            <p><span className="font-medium">Description:</span> {exp.description}</p>
                                            <p>
                                                <span className="font-medium">Duration:</span>{" "}
                                                {formatDate(exp.startDate)} → {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}