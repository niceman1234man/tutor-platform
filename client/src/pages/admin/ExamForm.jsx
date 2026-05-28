import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";

export default function ExamForm() {
  const [exam, setExam] = useState({
    title: "",
    category: "",
    duration: "",
    questions: [],
  });

  const [question, setQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: null,
    explanation: "",
  });

  const [formError, setFormError] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/resources/categories")
      .then((res) => {
        const cats = Array.isArray(res.data) ? res.data : [];
        setCategories(cats);
        if (cats.length > 0) setExam((prev) => ({ ...prev, category: cats[0].value || cats[0].name || cats[0] }));
      })
      .catch(() => {});
  }, []);

  const validateQuestion = (q) => {
    if (!q.question.trim()) return "Question text is required.";
    if (q.options.some((o) => !o.trim())) return "All options are required.";
    if (q.correctAnswer === null) return "Select the correct answer.";
    return "";
  };

  const addQuestion = () => {
    const err = validateQuestion(question);
    if (err) {
      setQuestionError(err);
      return;
    }

    setExam((prev) => ({ ...prev, questions: [...prev.questions, question] }));
    setQuestion({ question: "", options: ["", "", "", ""], correctAnswer: null, explanation: "" });
    setQuestionError("");
  };

  const removeQuestion = (index) => {
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!exam.title.trim()) {
      setFormError("Exam title is required.");
      return;
    }
    if (!exam.category.trim()) {
      setFormError("Category is required.");
      return;
    }
    if (!exam.duration || Number(exam.duration) <= 0) {
      setFormError("Duration must be a positive number.");
      return;
    }
    if (exam.questions.length === 0) {
      setFormError("Add at least one question.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...exam, duration: Number(exam.duration) };
      await API.post("/admin/exams", payload);
      alert("Exam created successfully");
      setExam({ title: "", category: "", duration: "", questions: [] });
    } catch (err) {
      console.error(err);
      setFormError("Failed to create exam. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow rounded space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/manage-exams" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Manage Existed Exams
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Create New Exam</h2>
          <p className="text-sm text-gray-500">Design assessments for your students — add questions below.</p>
        </div>
        <div className="text-sm text-gray-600">Questions: <span className="font-medium">{exam.questions.length}</span></div>
      </div>

      {formError && <div className="mb-3 text-red-600">{formError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            aria-label="Exam Title"
            type="text"
            placeholder="Exam Title"
            className="border p-2 w-full"
            value={exam.title}
            onChange={(e) => setExam({ ...exam, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category</label>
          <select
            aria-label="Category"
            className="border p-2 w-full rounded"
            value={exam.category}
            onChange={(e) => setExam({ ...exam, category: e.target.value })}
          >
            {categories.length === 0 && (
              <option value="">No categories found</option>
            )}
            {categories.map((cat, i) => {
              const val = cat.value || cat.name || cat;
              return (
                <option key={i} value={val}>{val}</option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Duration (minutes)</label>
        <input
          aria-label="Duration"
          type="number"
          placeholder="Duration (minutes)"
          className="border p-2 w-40"
          value={exam.duration}
          onChange={(e) => setExam({ ...exam, duration: e.target.value })}
        />
      </div>

      <div className="border p-4 rounded mb-4 bg-white shadow-sm">
        <h3 className="font-semibold mb-2">Add Question</h3>

        {questionError && <div className="mb-2 text-red-600">{questionError}</div>}

        <label className="block text-sm mb-1">Question</label>
        <textarea
          placeholder="Question"
          className="border p-3 w-full mb-3 rounded focus:ring-2 focus:ring-indigo-100"
          value={question.question}
          onChange={(e) => setQuestion({ ...question, question: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {question.options.map((opt, index) => (
            <div key={index}>
              <label className="text-sm">Option {index + 1}</label>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="border p-2 w-full rounded focus:ring-1 focus:ring-indigo-50"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[index] = e.target.value;
                  setQuestion({ ...question, options: newOptions });
                }}
              />
            </div>
          ))}
        </div>

        <label className="block text-sm mb-1">Correct Answer</label>
        <select
          className="border p-2 w-full mb-2 rounded"
          value={question.correctAnswer ?? ""}
          onChange={(e) =>
            setQuestion({ ...question, correctAnswer: e.target.value === "" ? null : Number(e.target.value) })
          }
        >
          <option value="">Select correct option</option>
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>

        <label className="block text-sm mb-1">Explanation</label>
        <textarea
          placeholder="Explanation (Why this answer is correct)"
          className="border p-2 w-full mb-3"
          value={question.explanation}
          onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
          >
            Add Question
          </button>
          <button
            type="button"
            onClick={() => setQuestion({ question: "", options: ["", "", "", ""], correctAnswer: null, explanation: "" })}
            className="border hover:bg-gray-50 text-gray-800 px-4 py-2 rounded transition"
          >
            Reset
          </button>
          <div className="ml-auto text-sm text-gray-500 self-center">Tip: use clear, concise questions.</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Questions Added ({exam.questions.length})</h3>
        {exam.questions.length === 0 && <div className="text-gray-600">No questions yet.</div>}

        {exam.questions.map((q, i) => (
          <div key={i} className="p-4 mb-3 rounded bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between">
            <div className="sm:flex-1">
              <p className="font-medium">{i + 1}. {q.question}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt, idx) => (
                  <span key={idx} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${q.correctAnswer === idx ? 'bg-green-100 text-green-800 font-semibold' : 'bg-gray-100 text-gray-800'}`}>
                    {q.correctAnswer === idx ? '✓ ' : ''}{String.fromCharCode(65 + idx)}. {opt}
                  </span>
                ))}
              </div>
              {q.explanation && <p className="text-gray-600 text-sm mt-2">Explanation: {q.explanation}</p>}
            </div>

            <div className="mt-3 sm:mt-0 sm:ml-4 flex items-start gap-2">
              <button
                type="button"
                onClick={() => removeQuestion(i)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit Exam'}
        </button>
      </div>
    </form>
  );
}