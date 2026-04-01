import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get("/payments", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPayments(res.data);
      } catch (err) {
        setPayments([]);
      }
    };
    if (user && user.token) fetchPayments();
  }, [user]);

  return (
    <section id="payments" className="mb-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-700"><FaMoneyBillWave /> Payments</h2>
      {payments.length === 0 ? (
        <p className="text-gray-500">No payment records found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {payments.map((p) => (
            <div key={p._id} className="bg-white/90 p-5 rounded-2xl shadow border border-green-100 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">Amount:</span>
                <span className="text-green-700 font-semibold">${p.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">Method:</span>
                <span className="text-gray-700">{p.method}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">Status:</span>
                {p.status === "approved" ? (
                  <span className="text-green-600 flex items-center gap-1"><FaCheckCircle /> Approved</span>
                ) : p.status === "pending" ? (
                  <span className="text-yellow-600 flex items-center gap-1"><FaTimesCircle /> Pending</span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1"><FaTimesCircle /> Rejected</span>
                )}
              </div>
              {p.receiptImage && (
                <img src={p.receiptImage} alt="Receipt" className="w-32 h-20 object-cover rounded mt-2 border" />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}