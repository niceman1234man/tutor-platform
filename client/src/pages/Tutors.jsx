import React from "react";
import { useEffect, useState } from "react";
import TutorCard from "../components/TutorCard";
import demoTutors from "../data/demoTutors";
import API from "../api/api";
import { useContext } from "react";
import { TutorContext } from "../context/TutorContext";

export default function Tutors() {
  // const { tutors, setTutors } = useContext(TutorContext);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
  const fetchTutors = async () => {
    try {
      const res = await API.get("/courses");
      console.log(res.data);
      setTutors(res.data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  fetchTutors();
}, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">

      { tutors.length > 0 ? tutors.map((t) => (
        <TutorCard key={t._id} tutor={t} />
      )) : (
        <p>No courses found.</p>
      )}
    </div>
  );
}