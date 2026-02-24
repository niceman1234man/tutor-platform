import React from "react"
import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get("/bookings/requests").then((res) => setRequests(res.data));
  }, []);

  const handleApprove = async (id) => {
    await API.put(`/bookings/${id}`, { status: "approved" });
    setRequests(requests.filter((r) => r._id !== id));
  };

  const handleReject = async (id) => {
    await API.put(`/bookings/${id}`, { status: "rejected" });
    setRequests(requests.filter((r) => r._id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
      {requests.map((r) => (
        <div key={r._id} className="bg-white p-4 rounded shadow mb-3 flex justify-between">
          <div>
            <p>{r.studentId.name}</p>
            <p>{r.date}</p>
          </div>
          <div className="space-x-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleApprove(r._id)}>Approve</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleReject(r._id)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
