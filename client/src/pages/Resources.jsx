
import React, { useState, useEffect } from "react";
import API from "../api/api";

const categories = [
  { label: "All", value: "all" },
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


export default function Resources({ refreshKey }) {
  const [selected, setSelected] = useState(categories[0].value);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    API.get(`/resources`)
      .then(res => setResources(res.data))
      .catch(() => setError("Failed to load resources."))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filteredResources = selected === "all" ? resources : resources.filter(r => r.category === selected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Resource Library</h2>
        <div className="flex mb-8">
          <div className="w-1/4 pr-6">
            <label className="block mb-2 font-semibold text-blue-700">Category</label>
            <select
              value={selected}
              onChange={e => setSelected(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="w-3/4">
            {/* Resource list will render here */}
          </div>
        </div>
        <div>
          {loading ? (
            <p className="text-center text-gray-500">Loading resources...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredResources.length === 0 ? (
            <p className="text-center text-gray-500">No resources for this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredResources.map((r) => (
                <div key={r._id} className="bg-blue-50 rounded-xl shadow p-6 flex flex-col justify-between h-full">
                  <div>
                    <span className="font-bold text-lg text-blue-700 block mb-2">{r.title}</span>
                    <span className="text-sm text-gray-500 mb-4 block">{categories.find(c => c.value === r.category)?.label}</span>
                  </div>
                  <a
                    href={r.fileUrl || r.link}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-semibold text-center hover:bg-blue-700 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resource
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
