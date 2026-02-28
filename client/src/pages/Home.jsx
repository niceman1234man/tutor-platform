import React from "react";
import Hero from "../assets/Hero.jpg";
import why from "../assets/why.jpg";
  import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
  import { FaCertificate,FaGraduationCap,FaBook,FaPersonBooth,FaCalculator,FaProjectDiagram } from "react-icons/fa";

export default function Home() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Content */}
          <div className="md:w-1/2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
              Learn. Grow. Succeed with{" "}
             
            </h1>
              <h1 className="text-3xl md:text-4xl font-bold text-teal-600 leading-tight mt-2">
                Skill Nest
              </h1>
            <p className="mt-6 text-gray-600 text-lg">
              Explore expert-led courses and build real-world skills for your future.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
                Explore Courses →
              </button>
              <button className="flex items-center gap-2 text-teal-600 font-medium">
                ▶ Watch Demo
              </button>
            </div>

            {/* Small Features */}
            <div className="flex gap-6 mt-10 text-gray-600">
              <span className="flex items-center gap-2"><FaGraduationCap className="text-teal-600" /> Expert Instructors</span>
              <span className="flex items-center gap-2"><FaBook className="text-teal-600" /> Flexible Learning</span>
              <span className="flex items-center gap-2"><FaCertificate className="text-teal-600" /> Certifications</span>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src={Hero}
              alt="learning"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* ================= POPULAR COURSES ================= */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Popular Courses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">Web Development</h3>
              <p className="text-gray-600 mb-4">
                HTML • CSS • JavaScript
              </p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg">
                Start Course
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">Data Science</h3>
              <p className="text-gray-600 mb-4">
                Python • ML • Analytics
              </p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg">
                Start Course
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">UI/UX Design</h3>
              <p className="text-gray-600 mb-4">
                Figma • Design Thinking
              </p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg">
                Start Course
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          
          {/* Left Image */}
          <div className="md:w-1/2">
            <img
              src={why}
              alt="why choose us"
              className="w-full max-w-md mx-auto"
            />
          </div>

          {/* Right Content */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-8">Why Choose Skill Nest?</h2>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg"> <FaPersonBooth className="text-teal-600 inline mr-2" /> Expert Mentors</h4>
                <p className="text-gray-600">
                  Learn from industry professionals.
                </p>
              </div>
 <hr />
              <div>
                <h4 className="font-semibold text-lg"> <FaProjectDiagram className="text-teal-600 inline mr-2" /> Hands-on Projects</h4>
                <p className="text-gray-600">
                  Build real-world portfolio projects.
                </p>
              </div>
<hr />
              <div>
                <h4 className="font-semibold text-lg"> <FaCalculator className="text-teal-600 inline mr-2" /> Flexible Learning</h4>
                <p className="text-gray-600">
                  Study anytime, anywhere at your own pace.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Students Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <p className="italic">
                "Skill Nest helped me land my first job as a developer!"
              </p>
              <p className="mt-4 font-semibold">— Rohan M.</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <p className="italic">
                "Simple, effective, and well-structured courses."
              </p>
              <p className="mt-4 font-semibold">— Priya S.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
    
<footer className="bg-gray-900 text-gray-300 py-10">
  <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    
    {/* Logo / About */}
    <div>
      <h2 className="text-2xl font-bold text-white">
        Skill <span className="text-teal-500">Nest</span>
      </h2>
      <p className="mt-4 text-gray-400">
        Learn. Grow. Succeed with expert-led courses designed for your future.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:text-teal-500">Courses</a></li>
        <li><a href="#" className="hover:text-teal-500">About</a></li>
        <li><a href="#" className="hover:text-teal-500">Resources</a></li>
        <li><a href="#" className="hover:text-teal-500">Contact</a></li>
      </ul>
    </div>

    {/* Social Media */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
      <div className="flex gap-4">
        <a href="#" className="text-xl hover:text-teal-500">
          <FaFacebook />
        </a>
        <a href="#" className="text-xl hover:text-teal-500">
          <FaTwitter />
        </a>
        <a href="#" className="text-xl hover:text-teal-500">
          <FaLinkedin />
        </a>
        <a href="#" className="text-xl hover:text-teal-500">
          <FaYoutube />
        </a>
      </div>
    </div>

  </div>

  {/* Bottom */}
  <div className="text-center mt-10 border-t border-gray-700 pt-4">
    <p>© 2026 Skill Nest. All rights reserved.</p>
  </div>
</footer>
    </>
  );
}