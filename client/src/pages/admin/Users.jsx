import React, { useEffect, useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";
import {
  FaUser,
  FaUserShield,
  FaUserGraduate,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaSyncAlt,
  FaTrashAlt,
  FaChartBar,
} from "react-icons/fa";

export default function Users() {
  const { user } = useAuth();
  const token = user?.token;

  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const editableUsers = res.data.map((u) => ({
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

  useEffect(() => {
    let filtered = allUsers;
    if (filterRole) filtered = filtered.filter((u) => u.role === filterRole);
    if (filterStatus === "active") filtered = filtered.filter((u) => u.active);
    if (filterStatus === "inactive") filtered = filtered.filter((u) => !u.active);
    setUsers(filtered);
  }, [filterRole, filterStatus, allUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await API.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedUsers = allUsers.filter((u) => u._id !== id);
    setAllUsers(updatedUsers);
  };

  const handleUpdate = async (user) => {
    try {
      if (user.newRole !== user.role) {
        const res = await API.patch(
          `/admin/users/${user._id}/role`,
          { role: user.newRole },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        user.role = res.data.user.role;
      }
      if (user.newActive !== user.active) {
        const res = await API.patch(
          `/admin/users/${user._id}/status`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        user.active = res.data.user.active;
      }
      setUsers([...users]);
      alert("User updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  // Report stats derived from allUsers
  const total = allUsers.length;
  const admins = allUsers.filter((u) => u.role === "admin").length;
  const tutors = allUsers.filter((u) => u.role === "tutor").length;
  const students = allUsers.filter((u) => u.role === "student").length;
  const active = allUsers.filter((u) => u.active).length;
  const inactive = allUsers.filter((u) => !u.active).length;

  const reportCards = [
    { label: "Total Users", value: total, color: "from-teal-500 to-teal-700", icon: <FaUser /> },
    { label: "Admins", value: admins, color: "from-indigo-500 to-indigo-700", icon: <FaUserShield /> },
    { label: "Tutors", value: tutors, color: "from-purple-500 to-purple-700", icon: <FaUserTie /> },
    { label: "Students", value: students, color: "from-amber-500 to-amber-600", icon: <FaUserGraduate /> },
    { label: "Active", value: active, color: "from-green-500 to-green-700", icon: <FaCheckCircle /> },
    { label: "Inactive", value: inactive, color: "from-red-400 to-red-600", icon: <FaTimesCircle /> },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-teal-700">
        <FaUserShield className="text-4xl" /> Users Management
      </h2>

      {/* Report Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-600 flex items-center gap-2 mb-3">
          <FaChartBar className="text-teal-500" /> User Report
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {reportCards.map((card) => (
            <button
              key={card.label}
              onClick={() => {
                if (card.label === "Active") { setFilterStatus("active"); setFilterRole(""); }
                else if (card.label === "Inactive") { setFilterStatus("inactive"); setFilterRole(""); }
                else if (card.label === "Total Users") { setFilterRole(""); setFilterStatus(""); }
                else { setFilterRole(card.label.toLowerCase()); setFilterStatus(""); }
              }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white text-center shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer`}
            >
              <div className="text-2xl mb-1 flex justify-center">{card.icon}</div>
              <div className="text-3xl font-extrabold">{card.value}</div>
              <div className="text-xs mt-1 font-medium opacity-90">{card.label}</div>
            </button>
          ))}
        </div>

        {/* Role breakdown bar */}
        {total > 0 && (
          <div className="mt-4 bg-white rounded-xl shadow px-5 py-4">
            <p className="text-sm font-semibold text-gray-500 mb-2">Role Distribution</p>
            <div className="flex h-4 rounded-full overflow-hidden w-full">
              {admins > 0 && (
                <div
                  className="bg-indigo-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(admins / total) * 100}%` }}
                  title={`Admins: ${admins}`}
                />
              )}
              {tutors > 0 && (
                <div
                  className="bg-purple-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(tutors / total) * 100}%` }}
                  title={`Tutors: ${tutors}`}
                />
              )}
              {students > 0 && (
                <div
                  className="bg-amber-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(students / total) * 100}%` }}
                  title={`Students: ${students}`}
                />
              )}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Admins {admins}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Tutors {tutors}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Students {students}</span>
            </div>
          </div>
        )}

        {/* Active/Inactive bar */}
        {total > 0 && (
          <div className="mt-3 bg-white rounded-xl shadow px-5 py-4">
            <p className="text-sm font-semibold text-gray-500 mb-2">Status Distribution</p>
            <div className="flex h-4 rounded-full overflow-hidden w-full">
              {active > 0 && (
                <div
                  className="bg-green-500"
                  style={{ width: `${(active / total) * 100}%` }}
                  title={`Active: ${active}`}
                />
              )}
              {inactive > 0 && (
                <div
                  className="bg-red-400"
                  style={{ width: `${(inactive / total) * 100}%` }}
                  title={`Inactive: ${inactive}`}
                />
              )}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Active {active}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Inactive {inactive}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <div className="bg-white rounded-xl shadow px-5 py-3 flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700 text-sm">Role:</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-400 text-sm"
            >
              <option value="">All</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700 text-sm">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-400 text-sm"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {(filterRole || filterStatus) && (
            <button
              onClick={() => { setFilterRole(""); setFilterStatus(""); }}
              className="text-sm text-red-500 hover:text-red-700 font-semibold"
            >
              Clear filters
            </button>
          )}
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
          <p className="text-sm text-gray-400 mb-2 text-right">Showing {users.length} of {total} users</p>
          <table className="min-w-full bg-white rounded-xl">
            <thead>
              <tr className="bg-gradient-to-r from-teal-600 to-teal-400 text-white">
                <th className="px-6 py-3 text-lg font-semibold">Name</th>
                <th className="px-6 py-3 text-lg font-semibold">Email</th>
                <th className="px-6 py-3 text-lg font-semibold">Phone</th>
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
                  <td className="px-6 py-3">{u.phone}</td>
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
                      className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold shadow transition-all duration-200 mx-auto ${u.newActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
                    >
                      {u.newActive ? (
                        <><FaCheckCircle className="text-green-500" /> Active</>
                      ) : (
                        <><FaTimesCircle className="text-gray-400" /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-center gap-2">
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
                    </div>
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
