import DashboardLayout from "../../components/DashboardLayout";

export default function AdminDashboard() {
  const links = [
    { to: "#users", label: "Manage" },
    { to: "#tutors", label: "Tutors" },
    { to: "#resources", label: "Resources" },
    { to: "#payments", label: "Payments" },
  ];

  return (
    <DashboardLayout title="Welcome Admin" links={links}>
      {/* content */}
    </DashboardLayout>
  );
}