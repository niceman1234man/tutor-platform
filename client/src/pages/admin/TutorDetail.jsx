import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";

export default function TutorDetails() {
    // Debug: Show user object for troubleshooting
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingType, setUpdatingType] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  const handleTypeChange = async (e) => {
    const newType = e.target.value;
    if (!window.confirm(`Are you sure you want to change the course type to '${newType}'?`)) return;
    try {
      setUpdatingType(true);
      const res = await API.patch(`/courses/${id}`, { type: newType });
      setCourse((prev) => ({ ...prev, type: res.data.type }));
    } catch (err) {
      alert("Failed to update course type.");
    } finally {
      setUpdatingType(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await API.delete(`/courses/${id}`);
      navigate("/admin/tutors-materials");
    } catch (err) {
      alert("Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  if (!course) {
    return <div className="text-center py-10">Course not found.</div>;
  }

  // Only show delete if user is owner or admin
  // Support user object with nested user property
  const userInfo = user && user.user ? user.user : user;
  const canDelete = userInfo && course.tutorId && (String(userInfo._id || userInfo.id) === String(course.tutorId) || userInfo.role === "admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-0 px-0">
      {/* Hero Header */}
      <div className="relative w-full h-56 md:h-64 bg-gradient-to-r from-blue-400 via-teal-400 to-green-300 flex items-center justify-center shadow-lg">
        <div className="absolute inset-0 bg-black/20 rounded-b-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-2">
            <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" /></svg>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">{course.title}</h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow">{course.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl -mt-16 pb-16">
        <div className="rounded-3xl bg-white/95 p-8 md:p-12 shadow-2xl ring-1 ring-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 border-b pb-8 mb-10">
            <div className="flex-1">
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="inline-flex items-center gap-1 bg-slate-100 text-gray-700 px-3 py-1 rounded-full text-sm"><svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L6 21h12l-3.75-4" /></svg>Category: <span className="font-semibold">{course.category}</span></span>
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm"><svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 01-1.4 2.5H6a1.65 1.65 0 01-1.4-2.5l7-12a1.65 1.65 0 012.8 0l7 12z" /></svg>Price: <span className="font-bold">${course.price}</span></span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${course.type === 'pro' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Type: <span className="font-bold">{course.type === 'pro' ? 'Pro' : 'Free'}</span></span>
              </div>
              {canDelete && (
                <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
                  <div className="flex items-center gap-3">
                    <label htmlFor="course-type" className="font-medium text-gray-700">Course Type:</label>
                    <select
                      id="course-type"
                      value={course.type}
                      onChange={handleTypeChange}
                      disabled={updatingType}
                      className="border rounded px-3 py-1 focus:ring-2 focus:ring-teal-400 shadow-sm"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                    {updatingType && <span className="ml-2 text-gray-500 animate-pulse">Updating...</span>}
                  </div>
                  <button
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-lg shadow hover:from-red-600 hover:to-red-800 transition font-semibold disabled:opacity-60"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete Course"}
                  </button>
                </div>
              )}
            </div>
            {course.imageUrl && (
              <img src={course.imageUrl} alt={course.title} className="w-56 h-56 object-cover rounded-2xl border-4 border-white shadow-xl mx-auto" />
            )}
          </div>

          {/* Chapters Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8 text-slate-800 border-b pb-3 flex items-center gap-2"><svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-7-7m7 7l7-7" /></svg>Chapters</h2>
            {course.chapters && course.chapters.length > 0 ? (
              <ul className="space-y-8">
                {course.chapters.map((chapter, idx) => (
                  <li key={chapter._id || idx} className="border rounded-2xl p-6 bg-gradient-to-br from-slate-50/80 to-blue-50/60 shadow-md hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-xl text-slate-900 flex items-center gap-2"><svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>{chapter.title}</span>
                      <span className="text-xs text-gray-500">Order: {chapter.order}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{chapter.description}</p>
                    {chapter.contents && chapter.contents.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium">Files:</span>
                        <ul className="list-disc ml-6 mt-1">
                          {chapter.contents.map((file, fidx) => (
                            <li key={file.publicId || fidx}>
                              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition">
                                {file.name || file.url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No chapters available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}