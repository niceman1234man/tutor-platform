import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
export default function StudentDashboard() {
  const links = [
    { to: "#courses", label: "My Courses" },
    { to: "#progress", label: "Progress" },
    { to: "#payments", label: "Payments" },
  ];

  return (
    <DashboardLayout title="Welcome Student" links={links}>
      {/* student content */}
    </DashboardLayout>
  );
}