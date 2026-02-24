import React, { useState } from "react";
import AdminResourceForm from "./AdminResourceForm";
import Resources from "../Resources";

export default function AdminResources() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-blue-700">Manage Resources</h3>
      <AdminResourceForm onResourceAdded={() => setRefreshKey(k => k + 1)} />
      <Resources refreshKey={refreshKey} />
    </div>
  );
}
