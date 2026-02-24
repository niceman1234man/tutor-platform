import React, { useState } from "react";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";

const categories = [
  { label: "Grade 6", value: "grade6" },
  { label: "Grade 7", value: "grade7" },
  { label: "Grade 8", value: "grade8" },
  { label: "Grade 9", value: "grade9" },
  { label: "Grade 10", value: "grade10" },
  { label: "Grade 11", value: "grade11" },
  { label: "Grade 12", value: "grade12" },
  { label: "Freshman", value: "freshman" },
  { label: "Exit", value: "exit" },
];

export default function AdminResourceForm({ onResourceAdded }) {
  const [form, setForm] = useState({ title: "", category: categories[0].value, file: null });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("category", form.category);
      data.append("file", form.file);
      await API.post("/resources", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ title: "", category: categories[0].value, file: null });
      if (onResourceAdded) onResourceAdded();
    } catch (err) {
      setError("Failed to upload resource.");
    } finally {
      setUploading(false);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <form className="mb-8 space-y-4" onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleFormChange}
          placeholder="Resource Title"
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <div>
        <select
          name="category"
          value={form.category}
          onChange={handleFormChange}
          className="border rounded px-3 py-2 w-full"
          required
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      <div>
        <input
          type="file"
          name="file"
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,image/*"
          onChange={handleFormChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Resource"}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
}
