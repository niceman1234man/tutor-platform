import { useNavigate } from "react-router-dom";

export default function TutorCard({ tutor }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tutors/${tutor._id}`)}
      className="bg-white border p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition flex flex-col"
    >
      <h3 className="text-xl font-bold mb-1">{tutor.userId.name}</h3>
      <p className="text-gray-600 mb-2">{tutor.bio}</p>
      <p className="mb-2"><span className="font-semibold">Subjects:</span> {tutor.subjects?.join(", ")}</p>
      <p className="mb-2"><span className="font-semibold">Price:</span> ${tutor.pricePerHour} / hour</p>
      <p className="mb-2">⭐ {tutor.rating || 0}</p>
      <button
        className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={e => {
          e.stopPropagation();
          navigate(`/tutors/${tutor._id}`);
        }}
      >
        View Details
      </button>
    </div>
  );
}