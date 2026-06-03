import React, { useEffect, useState } from "react";
import API from "../../api/api";
import {
  FaPhone, FaEnvelope, FaWhatsapp, FaTelegram, FaFacebook,
  FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok,
  FaGlobe, FaLink, FaPlus, FaEdit, FaTrash, FaToggleOn,
  FaToggleOff, FaSave, FaTimes, FaAddressBook, FaGripVertical,
} from "react-icons/fa";

const PLATFORMS = [
  { value: "phone",     label: "Phone",     icon: <FaPhone />,     color: "text-green-600",  bg: "bg-green-100" },
  { value: "email",     label: "Email",     icon: <FaEnvelope />,  color: "text-blue-600",   bg: "bg-blue-100" },
  { value: "whatsapp",  label: "WhatsApp",  icon: <FaWhatsapp />,  color: "text-green-500",  bg: "bg-green-50" },
  { value: "telegram",  label: "Telegram",  icon: <FaTelegram />,  color: "text-sky-500",    bg: "bg-sky-100" },
  { value: "facebook",  label: "Facebook",  icon: <FaFacebook />,  color: "text-blue-700",   bg: "bg-blue-100" },
  { value: "instagram", label: "Instagram", icon: <FaInstagram />, color: "text-pink-600",   bg: "bg-pink-100" },
  { value: "twitter",   label: "X/Twitter", icon: <FaTwitter />,   color: "text-gray-800",   bg: "bg-gray-100" },
  { value: "linkedin",  label: "LinkedIn",  icon: <FaLinkedin />,  color: "text-blue-600",   bg: "bg-blue-100" },
  { value: "youtube",   label: "YouTube",   icon: <FaYoutube />,   color: "text-red-600",    bg: "bg-red-100" },
  { value: "tiktok",    label: "TikTok",    icon: <FaTiktok />,    color: "text-gray-900",   bg: "bg-gray-100" },
  { value: "website",   label: "Website",   icon: <FaGlobe />,     color: "text-teal-600",   bg: "bg-teal-100" },
  { value: "other",     label: "Other",     icon: <FaLink />,      color: "text-gray-500",   bg: "bg-gray-100" },
];

const platformMeta = (value) =>
  PLATFORMS.find((p) => p.value === value) || PLATFORMS[PLATFORMS.length - 1];

const EMPTY_FORM = { platform: "phone", label: "", value: "", isActive: true, order: 0 };

function PlatformIcon({ platform, size = "text-lg" }) {
  const meta = platformMeta(platform);
  return (
    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${meta.bg} ${meta.color} ${size} flex-shrink-0`}>
      {meta.icon}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ContactForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      {/* Platform picker */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Platform</label>
        <div className="grid grid-cols-4 gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => set("platform", p.value)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition text-xs font-semibold ${
                form.platform === p.value
                  ? `border-teal-500 ${p.bg} ${p.color}`
                  : "border-gray-100 hover:border-gray-200 text-gray-500"
              }`}
            >
              <span className={`text-lg ${form.platform === p.value ? p.color : "text-gray-400"}`}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Label <span className="text-gray-300">(optional)</span></label>
        <input
          type="text"
          placeholder='e.g. "Support", "Main Office"'
          value={form.label}
          onChange={(e) => set("label", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      </div>

      {/* Value */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
          {form.platform === "phone" || form.platform === "whatsapp" ? "Phone Number" :
           form.platform === "email" ? "Email Address" :
           ["website","youtube","facebook","instagram","twitter","linkedin","tiktok","telegram"].includes(form.platform) ? "URL / Handle" :
           "Value"} *
        </label>
        <input
          type={form.platform === "email" ? "email" : "text"}
          placeholder={
            form.platform === "phone" || form.platform === "whatsapp" ? "+251 9XX XXX XXX" :
            form.platform === "email" ? "contact@example.com" :
            "https://..."
          }
          value={form.value}
          onChange={(e) => set("value", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          required
        />
      </div>

      {/* Order + Active row */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Display Order</label>
          <input
            type="number"
            min="0"
            value={form.order}
            onChange={(e) => set("order", Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
          <button
            type="button"
            onClick={() => set("isActive", !form.isActive)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition ${
              form.isActive
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-gray-200 bg-gray-50 text-gray-500"
            }`}
          >
            {form.isActive ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
            {form.isActive ? "Active" : "Inactive"}
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 font-semibold transition text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.value.trim()}
          className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2"
        >
          <FaSave /> {saving ? "Saving…" : "Save Contact"}
        </button>
      </div>
    </div>
  );
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showAdd, setShowAdd]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch]     = useState("");
  const [platformFilter, setPlatformFilter] = useState("");

  const load = async () => {
    try {
      const res = await API.get("/contacts");
      setContacts(res.data || []);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (form) => {
    setSaving(true);
    try {
      const res = await API.post("/contacts", form);
      setContacts((prev) => [...prev, res.data]);
      setShowAdd(false);
    } catch {
      alert("Failed to add contact.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const res = await API.put(`/contacts/${editing._id}`, form);
      setContacts((prev) => prev.map((c) => (c._id === editing._id ? res.data : c)));
      setEditing(null);
    } catch {
      alert("Failed to update contact.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await API.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete contact.");
    } finally {
      setDeleting(null);
      setConfirmDel(null);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await API.patch(`/contacts/${id}/toggle`);
      setContacts((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    } catch {
      alert("Failed to toggle status.");
    }
  };

  const filtered = contacts.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      c.value.toLowerCase().includes(q) ||
      (c.label || "").toLowerCase().includes(q) ||
      c.platform.toLowerCase().includes(q);
    const matchPlatform = !platformFilter || c.platform === platformFilter;
    return matchSearch && matchPlatform;
  });

  const grouped = PLATFORMS.reduce((acc, p) => {
    const items = filtered.filter((c) => c.platform === p.value);
    if (items.length) acc[p.value] = items;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold text-teal-700 flex items-center gap-2">
          <FaAddressBook /> Contact Management
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow transition text-sm"
        >
          <FaPlus /> Add Contact
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total",    value: contacts.length,                          color: "text-teal-600",  bg: "bg-teal-50"  },
          { label: "Active",   value: contacts.filter((c) => c.isActive).length, color: "text-green-600", bg: "bg-green-50" },
          { label: "Inactive", value: contacts.filter((c) => !c.isActive).length,color: "text-gray-500",  bg: "bg-gray-50"  },
          { label: "Platforms",value: new Set(contacts.map((c) => c.platform)).size, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 border border-gray-100`}>
            <p className="text-xs font-semibold text-gray-400 uppercase">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex flex-wrap gap-3 items-center mb-5">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <input
            type="text"
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-red-400 text-xs">✕</button>}
        </div>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="">All platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        {(search || platformFilter) && (
          <button
            onClick={() => { setSearch(""); setPlatformFilter(""); }}
            className="text-sm text-red-500 hover:text-red-700 font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Contact list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaAddressBook className="text-5xl mx-auto mb-3 text-gray-200" />
          <p className="font-semibold text-gray-500">No contacts found</p>
          {(search || platformFilter) && (
            <button onClick={() => { setSearch(""); setPlatformFilter(""); }} className="mt-2 text-teal-600 underline text-sm">Clear filters</button>
          )}
          {!search && !platformFilter && (
            <button onClick={() => setShowAdd(true)} className="mt-3 inline-flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition">
              <FaPlus /> Add your first contact
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([platform, items]) => {
            const meta = platformMeta(platform);
            return (
              <div key={platform}>
                {/* Platform group header */}
                <div className={`flex items-center gap-2 mb-2 px-1`}>
                  <span className={`${meta.color} text-base`}>{meta.icon}</span>
                  <span className="text-sm font-bold text-gray-600">{meta.label}</span>
                  <span className="text-xs text-gray-300 ml-1">({items.length})</span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {items
                    .sort((a, b) => a.order - b.order)
                    .map((c, idx) => (
                    <div
                      key={c._id}
                      className={`flex items-center gap-4 px-5 py-4 transition ${idx > 0 ? "border-t border-gray-50" : ""} ${!c.isActive ? "opacity-50" : ""} hover:bg-gray-50`}
                    >
                      {/* Drag handle (visual only) */}
                      <FaGripVertical className="text-gray-200 flex-shrink-0" />

                      {/* Platform icon */}
                      <PlatformIcon platform={c.platform} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {c.label && (
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{c.label}</span>
                          )}
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                          {c.order > 0 && (
                            <span className="text-xs text-gray-300">order: {c.order}</span>
                          )}
                        </div>
                        {/* Value — clickable link where applicable */}
                        {["website","facebook","instagram","twitter","linkedin","youtube","tiktok","telegram"].includes(c.platform) ? (
                          <a
                            href={c.value.startsWith("http") ? c.value : `https://${c.value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm font-semibold truncate block mt-0.5 ${meta.color} hover:underline`}
                          >
                            {c.value}
                          </a>
                        ) : c.platform === "email" ? (
                          <a href={`mailto:${c.value}`} className={`text-sm font-semibold block mt-0.5 ${meta.color} hover:underline`}>
                            {c.value}
                          </a>
                        ) : c.platform === "phone" || c.platform === "whatsapp" ? (
                          <a href={`tel:${c.value}`} className={`text-sm font-semibold block mt-0.5 ${meta.color} hover:underline`}>
                            {c.value}
                          </a>
                        ) : (
                          <p className={`text-sm font-semibold block mt-0.5 ${meta.color}`}>{c.value}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Toggle active */}
                        <button
                          onClick={() => handleToggle(c._id)}
                          title={c.isActive ? "Deactivate" : "Activate"}
                          className={`p-2 rounded-lg text-lg transition ${c.isActive ? "text-green-500 hover:bg-green-50" : "text-gray-300 hover:bg-gray-100"}`}
                        >
                          {c.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => setEditing(c)}
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setConfirmDel(c._id)}
                          disabled={deleting === c._id}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition disabled:opacity-40"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <Modal title="Add New Contact" onClose={() => setShowAdd(false)}>
          <ContactForm
            initial={EMPTY_FORM}
            onSave={handleAdd}
            onCancel={() => setShowAdd(false)}
            saving={saving}
          />
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal title="Edit Contact" onClose={() => setEditing(null)}>
          <ContactForm
            initial={editing}
            onSave={handleEdit}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        </Modal>
      )}

      {/* Delete confirm modal */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmDel(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Contact?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDel(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 font-semibold transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDel)}
                disabled={deleting === confirmDel}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-60 text-sm"
              >
                {deleting === confirmDel ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
