import React from "react";
import { useEffect, useState } from "react";
import API from "../../api/api";

export default function FollowUps() {
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
    API.get("/followups/my").then((res) => setFollowUps(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Follow-ups</h2>
      {followUps.map((f) => (
        <div key={f._id} className="bg-white p-4 rounded shadow mb-3">
          <p><strong>Notes:</strong> {f.notes}</p>
          <p><strong>Assignment:</strong> {f.assignment || "No assignment"}</p>
          <p><strong>Next Session:</strong> {f.nextSessionDate || "TBD"}</p>
          <p><strong>Status:</strong> {f.status || "Pending"}</p>
        </div>
      ))}
    </div>
  );
}
