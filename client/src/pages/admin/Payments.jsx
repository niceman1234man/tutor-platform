import React from "react";
import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    API.get("/admin/payments").then(res => setPayments(res.data));
  }, []);

  const handleApprove = async (id) => {
    await API.patch(`/admin/payments/${id}/approve`);
    setPayments(payments.filter(p => p._id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payments</h2>
      {payments.map(p => (
        <div key={p._id} className="bg-white p-4 rounded shadow mb-3 flex justify-between">
          <p>{p.bookingId.studentId.name} - ${p.amount}</p>
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleApprove(p._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
