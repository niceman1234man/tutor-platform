import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Bookings from "./Bookings";
import FollowUps from "./FollowUps";

export default function StudentDashboard() {
  const links = [
    { to: "#bookings", label: "My Bookings" },
    { to: "#followups", label: "Follow-ups" },
  ];

  return (
    <DashboardLayout>
      <div links={links}>
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        <section id="bookings" className="mb-6">
          <Bookings />
        </section>

        <section id="followups">
          <FollowUps />
        </section>
      </div>
    </DashboardLayout>
  );
}
