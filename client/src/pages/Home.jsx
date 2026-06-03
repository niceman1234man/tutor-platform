import React, { useEffect, useState } from "react";
import API from "../api/api";
import Hero from "../assets/Hero.jpg";
import why from "../assets/why.jpg";
import {
  FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram,
  FaTiktok, FaWhatsapp, FaTelegram, FaPhone, FaEnvelope,
  FaGlobe, FaLink,
  FaCertificate, FaGraduationCap, FaBook,
  FaPersonBooth, FaCalculator, FaProjectDiagram,
  FaMapMarkerAlt,
} from "react-icons/fa";

const PLATFORM_META = {
  phone:     { icon: FaPhone,     color: "text-green-400",  label: "Phone"    },
  email:     { icon: FaEnvelope,  color: "text-blue-400",   label: "Email"    },
  whatsapp:  { icon: FaWhatsapp,  color: "text-green-400",  label: "WhatsApp" },
  telegram:  { icon: FaTelegram,  color: "text-sky-400",    label: "Telegram" },
  facebook:  { icon: FaFacebook,  color: "text-blue-500",   label: "Facebook" },
  instagram: { icon: FaInstagram, color: "text-pink-400",   label: "Instagram"},
  twitter:   { icon: FaTwitter,   color: "text-gray-300",   label: "X"        },
  linkedin:  { icon: FaLinkedin,  color: "text-blue-400",   label: "LinkedIn" },
  youtube:   { icon: FaYoutube,   color: "text-red-500",    label: "YouTube"  },
  tiktok:    { icon: FaTiktok,    color: "text-gray-200",   label: "TikTok"   },
  website:   { icon: FaGlobe,     color: "text-teal-400",   label: "Website"  },
  other:     { icon: FaLink,      color: "text-gray-400",   label: "Other"    },
};

const SOCIAL_PLATFORMS  = ["facebook","instagram","twitter","linkedin","youtube","tiktok"];
const CONTACT_PLATFORMS = ["phone","email","whatsapp","telegram","website","other"];

function contactHref(platform, value) {
  if (platform === "email")   return `mailto:${value}`;
  if (platform === "phone" || platform === "whatsapp") return `tel:${value}`;
  if (value.startsWith("http")) return value;
  return `https://${value}`;
}

export default function Home() {
  const [exams, setExams]           = useState([]);
  const [tutors, setTutors]         = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [examError, setExamError]   = useState("");
  const [contacts, setContacts]     = useState([]);

  useEffect(() => {
    let mounted = true;

    API.get("/courses").then((res) => { if (mounted) setTutors(res.data); }).catch(() => {});

    API.get("/admin/exams")
      .then(({ data }) => { if (mounted) { setExams(Array.isArray(data) ? data : []); setLoadingExams(false); } })
      .catch(() => { if (mounted) { setExamError("Failed to load exams."); setLoadingExams(false); } });

    API.get("/contacts")
      .then(({ data }) => { if (mounted) setContacts((data || []).filter((c) => c.isActive)); })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

  const socialLinks  = contacts.filter((c) => SOCIAL_PLATFORMS.includes(c.platform));
  const directLinks  = contacts.filter((c) => CONTACT_PLATFORMS.includes(c.platform));

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
              Learn. Grow. Succeed with{" "}
            </h1>
            <h1 className="text-3xl md:text-4xl font-bold text-teal-700 leading-tight mt-2">
              Skill Nest
            </h1>
            <p className="mt-6 text-gray-600 text-lg">
              Explore expert-led courses and build real-world skills for your future.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
                Explore Courses →
              </button>
              <button className="flex items-center gap-2 text-teal-700 font-medium">
                ▶ Watch Demo
              </button>
            </div>
            <div className="flex gap-6 mt-10 text-gray-600">
              <span className="flex items-center gap-2"><FaGraduationCap className="text-teal-700" /> Expert Instructors</span>
              <span className="flex items-center gap-2"><FaBook className="text-teal-700" /> Flexible Learning</span>
              <span className="flex items-center gap-2"><FaCertificate className="text-teal-700" /> Certifications</span>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img src={Hero} alt="learning" className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* ========== FEATURED EXAMS ========== */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Featured Exams</h2>
          {loadingExams ? (
            <div className="text-center text-gray-500 py-10">Loading exams…</div>
          ) : examError ? (
            <div className="text-center text-red-600 py-10">{examError}</div>
          ) : exams.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No exams found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
              {exams.slice(0, 3).map((ex, idx) => (
                <div
                  key={ex._id || idx}
                  className={`bg-white shadow-lg rounded-xl p-6 flex flex-col items-start border-t-4 ${
                    idx === 0 ? "border-teal-500" : idx === 1 ? "border-indigo-500" : "border-pink-500"
                  }`}
                >
                  <div className="text-xl font-semibold text-indigo-700 mb-1 truncate">{ex.title}</div>
                  <div className="text-sm text-gray-500 mb-2">Category: {ex.category || "—"}</div>
                  <div className="text-xs text-gray-400 mb-4">Duration: {ex.duration ? `${ex.duration} min` : "—"}</div>
                  <button
                    className="mt-auto bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
                    onClick={() => (window.location.href = `/exam/${ex._id}`)}
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
              onClick={() => (window.location.href = "/exams/list")}
            >
              Show More Exams
            </button>
          </div>
        </div>
      </section>

      {/* ================= POPULAR COURSES ================= */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Popular Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutors.length > 0 ? (
              tutors.slice(0, 3).map((t) => (
                <div className="bg-white shadow-lg rounded-xl p-6" key={t._id}>
                  <div className="h-40 w-full overflow-hidden">
                    <img src={t.imageUrl || "/default.jpg"} alt="Tutor" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t.title}</h3>
                  <p className="text-gray-600 mb-4">{t.description}</p>
                  <button className="bg-teal-700 text-white px-4 py-2 rounded-lg">Start Course</button>
                </div>
              ))
            ) : (
              <p>No courses found.</p>
            )}
            <div className="flex justify-center">
              <button
                className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
                onClick={() => (window.location.href = "/tutors")}
              >
                Show More Tutors
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <img src={why} alt="why choose us" className="w-full max-w-md mx-auto" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-8"><span className="underline">Why</span> Choose Skill Nest?</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg"><FaPersonBooth className="text-teal-700 inline mr-2" />Expert Mentors</h4>
                <p className="text-gray-700">Learn from industry professionals.</p>
              </div>
              <hr className="border-gray-300 my-4" />
              <div>
                <h4 className="font-semibold text-lg"><FaProjectDiagram className="text-teal-700 inline mr-2" />Hands-on Projects</h4>
                <p className="text-gray-700">Build real-world portfolio projects.</p>
              </div>
              <hr className="border-gray-300 my-4" />
              <div>
                <h4 className="font-semibold text-lg"><FaCalculator className="text-teal-700 inline mr-2" />Flexible Learning</h4>
                <p className="text-gray-700">Study anytime, anywhere at your own pace.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <p className="italic">"Skill Nest helped me land my first job as a developer!"</p>
              <p className="mt-4 font-semibold">— Rohan M.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <p className="italic">"Simple, effective, and well-structured courses."</p>
              <p className="mt-4 font-semibold">— Priya S.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT US SECTION ================= */}
      {directLinks.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-teal-700 to-indigo-800" id="contact">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Get In Touch</h2>
            <p className="text-teal-200 mb-10">We're here to help — reach us through any of these channels</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {directLinks.map((c) => {
                const meta = PLATFORM_META[c.platform] || PLATFORM_META.other;
                const Icon = meta.icon;
                const href = contactHref(c.platform, c.value);
                return (
                  <a
                    key={c._id}
                    href={href}
                    target={c.platform !== "phone" && c.platform !== "email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-2xl px-5 py-4 transition"
                  >
                    <span className={`text-2xl ${meta.color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <Icon />
                    </span>
                    <div className="text-left min-w-0">
                      {c.label && (
                        <p className="text-xs text-teal-200 font-semibold uppercase tracking-wide">{c.label}</p>
                      )}
                      <p className="text-white font-semibold text-sm truncate">{c.value}</p>
                      <p className="text-teal-300 text-xs">{meta.label}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social icons row */}
            {socialLinks.length > 0 && (
              <div className="mt-10">
                <p className="text-teal-300 text-sm mb-4 font-semibold uppercase tracking-widest">Follow Us</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {socialLinks.map((c) => {
                    const meta = PLATFORM_META[c.platform] || PLATFORM_META.other;
                    const Icon = meta.icon;
                    return (
                      <a
                        key={c._id}
                        href={contactHref(c.platform, c.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={c.label || meta.label}
                        className={`flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 ${meta.color} text-xl transition hover:scale-110`}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo / About */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Skill <span className="text-teal-400">Nest</span>
            </h2>
            <p className="mt-4 text-gray-400">
              Learn. Grow. Succeed with expert-led courses designed for your future.
            </p>
            {/* Social icons from DB — shown in footer too */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-5 flex-wrap">
                {socialLinks.map((c) => {
                  const meta = PLATFORM_META[c.platform] || PLATFORM_META.other;
                  const Icon = meta.icon;
                  return (
                    <a
                      key={c._id}
                      href={contactHref(c.platform, c.value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={c.label || meta.label}
                      className={`${meta.color} text-xl hover:opacity-80 transition`}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/tutors" className="hover:text-teal-400 transition">Courses</a></li>
              <li><a href="/resources" className="hover:text-teal-400 transition">Resources</a></li>
              <li><a href="/exams/list" className="hover:text-teal-400 transition">Exams</a></li>
              <li><a href="#contact" className="hover:text-teal-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact info from DB */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            {directLinks.length === 0 ? (
              <p className="text-gray-500 text-sm">No contact info available.</p>
            ) : (
              <ul className="space-y-3">
                {directLinks.slice(0, 5).map((c) => {
                  const meta = PLATFORM_META[c.platform] || PLATFORM_META.other;
                  const Icon = meta.icon;
                  return (
                    <li key={c._id}>
                      <a
                        href={contactHref(c.platform, c.value)}
                        target={c.platform !== "phone" && c.platform !== "email" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 hover:text-teal-400 transition text-sm"
                      >
                        <Icon className={`${meta.color} text-base flex-shrink-0`} />
                        <span className="truncate">{c.value}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="text-center mt-10 border-t border-gray-700 pt-4">
          <p>© {new Date().getFullYear()} Skill Nest. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
