import React from "react";

export default function ManageTutor() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Manage Tutor</h1>

        <p className="mb-8 text-slate-600">
          Quick links for tutor workflows. Click one to manage applications or materials.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/admin/tutors/"
            className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-4 text-center text-blue-700 transition hover:bg-blue-100 hover:text-blue-900"
          >
            Tutor Applications
          </a>

          <a
            href="/admin/tutors-materials"
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-4 text-center text-indigo-700 transition hover:bg-indigo-100 hover:text-indigo-900"
          >
            Tutor Materials
          </a>
          <a
            href="/admin/assign-student"
            className="rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-center text-green-700 transition hover:bg-green-100 hover:text-green-900"
          >
            Assign Student
          </a>
          <a
            href="/admin/payments"
            className="rounded-xl border border-teal-200 bg-teal-50 px-6 py-4 text-center text-teal-700 transition hover:bg-teal-100 hover:text-teal-900"
          >
            Payments
          </a>
        </div>
      </div>
    </div>
  );
}