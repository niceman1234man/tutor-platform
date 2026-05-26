import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const links = [
  { to: "/student", label: "Dashboard" },
  { to: "/student/courses", label: "My Courses" },
  { to: "/student/progress", label: "Progress" },
  { to: "/student/payments", label: "Payments" },
];

export default function StudentLayout() {
  return (
    <DashboardLayout links={links} title="Student Panel">
      <Outlet />
    </DashboardLayout>
  );
}
