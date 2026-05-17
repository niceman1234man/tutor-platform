import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { FaUserTie, FaUserGraduate, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

export default function AssignStudent() {
  const [tutors, setTutors] = useState([]);      
  const [students, setStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get("/admin/tutors/approved-applications").catch(() => ({ data: [] })),
      API.get("/admin/users").catch(() => ({ data: [] })),
      API.get("/admin/students/assigned").catch(() => ({ data: [] })),
    ])
      .then(([tutorProfileRes, userRes, assignedRes]) => {
        const tutorProfiles = tutorProfileRes.data;
        const allUsers = userRes.data;
        const assigned = assignedRes.data;

        // Only keep tutors that have an actual approved application
        const validTutors = tutorProfiles.map(profile => ({
          tutorProfileId: profile._id,
          displayName: profile.displayName || profile.userId?.name || "Unnamed Tutor",
        }));

        setTutors(validTutors);
        setStudents(allUsers.filter(u => u.role === "student" && !u.tutorId));
        setAssignedStudents(assigned);
      })
      .catch(() => setError("Failed to fetch data."))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTutor || selectedStudents.length === 0) return;

    setLoading(true);
    setSuccess("");
    setError("");
    try {
      for (const studentId of selectedStudents) {
        await API.patch(`/admin/users/${studentId}`, {
          tutorId: selectedTutor,
          studentId,
        });
      }
      setSuccess(`${selectedStudents.length} student(s) assigned successfully!`);
      setSelectedTutor("");
      setSelectedStudents([]);
      
      // Refresh the assigned students list
      const assignedRes = await API.get("/admin/students/assigned");
      setAssignedStudents(assignedRes.data);
      
      // Refresh unassigned students
      const userRes = await API.get("/admin/users");
      setStudents(userRes.data.filter(u => u.role === "student" && !u.tutorId));
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.response?.data?.message || "Assignment failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-teal-700">
        <FaUserTie className="text-4xl" /> Assign Students to Tutor
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
          <FaCheckCircle /> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleAssign} className="bg-white rounded-xl shadow-lg p-6 space-y-6">

        {/* Tutor Dropdown */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Tutor:</label>

          {loading ? (
            <p className="text-gray-400 text-sm italic">Loading tutors...</p>
          ) : tutors.length === 0 ? (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
              <FaInfoCircle className="mt-0.5 shrink-0" />
              <span>
                No approved tutors found. Tutors must submit an application and be approved before they can be assigned students.
                Go to <strong>Manage Tutors</strong> to approve pending applications.
              </span>
            </div>
          ) : (
            <select
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-400"
              value={selectedTutor}
              onChange={e => setSelectedTutor(e.target.value)}
              required
            >
              <option value="">-- Choose a Tutor --</option>
              {tutors.map(t => (
                <option key={t.tutorProfileId} value={t.tutorProfileId}>
                  {t.displayName}
                </option>
              ))}
            </select>
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
          disabled={loading || tutors.length === 0 || selectedStudents.length === 0 || !selectedTutor}
        >
          {loading ? "Assigning..." : "Assign Students"}
        </button>
      </form>

      {/* Assigned Students List */}
      <div className="mt-10">
        <h2 className="text-2xl font-extrabold mb-4 text-gray-800">Assigned Students</h2>
        {assignedStudents.length === 0 ? (
          <p className="text-gray-500 italic">No students assigned yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Student Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Student Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Assigned Tutor</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tutor Email</th>
                </tr>
              </thead>
              <tbody>
                {assignedStudents.map((student) => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{student.name}</td>
                    <td className="px-4 py-3 text-gray-600">{student.email}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{student.tutorName || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-600">{student.tutorEmail || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
