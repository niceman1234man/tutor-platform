import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Manage Users" },
  { to: "/admin/manage-tutors", label: "Tutors" },
  { to: "/admin/resources", label: "Resources" },
  { to: "/admin/exams", label: "Exams" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/contacts", label: "Contacts" },
];

export default function AdminLayout() {
  return (
    <DashboardLayout links={links} title="Admin Panel">
      <Outlet />
    </DashboardLayout>
  );
}
