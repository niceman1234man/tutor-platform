import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Resources from "./pages/Resources";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/student/Dashboard";
import TutorDashboard from "./pages/tutor/Dashboard";
import Profile from "./pages/tutor/Profile";

import StudentDashboard from "./pages/student/Dashboard";
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
import CourseProgress from "./pages/student/CourseProgress";
import RegisteredCourses from "./pages/student/RegisteredCourses";
import AssignStudent from "./pages/admin/AssignStudent";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/resources" element={<AdminResourceForm />} />
        <Route path="/admin/tutors" element={<AdminTutors />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/manage-tutors" element={<ManageTutor />} />
        <Route path="/admin/assign-student" element={<AssignStudent />} />
        <Route path="/admin/tutors-materials" element={<TutorsMaterials />} />
        <Route path="/admin/tutors/:id" element={<AdminTutorDetail />} />
        <Route path="/resources/:category" element={<CategoryResources />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/tutor" element={<TutorDashboard />} />
        <Route path="/tutor/mycourses" element={<Course />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tutors/:id" element={<TutorDetails />} />
   
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/payments" element={<Payments />} />
        <Route path="/student/progress" element={<CourseProgress />} />
        <Route path="/student/courses" element={<RegisteredCourses />} />
        <Route path="/admin/users" element={<User />} />
        <Route path="/tutor/applications" element={<ApplicationForm />} />
        <Route path="/tutor/my-applications" element={<MyApplications />} />
      
      </Routes>
   </>
  );
}

export default App;
