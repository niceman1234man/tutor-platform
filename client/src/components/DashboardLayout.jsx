import React from "react";

export default function DashboardLayout({
  children,
  links = [],
  title = "Dashboard",
}) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-10 py-4 bg-white shadow">
        
       

        {/* Dynamic Title */}
        <h2 className="text-xl font-semibold text-gray-700">
          {title}
        </h2>

        {/* Notification */}
        <div className="text-2xl cursor-pointer">
          🔔
        </div>
      </div>

      <div className="flex">

        {/* ===== SIDEBAR ===== */}
        <aside className="w-64 p-6 space-y-6">
          {links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="block bg-teal-600 text-white text-center py-4 rounded-full shadow hover:bg-teal-700 transition"
            >
              {link.label}
            </a>
          ))}
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-10">

          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <div className="flex w-full max-w-xl border-2 border-black rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-6 py-3 outline-none"
              />
              <button className="px-8 text-green-600 font-semibold">
                Search
              </button>
            </div>
          </div>

          {children}
        </main>

      </div>
    </div>
  );
}