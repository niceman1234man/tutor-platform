import React from "react";
export default function Home() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Find the Best Tutors Online
      </h1>
      <p className="mt-4 text-gray-600 mb-8">
        Learn faster with expert tutors. Connect with professionals in every subject and level.
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Personalized Learning</h2>
          <p className="text-gray-500">Get matched with tutors who tailor lessons to your needs and goals.</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Verified Experts</h2>
          <p className="text-gray-500">All tutors are vetted for quality and expertise in their fields.</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Flexible Scheduling</h2>
          <p className="text-gray-500">Book sessions at times that fit your busy life, online or in-person.</p>
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-8">Our Services</h3>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-2">Browse Tutors</h4>
            <p className="text-gray-600">Browse tutors by subject, grade, or expertise.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-2">Detailed Profiles</h4>
            <p className="text-gray-600">View detailed profiles and reviews.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-2">Instant Booking</h4>
            <p className="text-gray-600">Book a session instantly or request a custom plan.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-2">Track Progress</h4>
            <p className="text-gray-600">Start learning and track your progress online.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
