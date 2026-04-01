import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "grade6",
    department: "",
    file: null,
    image: null
  });
  const [categories] = useState([
    { label: "Grade 6", value: "grade6" },
    { label: "Grade 7", value: "grade7" },
    { label: "Grade 8", value: "grade8" },
    { label: "Grade 9", value: "grade9" },
    { label: "Grade 10", value: "grade10" },
    { label: "Grade 11", value: "grade11" },
    { label: "Grade 12", value: "grade12" },
    { label: "Freshman", value: "freshman" },
    { label: "Exit", value: "exit" },
  ]);
  const [departments, setDepartments] = useState([
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Electrical Engineering",
  ]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all resources
  const fetchResources = async () => {
    try {
      const res = await API.get("/resources");
      setResources(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch resources");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  // Upload or update resource
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("category", form.category);

      if (form.category === "exit") {
        formData.append("department", form.department);
      }

      if (form.file) {
        formData.append("file", form.file);
      }

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await API.put(`/resources/${editingId}`, formData);
      } else {
        await API.post("/resources", formData);
      }

      setForm({
        title: "",
        category: "grade6",
        department: "",
        file: null,
        image: null
      });

      setEditingId(null);
      fetchResources();
    } catch (err) {
      console.error(err);
      setError("Failed to save resource");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource._id);
    setForm({
      title: resource.title,
      category: resource.category,
      department: resource.department || "",
      file: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await API.delete(`/resources/${id}`);
      setResources(resources.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete resource");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 py-0 px-0">
      {/* Hero Header */}
      <div className="relative w-full h-48 md:h-56 bg-gradient-to-r from-blue-400 via-teal-400 to-green-300 flex items-center justify-center shadow-lg mb-10">
        <div className="absolute inset-0 bg-black/20 rounded-b-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-2">
            <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" /></svg>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">Admin Resources</h2>
          </div>
          <p className="text-white/90 font-medium max-w-xl mx-auto drop-shadow">Upload, edit, and manage educational resources for all categories.</p>
        </div>
      </div>

      {/* Upload / Update Form */}
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="bg-white/95 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>{editingId ? "Edit Resource" : "Upload Resource"}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Resource Title"
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-teal-400"
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-teal-400"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {form.category === "exit" && (
              <select
                name="department"
                value={form.department}
                onChange={handleFormChange}
                className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-teal-400"
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}
            <div className="font-medium">Cover Image</div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFormChange}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-teal-400"
            />
            <div className="font-medium">Resource File</div>
            <input
              type="file"
              name="file"
              onChange={handleFormChange}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-teal-400"
              {...(!editingId && { required: true })}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-lg w-full font-semibold shadow hover:from-teal-600 hover:to-blue-600 transition disabled:opacity-60"
              disabled={uploading}
            >
              {uploading ? "Saving..." : editingId ? "Update Resource" : "Upload Resource"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>

        {/* Resources Table */}
        <div className="bg-white/95 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Resources</h2>
          {resources.length === 0 ? (
            <p className="text-gray-500">No resources found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden shadow">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">File</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((r) => (
                    <tr key={r._id} className="text-center border-b hover:bg-slate-50 transition">
                      <td className="px-4 py-2 font-semibold text-slate-800">{r.title}</td>
                      <td className="px-4 py-2">{r.category}</td>
                      <td className="px-4 py-2">{r.department || "-"}</td>
                      <td className="px-4 py-2">
                        <a
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(r.fileUrl)}&embedded=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 underline hover:text-teal-900"
                        >
                          View
                        </a>
                      </td>
                      <td className="px-4 py-2 flex justify-center gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded shadow transition"
                          onClick={() => handleEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition"
                          onClick={() => handleDelete(r._id)}
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
      </div>
    </div>
  );
}