import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "grade6",
    department: "",
    file: null,
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
      if (form.category === "exit") formData.append("department", form.department);
      if (form.file) formData.append("file", form.file);

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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Upload / Update Form */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Resource" : "Upload Resource"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="Resource Title"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleFormChange}
            className="border rounded px-3 py-2 w-full"
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
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
          <input
            type="file"
            name="file"
            onChange={handleFormChange}
            className="border rounded px-3 py-2 w-full"
            {...(!editingId && { required: true })}
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded w-full"
            disabled={uploading}
          >
            {uploading ? "Saving..." : editingId ? "Update Resource" : "Upload Resource"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>

      {/* Resources Table */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Resources</h2>
        {resources.length === 0 ? (
          <p>No resources found.</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r._id} className="text-center border-b">
                  <td className="px-4 py-2">{r.title}</td>
                  <td className="px-4 py-2">{r.category}</td>
                  <td className="px-4 py-2">{r.department || "-"}</td>
                  <td className="px-4 py-2">
                    <a
                      href={`https://docs.google.com/viewer?url=${encodeURIComponent(r.fileUrl)}&embedded=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}