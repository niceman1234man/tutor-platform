import { useEffect, useState } from "react";
import API from "../api/api";
import TutorCard from "../components/TutorCard";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    API.get("/tutors").then((res) => setTutors(res.data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {tutors.map((t) => (
        <TutorCard key={t._id} tutor={t} />
      ))}
    </div>
  );
}
