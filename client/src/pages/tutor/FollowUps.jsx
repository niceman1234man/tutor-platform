import React from "react"
import { useEffect, useState } from "react";
import API from "../../api/api";

export default function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    API.get("/followups/tutor").then(res => setFollowUps(res.data));
  }, []);

  const handleAdd = async () => {
    const newFollowUp = await API.post("/followups", { notes });
    setFollowUps([...followUps, newFollowUp.data]);
    setNotes("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Follow-ups</h2>
      <div className="mb-4">
        <textarea
          className="w-full border p-2"
          placeholder="Add notes for follow-up"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 mt-2 rounded" onClick={handleAdd}>
          Add Follow-up
        </button>
      </div>
      {followUps.map(f => (
        <div key={f._id} className="bg-white p-4 rounded shadow mb-3">
          <p><strong>Notes:</strong> {f.notes}</p>
          <p><strong>Student:</strong> {f.bookingId.studentId.name}</p>
          <p><strong>Status:</strong> {f.status}</p>
        </div>
      ))}
    </div>
  );
}
