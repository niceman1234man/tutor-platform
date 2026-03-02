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

      <div className="">

        {/* ===== SIDEBAR ===== */}
        <aside className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10 max-w-4xl mx-auto">
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

          

          {children}
        </main>

      </div>
    </div>
  );
}