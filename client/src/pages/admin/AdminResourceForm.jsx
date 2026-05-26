import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    department: "",
    file: null,
    image: null,
  });
  const [departments] = useState([
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Electrical Engineering",
  ]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ label: "", value: "" });
  const [categoryError, setCategoryError] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
      if (res.data.length > 0 && !form.category) {
        setForm((f) => ({ ...f, category: res.data[0].value }));
      }
    } catch (err) {
      console.error(err);
    }
  };

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
    fetchCategories();
    fetchResources();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

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
      if (form.image) formData.append("image", form.image);

      if (editingId) {
        await API.put(`/resources/${editingId}`, formData);
      } else {
        await API.post("/resources", formData);
      }

      setForm({ title: "", category: categories[0]?.value || "", department: "", file: null, image: null });
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
    setForm({ title: resource.title, category: resource.category, department: resource.department || "", file: null, image: null });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await API.delete(`/resources/${id}`);
      setResources(resources.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to delete resource");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryError("");
    setAddingCategory(true);
    try {
      await API.post("/categories", {
        label: newCategory.label,
        value: newCategory.value.toLowerCase().replace(/\s+/g, "_"),
      });
      setNewCategory({ label: "", value: "" });
      setShowAddCategory(false);
      fetchCategories();
    } catch (err) {
      setCategoryError(err?.response?.data?.message || "Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
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

      <div className="max-w-4xl mx-auto space-y-6 pb-12">

        {/* Category Manager */}
        <div className="bg-white/95 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
              Categories
            </h2>
            <button
              onClick={() => { setShowAddCategory(!showAddCategory); setCategoryError(""); }}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add Category
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={handleAddCategory} className="mb-5 bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-teal-800">New Category</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Label (e.g. Grade 10)"
                  value={newCategory.label}
                  onChange={(e) => setNewCategory((n) => ({ ...n, label: e.target.value }))}
                  className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-teal-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Value (e.g. grade10)"
                  value={newCategory.value}
                  onChange={(e) => setNewCategory((n) => ({ ...n, value: e.target.value }))}
                  className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              {categoryError && <p className="text-red-500 text-sm">{categoryError}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addingCategory}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition disabled:opacity-60"
                >
                  {addingCategory ? "Saving..." : "Save Category"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddCategory(false); setCategoryError(""); }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm">No categories yet. Add one above.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <span key={c._id} className="flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                  {c.label}
                  <button
                    onClick={() => handleDeleteCategory(c._id)}
                    className="text-red-400 hover:text-red-600 transition"
                    title="Delete category"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Upload / Update Form */}
        <div className="bg-white/95 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {editingId ? "Edit Resource" : "Upload Resource"}
          </h2>
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
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c.value}>{c.label}</option>
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
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Resources
          </h2>
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
