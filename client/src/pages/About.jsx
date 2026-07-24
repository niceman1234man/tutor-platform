import React from "react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap, FaBullseye, FaUsers, FaChalkboardTeacher,
  FaBook, FaCertificate, FaLightbulb, FaHandshake,
  FaCheckCircle, FaArrowRight,
} from "react-icons/fa";

const values = [
  {
    icon: FaLightbulb,
    color: "bg-amber-50 text-amber-500",
    title: "Innovation",
    desc: "We continuously improve our platform so learners always have access to modern, effective tools.",
  },
  {
    icon: FaHandshake,
    color: "bg-teal-50 text-teal-600",
    title: "Accessibility",
    desc: "Quality education should be within reach of every Ethiopian student regardless of location or background.",
  },
  {
    icon: FaUsers,
    color: "bg-indigo-50 text-indigo-600",
    title: "Community",
    desc: "We connect students with expert tutors to build a thriving learning community across the country.",
  },
  {
    icon: FaCertificate,
    color: "bg-rose-50 text-rose-500",
    title: "Excellence",
    desc: "We hold every piece of content, every tutor, and every exam to the highest academic standards.",
  },
];

const offerings = [
  { icon: FaChalkboardTeacher, label: "Expert Tutors", desc: "Verified, experienced tutors across all subjects and grade levels." },
  { icon: FaBook,              label: "Rich Resources", desc: "Study materials, notes, and reference documents organized by category." },
  { icon: FaCertificate,       label: "Exam Practice",  desc: "Grade 8, Grade 12, University Exit, and Freshman exam archives." },
  { icon: FaGraduationCap,     label: "Courses",        desc: "Structured courses with progress tracking and certificate of completion." },
];

const stats = [
  { value: "500+", label: "Students Enrolled" },
  { value: "50+",  label: "Expert Tutors" },
  { value: "200+", label: "Courses & Resources" },
  { value: "4",    label: "Exam Categories" },
];

export default function About() {
  return (
    <div className="text-gray-800">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-indigo-700 text-white py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-5 tracking-wide">
            About Skill Nest
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Empowering Ethiopian Students to Learn, Grow &amp; Succeed
          </h1>
          <p className="text-lg md:text-xl text-teal-100 leading-relaxed">
            Skill Nest is Ethiopia's dedicated e-learning platform — built to bridge the gap between
            talented students and the quality education they deserve, right from their devices.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-gray-100 py-12 px-6">
        <div className="container mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-teal-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Skill Nest was founded with a single mission: to make high-quality, exam-focused education
              accessible to every Ethiopian student — from grade school through university.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We partner with qualified tutors across the country to deliver live and self-paced courses,
              curated study materials, and a growing library of national exam archives covering Grade 8 Ministry
              exams, Grade 12 University Entrance exams, Freshman assessments, and University Exit exams.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every tutor on Skill Nest goes through a review and approval process to ensure that the guidance
              students receive is accurate, up-to-date, and aligned with the Ethiopian curriculum.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-1 gap-4">
            {[
              "Curriculum-aligned content for Ethiopian students",
              "Verified and approved tutors",
              "Exam archives for all major national exams",
              "Secure, simple payment and enrollment",
              "Progress tracking for every registered course",
              "Admin-managed quality control",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <FaCheckCircle className="text-teal-500 mt-0.5 flex-shrink-0 text-lg" />
                <span className="text-gray-700 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border border-teal-200">
            <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center mb-5">
              <FaBullseye className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-teal-800 mb-3">Our Mission</h3>
            <p className="text-teal-900 leading-relaxed">
              To provide every Ethiopian student with affordable, curriculum-aligned, expert-led education —
              breaking barriers of geography, resource availability, and economic inequality so that every
              learner can reach their full potential.
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mb-5">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-800 mb-3">Our Vision</h3>
            <p className="text-indigo-900 leading-relaxed">
              To become Ethiopia's most trusted and widely used e-learning platform — a place where students
              excel in national exams, tutors grow their reach, and families invest confidently in education
              that delivers real results.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What We Offer</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything a student needs to prepare, practice, and perform — in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerings.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition"
              >
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                  <Icon className="text-2xl text-teal-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{label}</h4>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Core Values</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              The principles that guide every decision we make at Skill Nest.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex gap-5 items-start bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-r from-teal-600 to-indigo-600 text-white text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-teal-100 mb-8 text-lg">
            Join hundreds of students already building their future with Skill Nest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition flex items-center justify-center gap-2"
            >
              Get Started Free <FaArrowRight />
            </Link>
            <Link
              to="/exams/list"
              className="border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Browse Exams
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
