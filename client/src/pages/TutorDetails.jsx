import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import demoTutors from "../data/demoTutors";
export default function TutorDetails() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    // ✅ Find tutor from demo data
    const foundTutor = demoTutors.find((t) => t._id === id);
    setTutor(foundTutor);
  }, [id]);

  const handleBooking = () => {
    alert(
      `✅ Booking Confirmed!\nTutor: ${tutor.userId.name}\nDate: ${date}\nDuration: ${duration} hour(s)`
    );
  };

  if (!tutor)
    return <p className="text-center mt-10 text-gray-500">Tutor not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT SIDE */}
      <div className="md:col-span-2 space-y-6">

        {/* Profile */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-4">
            <img
              src={tutor.profileImage}
              alt="tutor"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{tutor.userId.name}</h1>
              <p className="text-gray-500">
                ⭐ {tutor.rating} • {tutor.reviews?.length || 0} reviews
              </p>
            </div>
          </div>

          <p className="mt-4 text-gray-600">{tutor.bio}</p>
        </div>

        {/* Details */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Tutor Details</h2>

          <p><strong>Subjects:</strong> {tutor.subjects.join(", ")}</p>
         
          <p>
            <strong>Price:</strong>{" "}
            <span className="text-teal-700 font-semibold">
              ${tutor.pricePerHour}/hour
            </span>
          </p>
        </div>

        {/* Reviews */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>

          {tutor.reviews?.length > 0 ? (
            tutor.reviews.map((r) => (
              <div key={r._id} className="border p-3 rounded mb-3 bg-gray-50">
                <p>⭐ {r.rating}</p>
                <p>{r.comment}</p>
                <p className="text-sm text-gray-500">
                  — {r.studentId?.name || "Anonymous"}
                </p>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </div>

     {/* RIGHT SIDE */}
<div className="bg-white p-6 rounded-2xl shadow h-fit sticky top-6">
  <h2 className="text-xl font-bold mb-4">Get This Tutor</h2>

  {/* Price */}
  <p className="text-2xl font-bold text-teal-700 mb-4">
    ${tutor.pricePerHour} / hour
  </p>

  

  {/* Add to Cart */}
  <button
    className="w-full border border-teal-600 text-teal-700 p-3 rounded mb-3 hover:bg-teal-50 transition"
    onClick={() => {
      console.log("Added to cart:", tutor._id);
      alert("Added to cart!");
    }}
  >
    Add to Cart
  </button>

  {/* Buy Now */}
  <button
    className="w-full bg-teal-600 text-white p-3 rounded hover:bg-teal-700 transition"
    onClick={() => {
      handleBooking(); // reuse your booking logic
    }}
  >
    Buy Now
  </button>
</div>
    </div>
  );
}