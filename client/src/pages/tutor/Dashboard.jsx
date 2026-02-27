import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
export default function TutorDashboard() {
  const links = [
    { to: "#mycourses", label: "My Courses" },
    { to: "#students", label: "Students" },
    { to: "#earnings", label: "Earnings" },
  ];

  return (
    <DashboardLayout title="Welcome Tutor" links={links}>
      {/* tutor content */}
    </DashboardLayout>
  );
}