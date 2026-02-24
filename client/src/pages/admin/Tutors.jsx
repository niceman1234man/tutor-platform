import React from "react";
import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    API.get("/admin/tutors").then(res => setTutors(res.data));
  }, []);

  const handleApprove = async (id) => {
    await API.patch(`/admin/tutors/${id}/approve`);
    setTutors(tutors.filter(t => t._id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tutors</h2>
      {tutors.map(t => (
        <div key={t._id} className="bg-white p-4 rounded shadow mb-3 flex justify-between">
          <p>{t.userId.name} - {t.bio}</p>
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleApprove(t._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
