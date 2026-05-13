import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { FaUserTie, FaUserGraduate, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function AssignStudent() {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    Promise.all([
      API.get("/admin/tutors").catch(() => ({ data: [] })),
      API.get("/admin/users").catch(() => ({ data: [] })),
    ])
      .then(([tutorProfileRes, userRes]) => {
        const tutorProfiles = tutorProfileRes.data;  // Tutor documents
        const allUsers = userRes.data;

        const tutorUsers = allUsers.filter(u => u.role === "tutor");
        const studentUsers = allUsers.filter(u => u.role === "student");

        // Merge: match each tutor user to their Tutor document (if it exists)
        const merged = tutorUsers.map(user => {
          const profile = tutorProfiles.find(
            p => p.userId?._id === user._id || p.userId === user._id
          );
          return {
            displayName: user.name,
            userId: user._id,
            tutorProfileId: profile?._id || null, // null = no Tutor doc yet
          };
        });

        // Also include Tutor profiles whose userId isn't in the user list
        tutorProfiles.forEach(profile => {
          const alreadyAdded = merged.find(m => m.tutorProfileId === profile._id);
          if (!alreadyAdded) {
            merged.push({
              displayName: profile.userId?.name || "Unknown Tutor",
              userId: profile.userId?._id || null,
              tutorProfileId: profile._id,
            });
          }
        });

        setTutors(merged);
        setStudents(studentUsers);
      })
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTutor || selectedStudents.length === 0) return;

    const tutor = tutors.find(t => t.userId === selectedTutor || t.tutorProfileId === selectedTutor);

    if (!tutor?.tutorProfileId) {
      setError("This tutor has no profile set up yet and cannot be assigned students.");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");
    try {
      for (const studentId of selectedStudents) {
        await API.patch(`/admin/users/${studentId}`, {
          tutorId: tutor.tutorProfileId,
          studentId,
        });
      }
      setSuccess("Students assigned successfully!");
      setSelectedTutor("");
      setSelectedStudents([]);
    } catch {
      setError("Failed to assign students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedTutorObj = tutors.find(t => t.userId === selectedTutor || t.tutorProfileId === selectedTutor);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-teal-700">
        <FaUserTie className="text-4xl" /> Assign Students to Tutor
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded flex items-center gap-2 mb-4">
          <FaCheckCircle /> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleAssign} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Tutor Dropdown */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Tutor:</label>
          {tutors.length === 0 && !loading ? (
            <p className="text-gray-400 text-sm italic">No tutors found in the system.</p>
          ) : (
            <select
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-400"
              value={selectedTutor}
              onChange={e => setSelectedTutor(e.target.value)}
              required
            >
              <option value="">-- Choose a Tutor --</option>
              {tutors.map((t, i) => (
                <option key={t.tutorProfileId || t.userId || i} value={t.userId || t.tutorProfileId}>
                  {t.displayName}
                  {!t.tutorProfileId ? " (no profile)" : ""}
                </option>
              ))}
            </select>
          )}

          {/* Warning if selected tutor has no profile */}
          {selectedTutorObj && !selectedTutorObj.tutorProfileId && (
            <p className="text-amber-600 text-sm mt-1 flex items-center gap-1">
              <FaExclamationTriangle /> This tutor hasn't set up a profile yet — assignment may not work.
            </p>
          )}
        </div>

        {/* Student Checkboxes */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Students:</label>
          {students.length === 0 && !loading ? (
            <p className="text-gray-400 text-sm italic">No students found in the system.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {students.map(s => (
                <label
                  key={s._id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    selectedStudents.includes(s._id)
                      ? "bg-teal-100 border-teal-400 border-2"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={s._id}
                    checked={selectedStudents.includes(s._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, s._id]);
                      } else {
                        setSelectedStudents(selectedStudents.filter(id => id !== s._id));
                      }
                    }}
                    className="accent-teal-600"
                  />
                  <FaUserGraduate className="text-amber-600" />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg shadow transition-all duration-200 text-lg disabled:opacity-50"
          disabled={loading || tutors.length === 0}
        >
          {loading ? "Assigning..." : "Assign Students"}
        </button>
      </form>
    </div>
  );
}
