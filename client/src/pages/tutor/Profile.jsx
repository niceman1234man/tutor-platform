import React from "react";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  // Support user object with nested user property
  const userInfo = user && user.user ? user.user : user;

  if (!userInfo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100">
        <div className="p-8 max-w-xl mx-auto bg-white/90 rounded-2xl shadow-2xl text-center">
          <div className="flex flex-col items-center mb-4">
            <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <h2 className="text-2xl font-bold mb-2">Tutor Profile</h2>
          </div>
          <p className="text-gray-600">
            Loading profile... Please log in if you haven't.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100">
      <div className="p-10 max-w-xl mx-auto bg-white/95 rounded-3xl shadow-2xl w-full">
        <div className="flex flex-col items-center mb-6">
          <svg className="w-16 h-16 text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <h2 className="text-3xl font-extrabold mb-1 text-slate-900">Tutor Profile</h2>
          <span className="text-teal-600 font-medium text-lg">Welcome, {userInfo.name}!</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 w-24">Name:</span>
            <span className="text-gray-900">{userInfo.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 w-24">Email:</span>
            <span className="text-gray-900">{userInfo.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 w-24">Role:</span>
            <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">{userInfo.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}