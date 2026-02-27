import React from "react";

// home page following template design with hero, search bar, features
export default function Home() {
  return (
    <>
      {/* hero/banner */}
      <div
        className="relative bg-cover bg-center h-screen"
        style={{
          backgroundImage: "url('/hero-bg.jpg')" // replace with your image path
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Learn from the Best Tutors Online
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-2xl">
            Easily find verified experts, book sessions, and track your progress—anytime,
            anywhere.
          </p>
          <div className="mt-8 w-full max-w-md flex">
            <input
              type="text"
              placeholder="Search tutors by subject, grade or name"
              className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* features section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                Get matched with tutors who tailor lessons to your needs and goals.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Verified Experts</h3>
              <p className="text-gray-600">
                All tutors are vetted for quality and expertise in their fields.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book sessions at times that fit your busy life, online or in-person.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* services or additional info */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h4 className="text-lg font-semibold mb-2">Browse Tutors</h4>
              <p className="text-gray-600">Browse tutors by subject, grade, or expertise.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h4 className="text-lg font-semibold mb-2">Detailed Profiles</h4>
              <p className="text-gray-600">View detailed profiles and reviews.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h4 className="text-lg font-semibold mb-2">Instant Booking</h4>
              <p className="text-gray-600">Book a session instantly or request a custom plan.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h4 className="text-lg font-semibold mb-2">Track Progress</h4>
              <p className="text-gray-600">Start learning and track your progress online.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
