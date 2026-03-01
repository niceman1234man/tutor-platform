import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function CategoryResources() {
  const { category } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    API.get(`/resources?category=${category}`)
      .then((res) => setResources(res.data))
      .catch(() => setError("Failed to load resources"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">

      <h1 className="text-3xl font-bold text-center text-teal-700 mb-10 capitalize">
        {category.replace("-", " ")} Resources
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : resources.length === 0 ? (
        <p className="text-center text-gray-500">
          No resources found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {resources.map((r) => (
  <div key={r._id} className="bg-white rounded-xl shadow p-6">
    <h3 className="text-lg font-bold text-teal-700 mb-3">{r.title}</h3>
    <h2 className="text-sm text-gray-600 mb-2">{r.department}</h2>

    <a
      href={`https://docs.google.com/viewer?url=${encodeURIComponent(r.fileUrl)}&embedded=true`}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-center bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
    >
      View Resource
    </a>
  </div>
))}
        </div>
      )}
    </div>
  );
}