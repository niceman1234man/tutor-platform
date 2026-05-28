import React, { useState, useEffect, useRef, useContext } from "react";
import { FaBell, FaCheckDouble, FaCheck } from "react-icons/fa";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function NotificationBell() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = () => {
    if (!user?.token) return;
    API.get("/notifications", { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, [user]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markOne = async (id) => {
    await API.patch(`/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${user.token}` } }).catch(() => {});
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
  };

  const markAll = async () => {
    await API.patch("/notifications/read-all", {}, { headers: { Authorization: `Bearer ${user.token}` } }).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const typeColor = (type) => {
    if (type === "success") return "border-l-green-500 bg-green-50";
    if (type === "warning") return "border-l-red-400 bg-red-50";
    return "border-l-blue-400 bg-blue-50";
  };

  const typeIcon = (type) => {
    if (type === "success") return "✅";
    if (type === "warning") return "❌";
    return "ℹ️";
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-gray-500 hover:text-teal-600 transition-colors duration-200"
      >
        <FaBell className="text-2xl" />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
            <span className="font-bold text-sm flex items-center gap-2">
              <FaBell /> Notifications {unread > 0 && <span className="bg-white text-teal-700 text-xs px-1.5 py-0.5 rounded-full font-bold">{unread}</span>}
            </span>
            {unread > 0 && (
              <button onClick={markAll} className="text-xs flex items-center gap-1 hover:underline opacity-90">
                <FaCheckDouble /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`px-4 py-3 border-l-4 flex items-start gap-3 ${typeColor(n.type)} ${n.read ? "opacity-60" : ""}`}
                >
                  <span className="text-base mt-0.5">{typeIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? "text-gray-500" : "text-gray-800 font-medium"}`}>{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => markOne(n._id)} className="text-teal-500 hover:text-teal-700 mt-0.5 flex-shrink-0" title="Mark as read">
                      <FaCheck className="text-xs" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
