import React from "react";
import { useEffect, useState } from "react";
import TutorCard from "../components/TutorCard";
import demoTutors from "../data/demoTutors";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      setTutors(demoTutors);
    }, 500);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {tutors.map((t) => (
        <TutorCard key={t._id} tutor={t} />
      ))}
    </div>
  );
}