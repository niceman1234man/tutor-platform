import React from "react";


export default function ManageTutor() {
 
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Tutor</h1>
 <a href="/admin/tutors/" className="block mb-2 text-blue-500 hover:underline">Tutor Applicatios</a>
 <a href="/admin/tutors-materials" className="block text-blue-500 hover:underline">Tutor Materials</a>
    </div>
  );
}