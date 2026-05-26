import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import API from "../api/api";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Manage Users" },
  { to: "/admin/manage-tutors", label: "Tutors" },
  { to: "/admin/resources", label: "Resources" },
  { to: "/admin/exams", label: "Exams" },
  { to: "/admin/payments", label: "Payments" },
];

export default function AdminLayout() {
  const [numStudents, setNumStudents] = useState(0);
  const [numTutors, setNumTutors] = useState(0);
  const [numCourses, setNumCourses] = useState(0);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNumStudents(res.data.filter((u) => u.role === "student").length);
          setNumTutors(res.data.filter((u) => u.role === "tutor").length);
        }
      })
      .catch(() => {});
    API.get("/courses")
      .then((res) => setNumCourses(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout
      links={links}
      title="Admin Panel"
      numStudents={numStudents}
      numTutors={numTutors}
      numCourses={numCourses}
    >
      <Outlet />
    </DashboardLayout>
  );
}
