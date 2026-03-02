import React from "react";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 max-w-xl mx-auto bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Tutor Profile</h2>
        <p className="text-gray-600">
          Loading profile... Please log in if you haven't.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Tutor Profile</h2>
      <div className="mb-2">
        <span className="font-semibold">Name:</span> {user.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Email:</span> {user.email}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Role:</span> {user.role}
      </div>
    </div>
  );
}