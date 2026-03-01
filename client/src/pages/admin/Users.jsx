import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";

export default function Users() {
  const { user } = useAuth();
  const token = user?.token;

  const [allUsers, setAllUsers] = useState([]); // all fetched users
  const [users, setUsers] = useState([]);       // filtered users for display
  const [filterRole, setFilterRole] = useState(""); // role filter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users once
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const editableUsers = res.data.map(u => ({
        ...u,
        newRole: u.role,
        newActive: u.active,
      }));
      setAllUsers(editableUsers);
      setUsers(editableUsers);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Local filter by role
  useEffect(() => {
    if (!filterRole) {
      setUsers(allUsers);
    } else {
      setUsers(allUsers.filter(u => u.role === filterRole));
    }
  }, [filterRole, allUsers]);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await API.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const updatedUsers = allUsers.filter(u => u._id !== id);
    setAllUsers(updatedUsers);
    setUsers(updatedUsers.filter(u => !filterRole || u.role === filterRole));
  };

  // Update user role & active status
  const handleUpdate = async (user) => {
    try {
      if (user.newRole !== user.role) {
        const res = await API.patch(`/admin/users/${user._id}/role`, { role: user.newRole }, { headers: { Authorization: `Bearer ${token}` } });
        user.role = res.data.user.role;
      }
      if (user.newActive !== user.active) {
        const res = await API.patch(`/admin/users/${user._id}/status`, {}, { headers: { Authorization: `Bearer ${token}` } });
        user.active = res.data.user.active;
      }
      setUsers([...users]);
      alert("User updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>

      {/* Filter */}
      <div className="mb-4 flex gap-4 items-center">
        <label>Filter by role:</label>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">All</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="tutor">Tutor</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="text-center border-b border-gray-400">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={u.newRole}
                      onChange={(e) => {
                        u.newRole = e.target.value;
                        setUsers([...users]);
                      }}
                      className="border px-1 rounded"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="tutor">Tutor</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        u.newActive = !u.newActive;
                        setUsers([...users]);
                      }}
                      className={`px-2 py-1 rounded ${u.newActive ? "bg-green-500" : "bg-gray-500"} text-white`}
                    >
                      {u.newActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleUpdate(u)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}