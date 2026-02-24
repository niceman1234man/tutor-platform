import React from "react";
import { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";

export default function Users() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    if (!token) return;
    API.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setUsers(res.data));
  }, [token]);

  const handleDelete = async (id) => {
    await API.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(users.filter((u) => u._id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {users.map((u) => (
        <div key={u._id} className="bg-white p-4 rounded shadow mb-3 flex justify-between items-center">
          <p>{u.name} - {u.email}</p>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => handleDelete(u._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
   

