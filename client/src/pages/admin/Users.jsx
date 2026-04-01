import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { FaUser, FaUserShield, FaUserGraduate, FaUserTie, FaCheckCircle, FaTimesCircle, FaSyncAlt, FaTrashAlt } from "react-icons/fa";

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
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-teal-700">
        <FaUserShield className="text-4xl" /> Users Management
      </h2>

      {/* Filter Card */}
      <div className="mb-8 flex justify-center">
        <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex gap-6 items-center">
          <label className="font-semibold text-gray-700">Filter by role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-400">
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="tutor">Tutor</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FaSyncAlt className="animate-spin text-3xl text-teal-500 mr-2" />
          <span className="text-lg font-medium text-teal-700">Loading...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center">No users found</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-white rounded-xl">
            <thead>
              <tr className="bg-gradient-to-r from-teal-600 to-teal-400 text-white">
                <th className="px-6 py-3 text-lg font-semibold">Name</th>
                <th className="px-6 py-3 text-lg font-semibold">Email</th>
                <th className="px-6 py-3 text-lg font-semibold">Role</th>
                <th className="px-6 py-3 text-lg font-semibold">Active</th>
                <th className="px-6 py-3 text-lg font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u._id}
                  className={`text-center transition-all duration-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-teal-50`}
                >
                  <td className="px-6 py-3 flex items-center gap-2 justify-center">
                    <FaUser className="text-teal-500 mr-1" />
                    <span className="font-medium">{u.name}</span>
                  </td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2 justify-center">
                      {u.newRole === "admin" && <FaUserShield className="text-indigo-600" title="Admin" />}
                      {u.newRole === "student" && <FaUserGraduate className="text-amber-600" title="Student" />}
                      {u.newRole === "tutor" && <FaUserTie className="text-purple-600" title="Tutor" />}
                      <select
                        value={u.newRole}
                        onChange={(e) => {
                          u.newRole = e.target.value;
                          setUsers([...users]);
                        }}
                        className="border px-2 py-1 rounded-lg focus:ring-2 focus:ring-teal-400"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="tutor">Tutor</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        u.newActive = !u.newActive;
                        setUsers([...users]);
                      }}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold shadow transition-all duration-200 ${u.newActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
                    >
                      {u.newActive ? (
                        <>
                          <FaCheckCircle className="text-green-500" /> Active
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="text-gray-400" /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-3 flex justify-center gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center gap-2"
                      onClick={() => handleUpdate(u)}
                    >
                      <FaSyncAlt /> Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center gap-2"
                      onClick={() => handleDelete(u._id)}
                    >
                      <FaTrashAlt /> Delete
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