
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../api/api";


export default function AdminDashboard() {
  const links = [
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/manage-tutors", label: "Tutors" },
    { to: "/admin/resources", label: "Resources" },
    { to: "/admin/payments", label: "Payments" },
  ];

  const [numStudents, setNumStudents] = useState(0);
  const [numTutors, setNumTutors] = useState(0);
  const [numCourses, setNumCourses] = useState(0);

  useEffect(() => {
    // Fetch users (students)
    API.get("/admin/users")
      .then((res) => {
        // Count only users with role 'user' (students)
        const students = Array.isArray(res.data)
          ? res.data.filter((u) => u.role === "student")
          : [];
        setNumStudents(students.length);
      })
      .catch(() => setNumStudents(0));

    // Fetch tutors
    API.get("/admin/users")
      .then((res) => {
        // Count only users with role 'tutor'
        const tutors = Array.isArray(res.data)
          ? res.data.filter((u) => u.role === "tutor")
          : [];
        setNumTutors(tutors.length);
      })
      .catch(() => setNumTutors(0));

    // Fetch courses
    API.get("/courses")
      .then((res) => {
        setNumCourses(Array.isArray(res.data) ? res.data.length : 0);
      })
      .catch(() => setNumCourses(0));
  }, []);

  return (
    <DashboardLayout
      title="Welcome Admin"
      links={links}
      numStudents={numStudents}
      numTutors={numTutors}
      numCourses={numCourses}
    >
      {/* content */}
    </DashboardLayout>
  );
}