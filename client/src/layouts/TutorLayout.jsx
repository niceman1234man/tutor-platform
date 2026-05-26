import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const links = [
  { to: "/tutor", label: "Dashboard" },
  { to: "/tutor/mycourses", label: "My Courses" },
  { to: "/tutor/students", label: "Students" },
  { to: "/tutor/my-applications", label: "My Applications" },
  { to: "/tutor/applications", label: "Apply as Tutor" },
];

export default function TutorLayout() {
  return (
    <DashboardLayout links={links} title="Tutor Panel">
      <Outlet />
    </DashboardLayout>
  );
}
