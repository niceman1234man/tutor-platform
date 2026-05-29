import React, { useEffect, useRef } from "react";
import { FaTimes, FaVideo, FaExternalLinkAlt } from "react-icons/fa";

export default function LiveClassRoom({ course, role, onClose }) {
  const roomName = `EduLink-${course._id}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}`;
  const containerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-teal-700 to-teal-500 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="bg-white/20 p-2 rounded-lg">
            <FaVideo className="text-white text-lg" />
          </span>
          <div className="min-w-0">
            <p className="text-white font-bold text-base truncate">{course.title}</p>
            <p className="text-teal-100 text-xs">
              {role === "tutor" ? "You are hosting this class" : "You are attending this class"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={jitsiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-lg transition"
          >
            <FaExternalLinkAlt className="text-xs" /> Open in new tab
          </a>
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg font-semibold transition shadow"
          >
            <FaTimes /> {role === "tutor" ? "End Class" : "Leave"}
          </button>
        </div>
      </div>

      {/* Jitsi iframe */}
      <div ref={containerRef} className="flex-1 relative">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="absolute inset-0 w-full h-full border-0"
          title={`Live class: ${course.title}`}
        />
      </div>
    </div>
  );
}
