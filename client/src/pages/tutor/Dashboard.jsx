import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
export default function TutorDashboard() {
  const links = [
    { to: "/tutor/mycourses", label: "My Courses" },
    { to: "/tutor/students", label: "Students" },
    { to: "/tutor/earnings", label: "Earnings" },
    { to: "/tutor/my-applications", label: "My Applications" },
  ];

  return (
    <DashboardLayout title="Welcome Tutor" links={links}>
      {/* tutor content */}
    </DashboardLayout>
  );
}