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
import Booking from "./pages/student/Bookings";
import StudentDashboard from "./pages/student/Dashboard";
import CategoryResources from "./components/CatagoryResources";
import TutorDetails from "./pages/TutorDetails";
import AdminResourceForm from "./pages/admin/AdminResourceForm";
import User from "./pages/admin/Users";


import Tutors from "./pages/Tutors";

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/resources/:category" element={<CategoryResources />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/tutor" element={<TutorDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tutors/:id" element={<TutorDetails />} />
        <Route path="/booking/:tutorId" element={<Booking />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin/users" element={<User />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
