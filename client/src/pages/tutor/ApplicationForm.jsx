import React, { useState } from "react";
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">Tutor Application</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Application Letter */}
        <div>
          <label className="block font-medium mb-1">Application Letter</label>
          <textarea
            name="letter"
            value={form.letter}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            rows="4"
            required
          />
        </div>

        {/* CV Upload */}
        <div>
          <label className="block font-medium mb-1">Upload CV</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        {/* Experiences */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Experiences</h3>

          {form.experiences.map((exp, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl mb-4 bg-gray-50"
            >
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, e)}
                className="w-full mb-2 p-2 border rounded"
                required
              />

              <input
                type="text"
                name="position"
                placeholder="Position"
                value={exp.position}
                onChange={(e) => handleExperienceChange(index, e)}
                className="w-full mb-2 p-2 border rounded"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, e)}
                className="w-full mb-2 p-2 border rounded"
              />

              <div className="flex gap-3">
                <input
                  type="date"
                  name="startDate"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full p-2 border rounded"
                  required
                />

                {!exp.isCurrent && (
                  <input
                    type="date"
                    name="endDate"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full p-2 border rounded"
                  />
                )}
              </div>

              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isCurrent"
                    checked={exp.isCurrent}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  Currently Working Here
                </label>
              </div>

              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="mt-3 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            + Add Experience
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl text-lg"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}