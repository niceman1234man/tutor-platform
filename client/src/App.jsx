import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Resources from "./pages/Resources";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import TutorDashboard from "./pages/tutor/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import Profile from "./pages/tutor/Profile";
import AssignedStudents from "./pages/tutor/AssignedStudents";
import CategoryResources from "./components/CatagoryResources";
import TutorDetails from "./pages/TutorDetails";
import AdminResourceForm from "./pages/admin/AdminResourceForm";
import User from "./pages/admin/Users";
import ApplicationForm from "./pages/tutor/ApplicationForm";
import MyApplications from "./pages/tutor/MyApplications";
import AdminTutors from "./pages/admin/Tutors";
import Tutors from "./pages/Tutors";
import Course from "./pages/tutor/Course";
import TutorsMaterials from "./pages/admin/TutorsMaterials";
import ManageTutor from "./pages/admin/ManageTutor";
import AdminTutorDetail from "./pages/admin/TutorDetail";
import Payments from "./pages/student/Payments";
import AdminPayments from "./pages/admin/Payments";
import AdminContacts from "./pages/admin/Contacts";
import CourseProgress from "./pages/student/CourseProgress";
import RegisteredCourses from "./pages/student/RegisteredCourses";
import AssignStudent from "./pages/admin/AssignStudent";
import AdminExamForm from "./pages/admin/ExamForm";
import ListOfExams from "./pages/admin/ListOfExams";
import ExamDetail from "./pages/ExamDetail";
import AdminExamManager from "./pages/admin/ManageExam";
import AdminLayout from "./layouts/AdminLayout";
import TutorLayout from "./layouts/TutorLayout";
import StudentLayout from "./layouts/StudentLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const DASHBOARD_PREFIXES = ["/admin", "/tutor", "/student", "/user"];

function AppContent() {
  const location = useLocation();
  const isDashboard = DASHBOARD_PREFIXES.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:category" element={<CategoryResources />} />
        <Route path="/tutors/:id" element={<TutorDetails />} />
        <Route path="/exams/list" element={<ListOfExams />} />
        <Route path="/exam/:id" element={<ExamDetail />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin routes — persistent sidebar */}
        <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<User />} />
          <Route path="/admin/resources" element={<AdminResourceForm />} />
          <Route path="/admin/exams" element={<AdminExamForm />} />
          <Route path="/admin/manage-exams" element={<AdminExamManager />} />
          <Route path="/admin/tutors" element={<AdminTutors />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/manage-tutors" element={<ManageTutor />} />
          <Route path="/admin/assign-student" element={<AssignStudent />} />
          <Route path="/admin/tutors-materials" element={<TutorsMaterials />} />
          <Route path="/admin/tutors/:id" element={<AdminTutorDetail />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
        </Route>

        {/* Tutor routes — persistent sidebar */}
        <Route element={<ProtectedRoute role="tutor"><TutorLayout /></ProtectedRoute>}>
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/tutor/mycourses" element={<Course />} />
          <Route path="/tutor/students" element={<AssignedStudents />} />
          <Route path="/tutor/applications" element={<ApplicationForm />} />
          <Route path="/tutor/my-applications" element={<MyApplications />} />
        </Route>

        {/* Student routes — persistent sidebar */}
        <Route element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<RegisteredCourses />} />
          <Route path="/student/progress" element={<CourseProgress />} />
          <Route path="/student/payments" element={<Payments />} />
          <Route path="/user" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppContent;
