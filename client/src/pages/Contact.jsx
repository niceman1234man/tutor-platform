import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  FaPhone, FaEnvelope, FaWhatsapp, FaTelegram,
  FaFacebook, FaInstagram, FaTwitter, FaLinkedin,
  FaYoutube, FaTiktok, FaGlobe, FaLink,
  FaMapMarkerAlt, FaClock,
} from "react-icons/fa";

const PLATFORM_META = {
  phone:     { icon: FaPhone,     color: "bg-green-50 text-green-600 border-green-200",   label: "Phone"    },
  email:     { icon: FaEnvelope,  color: "bg-blue-50 text-blue-600 border-blue-200",       label: "Email"    },
  whatsapp:  { icon: FaWhatsapp,  color: "bg-green-50 text-green-600 border-green-200",   label: "WhatsApp" },
  telegram:  { icon: FaTelegram,  color: "bg-sky-50 text-sky-600 border-sky-200",          label: "Telegram" },
  facebook:  { icon: FaFacebook,  color: "bg-blue-50 text-blue-700 border-blue-200",       label: "Facebook" },
  instagram: { icon: FaInstagram, color: "bg-pink-50 text-pink-600 border-pink-200",       label: "Instagram"},
  twitter:   { icon: FaTwitter,   color: "bg-gray-50 text-gray-700 border-gray-200",       label: "X / Twitter"},
  linkedin:  { icon: FaLinkedin,  color: "bg-blue-50 text-blue-700 border-blue-200",       label: "LinkedIn" },
  youtube:   { icon: FaYoutube,   color: "bg-red-50 text-red-600 border-red-200",          label: "YouTube"  },
  tiktok:    { icon: FaTiktok,    color: "bg-gray-50 text-gray-800 border-gray-200",       label: "TikTok"   },
  website:   { icon: FaGlobe,     color: "bg-teal-50 text-teal-600 border-teal-200",       label: "Website"  },
  other:     { icon: FaLink,      color: "bg-gray-50 text-gray-600 border-gray-200",       label: "Other"    },
};

const SOCIAL_PLATFORMS  = ["facebook","instagram","twitter","linkedin","youtube","tiktok"];
const DIRECT_PLATFORMS  = ["phone","email","whatsapp","telegram","website","other"];

function contactHref(platform, value) {
  if (platform === "email") return `mailto:${value}`;
  if (platform === "phone" || platform === "whatsapp") return `tel:${value}`;
  if (value.startsWith("http")) return value;
  return `https://${value}`;
}

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    API.get("/contacts")
      .then(({ data }) => setContacts((data || []).filter((c) => c.isActive)))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, []);

  const directContacts = contacts.filter((c) => DIRECT_PLATFORMS.includes(c.platform));
  const socialContacts = contacts.filter((c) => SOCIAL_PLATFORMS.includes(c.platform));

  return (
    <div className="text-gray-800">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-indigo-700 text-white py-20 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-5 tracking-wide">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Contact Skill Nest
          </h1>
          <p className="text-teal-100 text-lg">
            Have a question, need support, or want to partner with us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">

          {loading ? (
            <div className="text-center text-gray-400 py-16 text-lg">Loading contact info…</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12">

              {/* LEFT — Direct Contacts */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reach Us Directly</h2>
                <p className="text-gray-500 mb-6 text-sm">
                  Click any card below to call, email, or message us instantly.
                </p>

                {directContacts.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No direct contact info available yet.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {directContacts.map((c) => {
                      const meta = PLATFORM_META[c.platform] || PLATFORM_META.other;
                      const Icon = meta.icon;
                      return (
                        <a
                          key={c._id}
                          href={contactHref(c.platform, c.value)}
                          target={c.platform === "email" || c.platform === "phone" ? "_self" : "_blank"}
                          rel="noreferrer"
                          className={`flex items-center gap-4 p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition group ${meta.color.split(" ").find(cls => cls.startsWith("border-"))}`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border ${meta.color}`}>
                            <Icon className="text-xl" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                              {c.label || meta.label}
                            </p>
                            <p className="text-gray-800 font-medium truncate group-hover:text-teal-600 transition">
                              {c.value}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Info cards */}
                <div className="mt-8 grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</p>
                      <p className="text-gray-700 text-sm">Addis Ababa, Ethiopia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <FaClock className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Support Hours</p>
                      <p className="text-gray-700 text-sm">Monday – Saturday, 8 AM – 6 PM EAT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Social & FAQ */}
              <div>
                {socialContacts.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Follow Us</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                      Stay updated with news, tips, and exam schedules on our social channels.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {socialContacts.map((c) => {
                        const meta = PLATFORM_META[c.platform] || PLATFORM_META.other;
                        const Icon = meta.icon;
                        return (
                          <a
                            key={c._id}
                            href={contactHref(c.platform, c.value)}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition group ${meta.color.split(" ").find(cls => cls.startsWith("border-"))}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${meta.color}`}>
                              <Icon className="text-lg" />
                            </div>
                            <span className="text-gray-700 font-medium text-sm group-hover:text-teal-600 transition">
                              {c.label || meta.label}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FAQ */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Common Questions</h2>
                  <div className="flex flex-col gap-4">
                    {[
                      {
                        q: "How do I enroll in a course?",
                        a: "Register for a free account, browse available courses, then submit your payment receipt. Admin will approve your enrollment.",
                      },
                      {
                        q: "How long does enrollment approval take?",
                        a: "Most payments are reviewed and approved within 24 hours on business days.",
                      },
                      {
                        q: "Can I become a tutor on Skill Nest?",
                        a: "Yes! Log in, go to your tutor dashboard, and submit a tutor application. Our team will review it and get back to you.",
                      },
                      {
                        q: "Are the exam archives free?",
                        a: "You can browse all available exams for free. Some premium practice sets may require enrollment.",
                      },
                    ].map(({ q, a }) => (
                      <div key={q} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <p className="font-semibold text-gray-800 mb-1 text-sm">{q}</p>
                        <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

    </div>
  );
}
