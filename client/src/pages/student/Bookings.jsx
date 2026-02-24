import React from "react";
import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/my").then((res) => setBookings(res.data));
  }, []);

  const handleCancel = async (id) => {
    await API.delete(`/bookings/${id}`);
    setBookings(bookings.filter(b => b._id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.map((b) => (
        <div key={b._id} className="bg-white p-4 rounded shadow mb-3 flex justify-between">
          <div>
            <p><strong>Tutor:</strong> {b.tutorId.userId.name}</p>
            <p><strong>Date:</strong> {b.date}</p>
            <p><strong>Duration:</strong> {b.duration} hours</p>
            <p><strong>Status:</strong> {b.status}</p>
          </div>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => handleCancel(b._id)}
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
