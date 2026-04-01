import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { FaUserTie, FaUserGraduate, FaCheckCircle } from "react-icons/fa";

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
     
      API.get("/admin/users"),
       API.get("/admin/users")
    ])
      .then(([tutorRes, userRes]) => {
        setTutors(tutorRes.data.filter(t => t.role === "tutor")); // Only show tutors with user accounts
        setStudents(userRes.data.filter(u => u.role === "student"));
      })
      .catch(() => setError("Failed to fetch tutors or students"))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTutor || selectedStudents.length === 0) return;
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Assign each student individually as per backend API
      for (const studentId of selectedStudents) {
        await API.post("/admin/assign-student", {
          tutorId: selectedTutor,
          studentId
        });
      }
      setSuccess("Students assigned successfully!");
      setSelectedTutor("");
      setSelectedStudents([]);
    } catch {
      setError("Failed to assign students");
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
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded flex items-center gap-2 mb-4">
          <FaCheckCircle /> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleAssign} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Tutor:</label>
          <select
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-400"
            value={selectedTutor}
            onChange={e => setSelectedTutor(e.target.value)}
            required
          >
            <option value="">-- Choose a Tutor --</option>
            {tutors.map(t => (
              <option key={t._id} value={t._id}>
                {t.userId?.name || t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Students:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {students.map(s => (
              <label key={s._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${selectedStudents.includes(s._id) ? "bg-teal-100 border-teal-400 border-2" : "bg-gray-50 border border-gray-200"}`}>
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
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg shadow transition-all duration-200 text-lg"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Students"}
        </button>
      </form>
    </div>
  );
}