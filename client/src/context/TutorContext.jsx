import React, { createContext, useState } from "react";

export const TutorContext = createContext();

export const TutorProvider = ({ children }) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <TutorContext.Provider value={{ tutors, setTutors, loading, setLoading, error, setError }}>
      {children}
    </TutorContext.Provider>
  );
}
