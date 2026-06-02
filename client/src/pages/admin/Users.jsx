import React, { useEffect, useState, useMemo } from "react";
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
  FaDownload,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const PAGE_SIZE = 10;

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-4 pb-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
      >
        <FaChevronLeft className="text-xs" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold border transition ${
              p === page
                ? "bg-teal-600 text-white border-teal-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
}

export default function Users() {
  const { user } = useAuth();
  const token = user?.token;

  const [allUsers, setAllUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

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
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [token]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [filterRole, filterStatus, search]);

  const filtered = useMemo(() => {
    let list = allUsers;
    if (filterRole) list = list.filter((u) => u.role === filterRole);
    if (filterStatus === "active")   list = list.filter((u) => u.active);
    if (filterStatus === "inactive") list = list.filter((u) => !u.active);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [allUsers, filterRole, filterStatus, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await API.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleUpdate = async (u) => {
    try {
      if (u.newRole !== u.role) {
        const res = await API.patch(
          `/admin/users/${u._id}/role`,
          { role: u.newRole },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        u.role = res.data.user.role;
      }
      if (u.newActive !== u.active) {
        const res = await API.patch(
          `/admin/users/${u._id}/status`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        u.active = res.data.user.active;
      }
      setAllUsers([...allUsers]);
      alert("User updated successfully");
    } catch {
      alert("Failed to update user");
    }
  };

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Phone", "Role", "Status"];
    const rows = filtered.map((u) => [
      `"${u.name || ""}"`,
      `"${u.email || ""}"`,
      `"${u.phone || ""}"`,
      `"${u.role || ""}"`,
      `"${u.active ? "Active" : "Inactive"}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const total    = allUsers.length;
  const admins   = allUsers.filter((u) => u.role === "admin").length;
  const tutors   = allUsers.filter((u) => u.role === "tutor").length;
  const students = allUsers.filter((u) => u.role === "student").length;
  const active   = allUsers.filter((u) => u.active).length;
  const inactive = allUsers.filter((u) => !u.active).length;

  const reportCards = [
    { label: "Total Users", value: total,    color: "from-teal-500 to-teal-700",   icon: <FaUser />,          onClick: () => { setFilterRole(""); setFilterStatus(""); } },
    { label: "Admins",      value: admins,   color: "from-indigo-500 to-indigo-700", icon: <FaUserShield />,  onClick: () => { setFilterRole("admin"); setFilterStatus(""); } },
    { label: "Tutors",      value: tutors,   color: "from-purple-500 to-purple-700", icon: <FaUserTie />,     onClick: () => { setFilterRole("tutor"); setFilterStatus(""); } },
    { label: "Students",    value: students, color: "from-amber-500 to-amber-600",   icon: <FaUserGraduate />,onClick: () => { setFilterRole("student"); setFilterStatus(""); } },
    { label: "Active",      value: active,   color: "from-green-500 to-green-700",   icon: <FaCheckCircle />, onClick: () => { setFilterStatus("active"); setFilterRole(""); } },
    { label: "Inactive",    value: inactive, color: "from-red-400 to-red-600",       icon: <FaTimesCircle />, onClick: () => { setFilterStatus("inactive"); setFilterRole(""); } },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-teal-700">
        <FaUserShield /> Users Management
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {reportCards.map((card) => (
          <button
            key={card.label}
            onClick={card.onClick}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white text-center shadow hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="text-xl mb-1 flex justify-center">{card.icon}</div>
            <div className="text-2xl font-extrabold">{card.value}</div>
            <div className="text-xs mt-1 opacity-90">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Distribution bars */}
      {total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow px-5 py-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Role Distribution</p>
            <div className="flex h-3 rounded-full overflow-hidden w-full">
              {admins   > 0 && <div className="bg-indigo-500 transition-all" style={{ width: `${(admins   / total) * 100}%` }} />}
              {tutors   > 0 && <div className="bg-purple-500 transition-all" style={{ width: `${(tutors   / total) * 100}%` }} />}
              {students > 0 && <div className="bg-amber-500  transition-all" style={{ width: `${(students / total) * 100}%` }} />}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Admins ({admins})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Tutors ({tutors})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500  inline-block" /> Students ({students})</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow px-5 py-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Status Distribution</p>
            <div className="flex h-3 rounded-full overflow-hidden w-full">
              {active   > 0 && <div className="bg-green-500 transition-all" style={{ width: `${(active   / total) * 100}%` }} />}
              {inactive > 0 && <div className="bg-red-400   transition-all" style={{ width: `${(inactive / total) * 100}%` }} />}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Active ({active})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400   inline-block" /> Inactive ({inactive})</span>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow px-5 py-3 flex flex-wrap gap-3 items-center mb-4 border border-gray-100">
        <div className="flex items-center gap-2">
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-teal-400 text-sm w-48 outline-none"
          />
          {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-red-400 text-xs">✕</button>}
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-600 text-sm">Role:</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-teal-400 text-sm outline-none"
          >
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="tutor">Tutor</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-600 text-sm">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-teal-400 text-sm outline-none"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {(filterRole || filterStatus || search) && (
          <button
            onClick={() => { setFilterRole(""); setFilterStatus(""); setSearch(""); }}
            className="text-sm text-red-500 hover:text-red-700 font-semibold"
          >
            Clear all
          </button>
        )}

        <button
          onClick={downloadCSV}
          disabled={filtered.length === 0}
          className="ml-auto flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition"
        >
          <FaDownload /> CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FaSyncAlt className="animate-spin text-3xl text-teal-500 mr-2" />
          <span className="text-lg font-medium text-teal-700">Loading...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaUser className="text-4xl mx-auto mb-3 text-gray-200" />
          <p>No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          {/* Info row */}
          <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
            </span>
            {totalPages > 1 && <span>Page {page} of {totalPages}</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-teal-600 to-teal-400 text-white text-left">
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((u, idx) => {
                  const rowNum = (page - 1) * PAGE_SIZE + idx + 1;
                  return (
                    <tr key={u._id} className={`transition-colors ${idx % 2 === 0 ? "bg-gray-50/40" : "bg-white"} hover:bg-teal-50`}>
                      <td className="px-5 py-3 text-gray-400 font-medium">{rowNum}</td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                            <FaUser className="text-teal-600 text-xs" />
                          </div>
                          <span className="font-semibold text-gray-800">{u.name}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-gray-600">{u.email}</td>
                      <td className="px-5 py-3 text-gray-500">{u.phone || "—"}</td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {u.newRole === "admin"   && <FaUserShield   className="text-indigo-500 flex-shrink-0" />}
                          {u.newRole === "student" && <FaUserGraduate className="text-amber-500  flex-shrink-0" />}
                          {u.newRole === "tutor"   && <FaUserTie      className="text-purple-500 flex-shrink-0" />}
                          <select
                            value={u.newRole}
                            onChange={(e) => {
                              u.newRole = e.target.value;
                              setAllUsers([...allUsers]);
                            }}
                            className="border px-2 py-1 rounded-lg focus:ring-2 focus:ring-teal-400 text-sm outline-none"
                          >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                            <option value="tutor">Tutor</option>
                          </select>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <button
                          onClick={() => {
                            u.newActive = !u.newActive;
                            setAllUsers([...allUsers]);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                            u.newActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                        >
                          {u.newActive ? <><FaCheckCircle /> Active</> : <><FaTimesCircle /> Inactive</>}
                        </button>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(u)}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                          >
                            <FaSyncAlt /> Update
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                          >
                            <FaTrashAlt /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 px-4">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
