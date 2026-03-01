import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

export default function AdminDashboard() {
  const links = [
    { to: "/admin/users", label: "Manage" },
    { to: "/admin/tutors", label: "Tutors" },
    { to: "/admin/resources", label: "Resources" },
    { to: "/admin/payments", label: "Payments" },
  ];

  return (
    <DashboardLayout title="Welcome Admin" links={links}>
      {/* content */}
    </DashboardLayout>
  );
}