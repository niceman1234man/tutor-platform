import React from "react";

export default function Home() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Content */}
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Learn. Grow. Succeed with{" "}
              <span className="text-teal-600">Skill Nest</span>
            </h1>
            <p className="mt-6 text-gray-600 text-lg">
              Explore expert-led courses and build real-world skills for your future.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700">
                Explore Courses →
              </button>
              <button className="flex items-center gap-2 text-teal-600 font-medium">
                ▶ Watch Demo
              </button>
            </div>

            {/* Small Features */}
            <div className="flex gap-6 mt-10 text-gray-600">
              <span>✔ Expert Instructors</span>
              <span>✔ Flexible Learning</span>
              <span>✔ Certifications</span>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="/hero-image.png"
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
              src="/why-us.png"
              alt="why choose us"
              className="w-full max-w-md mx-auto"
            />
          </div>

          {/* Right Content */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-8">Why Choose Skill Nest?</h2>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg">Expert Mentors</h4>
                <p className="text-gray-600">
                  Learn from industry professionals.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg">Hands-on Projects</h4>
                <p className="text-gray-600">
                  Build real-world portfolio projects.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg">Flexible Learning</h4>
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
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p>© 2026 Skill Nest. All rights reserved.</p>
      </footer>
    </>
  );
}