import React, { useState, useEffect, useRef } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";
import {
  FaFileCode, FaFileImport, FaDownload, FaCheckCircle,
  FaExclamationTriangle, FaTrash, FaPlus, FaTimes,
  FaPencilAlt, FaFileAlt,
} from "react-icons/fa";

const HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<body>

  <div class="question">
    <p class="question-text">What is React?</p>
    <ul class="options">
      <li class="correct">A JavaScript library for building UIs</li>
      <li>A backend framework</li>
      <li>A database system</li>
      <li>A CSS framework</li>
    </ul>
    <span class="explanation">React is a JavaScript library developed by Facebook for building user interfaces.</span>
  </div>

  <div class="question">
    <p class="question-text">Which hook is used for side effects in React?</p>
    <ul class="options">
      <li>useState</li>
      <li class="correct">useEffect</li>
      <li>useRef</li>
      <li>useContext</li>
    </ul>
    <span class="explanation">useEffect runs after every render and is used for side effects like fetching data.</span>
  </div>

</body>
</html>`;

const JSON_TEMPLATE = JSON.stringify(
  [
    {
      question: "What is React?",
      options: ["A JavaScript library for building UIs", "A backend framework", "A database system", "A CSS framework"],
      correctAnswer: 0,
      explanation: "React is a JavaScript library developed by Facebook for building user interfaces.",
    },
    {
      question: "Which hook is used for side effects in React?",
      options: ["useState", "useEffect", "useRef", "useContext"],
      correctAnswer: 1,
      explanation: "useEffect runs after every render and is used for side effects like fetching data.",
    },
  ],
  null,
  2
);

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExamForm() {
  const [exam, setExam] = useState({ title: "", category: "", duration: "", questions: [] });
  const [question, setQuestion] = useState({ question: "", options: ["", "", "", ""], correctAnswer: null, explanation: "" });
  const [formError, setFormError] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // Import state
  const [importTab, setImportTab] = useState("html"); // "html" | "json"
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null); // { questions, errors, total }
  const [importError, setImportError] = useState("");
  const htmlFileRef = useRef();
  const jsonFileRef = useRef();

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
    if (err) { setQuestionError(err); return; }
    setExam((prev) => ({ ...prev, questions: [...prev.questions, question] }));
    setQuestion({ question: "", options: ["", "", "", ""], correctAnswer: null, explanation: "" });
    setQuestionError("");
  };

  const removeQuestion = (index) => {
    setExam((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!exam.title.trim()) { setFormError("Exam title is required."); return; }
    if (!exam.category.trim()) { setFormError("Category is required."); return; }
    if (!exam.duration || Number(exam.duration) <= 0) { setFormError("Duration must be a positive number."); return; }
    if (exam.questions.length === 0) { setFormError("Add at least one question."); return; }
    try {
      setSubmitting(true);
      await API.post("/admin/exams", { ...exam, duration: Number(exam.duration) });
      alert("Exam created successfully");
      setExam({ title: "", category: exam.category, duration: "", questions: [] });
    } catch {
      setFormError("Failed to create exam. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── HTML Import — parsed entirely in the browser with DOMParser ──
  const handleHTMLUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportError("");
    setImportResult(null);
    try {
      const text = await file.text();
      const doc = new DOMParser().parseFromString(text, "text/html");
      const questionEls = doc.querySelectorAll(".question");

      if (questionEls.length === 0) {
        setImportError('No elements with class "question" found. Make sure each question is wrapped in <div class="question">.');
        return;
      }

      const questions = [];
      const errors = [];

      questionEls.forEach((el, i) => {
        // Question text: .question-text > first <p> > <h3> > <h4>
        const questionText =
          el.querySelector(".question-text")?.textContent?.trim() ||
          el.querySelector("p")?.textContent?.trim() ||
          el.querySelector("h3")?.textContent?.trim() ||
          el.querySelector("h4")?.textContent?.trim() ||
          "";

        // Options: li inside .options, or any ul/ol
        const liEls = el.querySelectorAll(".options li, ul li, ol li");
        const options = Array.from(liEls).map((li) => li.textContent.trim());

        // Correct answer: <span class="answer">0</span>  OR  li.correct  OR  li[data-correct]
        let correctAnswer = null;
        const answerSpan = el.querySelector(".answer");
        if (answerSpan) {
          const idx = Number(answerSpan.textContent.trim());
          if (!isNaN(idx)) correctAnswer = idx;
        } else {
          Array.from(liEls).forEach((li, j) => {
            if (
              li.classList.contains("correct") ||
              li.getAttribute("data-correct") === "true" ||
              li.hasAttribute("correct")
            ) {
              correctAnswer = j;
            }
          });
        }

        // Explanation
        const explanation =
          el.querySelector(".explanation")?.textContent?.trim() ||
          el.querySelector("blockquote")?.textContent?.trim() ||
          "";

        // Validate
        if (!questionText) { errors.push(`Question ${i + 1}: missing question text.`); return; }
        if (options.length < 2) { errors.push(`Question ${i + 1}: needs at least 2 options.`); return; }
        if (correctAnswer === null || correctAnswer < 0 || correctAnswer >= options.length) {
          errors.push(`Question ${i + 1}: correct answer not found — mark one <li class="correct"> or add <span class="answer">0</span>.`);
          return;
        }

        questions.push({ question: questionText, options, correctAnswer, explanation });
      });

      setImportResult({ questions, errors, total: questions.length });
    } catch (err) {
      setImportError("Could not read the file. Make sure it is a valid HTML file.");
    } finally {
      setImporting(false);
      if (htmlFileRef.current) htmlFileRef.current.value = "";
    }
  };

  // ── JSON Import ──────────────────────────────────────────
  const handleJSONUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportError("");
    setImportResult(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : [];
      const questions = [];
      const errors = [];
      arr.forEach((q, i) => {
        if (!q.question?.trim()) { errors.push(`Item ${i + 1}: missing "question".`); return; }
        if (!Array.isArray(q.options) || q.options.length < 2) { errors.push(`Item ${i + 1}: "options" must be an array with ≥2 items.`); return; }
        if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
          errors.push(`Item ${i + 1}: "correctAnswer" must be a valid index.`); return;
        }
        questions.push({
          question: q.question.trim(),
          options: q.options.map((o) => String(o).trim()),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation?.trim() || "",
        });
      });
      setImportResult({ questions, errors, total: questions.length });
    } catch {
      setImportError("Invalid JSON file. Make sure it's a valid JSON array.");
    } finally {
      setImporting(false);
      if (jsonFileRef.current) jsonFileRef.current.value = "";
    }
  };

  const acceptImport = () => {
    if (!importResult?.questions?.length) return;
    setExam((prev) => ({ ...prev, questions: [...prev.questions, ...importResult.questions] }));
    setImportResult(null);
    setImportOpen(false);
  };

  const dismissImport = () => {
    setImportResult(null);
    setImportError("");
    setImportOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow rounded space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to="/admin/manage-exams" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">
          Manage Exams
        </Link>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create New Exam</h2>
          <p className="text-sm text-gray-500">Design assessments — add questions manually or import a file.</p>
        </div>
        <div className="text-sm text-gray-600">
          Questions: <span className="font-semibold text-indigo-700">{exam.questions.length}</span>
        </div>
      </div>

      {formError && <div className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2 text-sm">{formError}</div>}

      {/* ── Exam Meta ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text" placeholder="Exam Title"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-200"
            value={exam.title}
            onChange={(e) => setExam({ ...exam, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-200"
            value={exam.category}
            onChange={(e) => setExam({ ...exam, category: e.target.value })}
          >
            {categories.length === 0 && <option value="">No categories found</option>}
            {categories.map((cat, i) => {
              const val = cat.value || cat.name || cat;
              return <option key={i} value={val}>{val}</option>;
            })}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
        <input
          type="number" placeholder="e.g. 60"
          className="border p-2 w-40 rounded focus:ring-2 focus:ring-indigo-200"
          value={exam.duration}
          onChange={(e) => setExam({ ...exam, duration: e.target.value })}
        />
      </div>

      {/* ══════════════════════════════════════════════
           IMPORT SECTION
         ══════════════════════════════════════════════ */}
      <div className="border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/40">
        <button
          type="button"
          onClick={() => { setImportOpen((v) => !v); setImportResult(null); setImportError(""); }}
          className="w-full flex items-center justify-between px-5 py-3 text-indigo-700 font-semibold text-sm hover:bg-indigo-50 rounded-xl transition"
        >
          <span className="flex items-center gap-2"><FaFileImport /> Import Questions from File</span>
          <span className="text-xs text-indigo-400">{importOpen ? "▲ collapse" : "▼ expand"}</span>
        </button>

        {importOpen && (
          <div className="px-5 pb-5 space-y-4">
            {/* Tab switcher */}
            <div className="flex gap-2 border-b border-indigo-100 pb-2">
              {[
                { key: "html", label: "HTML File", icon: <FaFileCode /> },
                { key: "json", label: "JSON File", icon: <FaFileAlt /> },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => { setImportTab(t.key); setImportResult(null); setImportError(""); }}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    importTab === t.key
                      ? "bg-indigo-600 text-white"
                      : "text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* HTML tab */}
            {importTab === "html" && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-indigo-100 p-4 text-sm text-gray-600 space-y-2">
                  <p className="font-semibold text-gray-700">Expected HTML format:</p>
                  <pre className="bg-gray-50 rounded p-3 text-xs overflow-x-auto leading-relaxed text-gray-600">{`<div class="question">
  <p class="question-text">Your question here?</p>
  <ul class="options">
    <li class="correct">Correct option</li>
    <li>Wrong option</li>
    <li>Wrong option</li>
    <li>Wrong option</li>
  </ul>
  <span class="explanation">Why this answer is correct.</span>
</div>`}</pre>
                  <p className="text-xs text-gray-400">Mark the correct answer with <code className="bg-gray-100 px-1 rounded">class="correct"</code> on the &lt;li&gt;, or use <code className="bg-gray-100 px-1 rounded">&lt;span class="answer"&gt;0&lt;/span&gt;</code> (0-indexed).</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <label className={`flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition ${importing ? "opacity-60 pointer-events-none" : ""}`}>
                    <FaFileCode />
                    {importing ? "Parsing…" : "Choose HTML File"}
                    <input ref={htmlFileRef} type="file" accept=".html,.htm" className="hidden" onChange={handleHTMLUpload} />
                  </label>
                  <button
                    type="button"
                    onClick={() => downloadFile("exam-template.html", HTML_TEMPLATE, "text/html")}
                    className="flex items-center gap-2 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    <FaDownload /> Download Template
                  </button>
                </div>
              </div>
            )}

            {/* JSON tab */}
            {importTab === "json" && (
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-indigo-100 p-4 text-sm text-gray-600 space-y-2">
                  <p className="font-semibold text-gray-700">Expected JSON format (array of questions):</p>
                  <pre className="bg-gray-50 rounded p-3 text-xs overflow-x-auto leading-relaxed text-gray-600">{`[
  {
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct."
  }
]`}</pre>
                  <p className="text-xs text-gray-400"><code className="bg-gray-100 px-1 rounded">correctAnswer</code> is the 0-based index of the correct option.</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <label className={`flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition ${importing ? "opacity-60 pointer-events-none" : ""}`}>
                    <FaFileAlt />
                    {importing ? "Parsing…" : "Choose JSON File"}
                    <input ref={jsonFileRef} type="file" accept=".json" className="hidden" onChange={handleJSONUpload} />
                  </label>
                  <button
                    type="button"
                    onClick={() => downloadFile("exam-template.json", JSON_TEMPLATE, "application/json")}
                    className="flex items-center gap-2 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    <FaDownload /> Download Template
                  </button>
                </div>
              </div>
            )}

            {/* Error banner */}
            {importError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {/* Parse result preview */}
            {importResult && (
              <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden">
                {/* Result header */}
                <div className="px-4 py-3 bg-indigo-50 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <span className="text-green-700 flex items-center gap-1">
                      <FaCheckCircle /> {importResult.total} question{importResult.total !== 1 ? "s" : ""} ready
                    </span>
                    {importResult.errors?.length > 0 && (
                      <span className="text-amber-600 flex items-center gap-1">
                        <FaExclamationTriangle /> {importResult.errors.length} skipped
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={dismissImport} className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1">
                    <FaTimes /> dismiss
                  </button>
                </div>

                {/* Skip errors */}
                {importResult.errors?.length > 0 && (
                  <div className="px-4 py-3 border-b border-amber-100 bg-amber-50">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Skipped items:</p>
                    <ul className="text-xs text-amber-700 space-y-0.5 list-disc ml-4">
                      {importResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}

                {/* Preview list */}
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                  {importResult.questions.map((q, i) => (
                    <div key={i} className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{i + 1}. {q.question}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {q.options.map((opt, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              q.correctAnswer === idx
                                ? "bg-green-100 text-green-800 font-semibold"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {q.correctAnswer === idx ? "✓ " : ""}{String.fromCharCode(65 + idx)}. {opt}
                          </span>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-xs text-gray-400 mt-1">💡 {q.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Accept button */}
                {importResult.total > 0 && (
                  <div className="px-4 py-3 border-t border-indigo-100 bg-indigo-50 flex gap-3">
                    <button
                      type="button"
                      onClick={acceptImport}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      <FaPlus /> Add {importResult.total} question{importResult.total !== 1 ? "s" : ""} to exam
                    </button>
                    <button type="button" onClick={dismissImport} className="text-sm text-gray-500 hover:text-gray-700">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
           MANUAL ADD QUESTION
         ══════════════════════════════════════════════ */}
      <div className="border p-4 rounded bg-white shadow-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
          <FaPencilAlt className="text-indigo-400" /> Add Question Manually
        </h3>

        {questionError && <div className="mb-2 text-red-600 text-sm">{questionError}</div>}

        <label className="block text-sm font-medium mb-1">Question</label>
        <textarea
          placeholder="Enter your question…"
          className="border p-3 w-full mb-3 rounded focus:ring-2 focus:ring-indigo-100"
          value={question.question}
          onChange={(e) => setQuestion({ ...question, question: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {question.options.map((opt, index) => (
            <div key={index}>
              <label className="text-sm font-medium">Option {index + 1}</label>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="border p-2 w-full rounded focus:ring-1 focus:ring-indigo-100 mt-1"
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

        <label className="block text-sm font-medium mb-1">Correct Answer</label>
        <select
          className="border p-2 w-full mb-3 rounded"
          value={question.correctAnswer ?? ""}
          onChange={(e) =>
            setQuestion({ ...question, correctAnswer: e.target.value === "" ? null : Number(e.target.value) })
          }
        >
          <option value="">Select correct option</option>
          {question.options.map((_, i) => (
            <option key={i} value={i}>Option {i + 1}{question.options[i] ? ` — ${question.options[i]}` : ""}</option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">Explanation <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          placeholder="Why is this the correct answer?"
          className="border p-2 w-full mb-3 rounded"
          value={question.explanation}
          onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
        />

        <div className="flex gap-3 flex-wrap">
          <button type="button" onClick={addQuestion} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition text-sm">
            Add Question
          </button>
          <button
            type="button"
            onClick={() => setQuestion({ question: "", options: ["", "", "", ""], correctAnswer: null, explanation: "" })}
            className="border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded transition text-sm"
          >
            Reset
          </button>
          <span className="ml-auto text-xs text-gray-400 self-center">Tip: use clear, concise questions.</span>
        </div>
      </div>

      {/* ── Added Questions List ── */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-800">Questions Added ({exam.questions.length})</h3>
        {exam.questions.length === 0 && (
          <div className="text-gray-400 text-sm py-4 text-center border rounded bg-gray-50">
            No questions yet — add manually or import a file above.
          </div>
        )}
        {exam.questions.map((q, i) => (
          <div key={i} className="p-4 mb-3 rounded bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between">
            <div className="sm:flex-1">
              <p className="font-medium text-gray-800">{i + 1}. {q.question}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                      q.correctAnswer === idx ? "bg-green-100 text-green-800 font-semibold" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {q.correctAnswer === idx ? "✓ " : ""}{String.fromCharCode(65 + idx)}. {opt}
                  </span>
                ))}
              </div>
              {q.explanation && <p className="text-gray-500 text-xs mt-2">💡 {q.explanation}</p>}
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4 flex items-start">
              <button
                type="button"
                onClick={() => removeQuestion(i)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs transition"
              >
                <FaTrash /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={submitting}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded w-full disabled:opacity-60 font-semibold transition"
      >
        {submitting ? "Submitting…" : "Submit Exam"}
      </button>
    </form>
  );
}
