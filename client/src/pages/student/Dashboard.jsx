
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import RegisteredCourses from "./RegisteredCourses";
import CourseProgress from "./CourseProgress";
import Payments from "./Payments";


export default function StudentDashboard() {
  const links = [
    { to: "/student/courses", label: "My Courses" },
    { to: "/student/progress", label: "Progress" },
    { to: "/student/payments", label: "Payments" },
  ];

  return (
    <DashboardLayout title="Welcome Student" links={links}>
     
    </DashboardLayout>
  );
}