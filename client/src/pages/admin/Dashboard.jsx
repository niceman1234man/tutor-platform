import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Users from "./Users";
import Payments from "./Payments";
import Tutors from "./Tutors";
import AdminResourceForm from "./AdminResourceForm";

export default function AdminDashboard() {
  const links = [
    { to: "#users", label: "Users" },
    { to: "#tutors", label: "Tutors" },
    { to: "#payments", label: "Payments" },
    { to: "#resources", label: "Resources" },
  ];

  return (
    <DashboardLayout>
      <div links={links}>
        <section id="users" className="mb-6">
          <Users />
        </section>

        <section id="tutors" className="mb-6">
          <Tutors />
        </section>

        <section id="resources" className="mb-6">
          <AdminResourceForm />
        </section>

        <section id="payments">
          <Payments />
        </section>
      </div>
    </DashboardLayout>
  );
}
