
import React, { useState } from "react";
import { FaUserTie, FaFileUpload, FaPlus, FaMinus, FaRegPaperPlane, FaBuilding, FaBriefcase, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import API from "../../api/api";
import useAuth from "../../hooks/useAuth";


export default function ApplicationForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    letter: "",
    cv: null,
    experiences: [
      {
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
      },
    ],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, cv: e.target.files[0] });
  };

  // Experience change
  const handleExperienceChange = (index, e) => {
    const values = [...form.experiences];
    values[index][e.target.name] =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    if (e.target.name === "isCurrent" && e.target.checked) {
      values[index].endDate = "";
    }

    setForm({ ...form, experiences: values });
  };

  // Add experience
  const addExperience = () => {
    setForm({
      ...form,
      experiences: [
        ...form.experiences,
        {
          company: "",
          position: "",
          description: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
      ],
    });
  };

  // Remove experience
  const removeExperience = (index) => {
    const values = [...form.experiences];
    values.splice(index, 1);
    setForm({ ...form, experiences: values });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("letter", form.letter);
      data.append("cv", form.cv);
      data.append("experiences", JSON.stringify(form.experiences));
await API.post("/applications", data, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${user.token}`, // 👈 REQUIRED
  },
});

      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10">
      {/* Hero Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shadow-lg">
            <FaUserTie className="text-white text-4xl" />
          </span>
        </div>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight drop-shadow-lg">Tutor Application</h2>
        <p className="text-lg text-gray-600">Apply to become a tutor and share your expertise with students. Fill out the form below to get started!</p>
      </div>

      <div className="max-w-4xl mx-auto p-8 bg-white/90 shadow-2xl rounded-3xl border border-purple-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Application Letter */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FaRegPaperPlane className="text-blue-500" /> Application Letter
            </label>
            <textarea
              name="letter"
              value={form.letter}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-300 bg-blue-50"
              rows="4"
              required
              placeholder="Write a brief letter about why you want to be a tutor..."
            />
          </div>

          {/* CV Upload */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FaFileUpload className="text-purple-500" /> Upload CV
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border-2 border-purple-200 p-3 rounded-xl bg-purple-50"
              required
            />
          </div>

          {/* Experiences */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <FaBriefcase className="text-pink-500" /> Experiences
            </h3>

            <div className="grid gap-6">
              {form.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="relative border-2 border-pink-200 p-6 rounded-2xl bg-pink-50 shadow-md"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                        <FaBuilding className="text-blue-400" /> Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full mb-2 p-3 border border-blue-200 rounded-xl bg-blue-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                        <FaBriefcase className="text-purple-400" /> Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full mb-2 p-3 border border-purple-200 rounded-xl bg-purple-50"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                      <FaCheckCircle className="text-green-400" /> Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your role and achievements..."
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="w-full mb-2 p-3 border border-green-200 rounded-xl bg-green-50"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mt-2">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-400" /> Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full p-3 border border-blue-200 rounded-xl bg-blue-50"
                        required
                      />
                    </div>
                    {!exp.isCurrent && (
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                          <FaCalendarAlt className="text-pink-400" /> End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full p-3 border border-pink-200 rounded-xl bg-pink-50"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isCurrent"
                      checked={exp.isCurrent}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="accent-green-500 w-5 h-5"
                    />
                    <span className="text-gray-700">Currently Working Here</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-white rounded-full p-2 shadow-md transition"
                    title="Remove Experience"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="mt-6 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              <FaPlus /> Add Experience
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-2xl text-xl font-bold shadow-xl hover:scale-105 transition flex items-center justify-center gap-3"
          >
            <FaRegPaperPlane className="text-white text-2xl" /> Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}