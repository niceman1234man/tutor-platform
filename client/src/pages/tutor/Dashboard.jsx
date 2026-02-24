import React from "react"
import DashboardLayout from "../../components/DashboardLayout";
import Profile from "./Profile";
import Requests from "./Requests";
import FollowUps from "./FollowUps";

export default function TutorDashboard() {
  const links = [
    { to: "#profile", label: "My Profile" },
    { to: "#requests", label: "Booking Requests" },
    { to: "#followups", label: "Follow-ups" },
  ];

  return (
    <DashboardLayout>
      <div links={links}>
        <section id="profile" className="mb-6">
          <Profile />
        </section>

        <section id="requests" className="mb-6">
          <Requests />
        </section>

        <section id="followups">
          <FollowUps />
        </section>
      </div>
    </DashboardLayout>
  );
}
