import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function TutorDetails() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    API.get(`/tutors/${id}`).then(res => setTutor(res.data));
  }, [id]);

  const handleBooking = async () => {
    try {
      await API.post("/bookings", {
        tutorId: id,
        date,
        duration
      });
      alert("Booking request sent!");
    } catch (err) {
      alert("Error booking tutor");
    }
  };

  if (!tutor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* Tutor Info */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-3xl font-bold">{tutor.userId.name}</h1>
        <p className="text-gray-600 mt-2">{tutor.bio}</p>

        <div className="mt-4">
          <p><strong>Subjects:</strong> {tutor.subjects.join(", ")}</p>
          <p><strong>Grades:</strong> {tutor.grades.join(", ")}</p>
          <p><strong>Price:</strong> ${tutor.pricePerHour}/hour</p>
          <p><strong>Rating:</strong> ⭐ {tutor.rating || 0}</p>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Book a Session</h2>

        <input
          type="datetime-local"
          className="w-full border p-2 mb-3 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="number"
          min="1"
          className="w-full border p-2 mb-3 rounded"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={handleBooking}
        >
          Book Now
        </button>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>

        {tutor.reviews?.length > 0 ? (
          tutor.reviews.map((r) => (
            <div key={r._id} className="border-b py-3">
              <p>⭐ {r.rating}</p>
              <p>{r.comment}</p>
              <p className="text-sm text-gray-500">
                - {r.studentId?.name}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </div>
    </div>
  );
}