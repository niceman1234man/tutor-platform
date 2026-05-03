import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function AdminExamManager() {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [addingQuestion, setAddingQuestion] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: ""
    });
    const [addError, setAddError] = useState("");
        // ADD QUESTION HANDLER
        const handleAddQuestion = async () => {
            setAddError("");
            if (!newQuestion.question.trim()) {
                setAddError("Question text is required.");
                return;
            }
            if (newQuestion.options.some((o) => !o.trim())) {
                setAddError("All options are required.");
                return;
            }
            if (newQuestion.correctAnswer === null || newQuestion.correctAnswer === "") {
                setAddError("Select the correct answer.");
                return;
            }
            try {
                const res = await API.post(`/admin/exams/${selectedExam._id}/questions`, newQuestion);
                setSelectedExam((prev) => ({
                    ...prev,
                    questions: [...prev.questions, res.data],
                }));
                setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });
                setAddingQuestion(false);
            } catch (err) {
                setAddError("Failed to add question.");
            }
        };
    const [loading, setLoading] = useState(false);

  
    const fetchExams = async () => {
        try {
            const res = await API.get("/admin/exams");
            setExams(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load exams");
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleManageExam = async (examId) => {
        setLoading(true);
        try {
            const res = await API.get(`/admin/exams/${examId}`);
            setSelectedExam(res.data); // This now includes the questions array
        } catch (err) {
            console.error(err);
            alert("Failed to load exam details");
        } finally {
            setLoading(false);
        }
    };

    const deleteExam = async (id) => {
        if (!window.confirm("Delete this exam?")) return;

        try {
            await API.delete(`/admin/exams/${id}`);
            setExams(exams.filter((e) => e._id !== id));
            setSelectedExam(null);
        } catch (err) {
            console.error(err);
            alert("Failed to delete exam");
        }
    };

    
    const deleteQuestion = async (examId, questionId) => {
        if (!window.confirm("Delete this question?")) return;

        try {
            await API.delete(`/admin/exams/${examId}/questions/${questionId}`);

            setSelectedExam((prev) => ({
                ...prev,
                questions: prev.questions.filter((q) => q._id !== questionId),
            }));
        } catch (err) {
            console.error(err);
            alert("Failed to delete question");
        }
    };

    const updateQuestion = async () => {
        try {
            await API.put(
                `/admin/exams/${selectedExam._id}/questions/${editingQuestion._id}`,
                editingQuestion
            );

            setSelectedExam((prev) => ({
                ...prev,
                questions: prev.questions.map((q) =>
                    q._id === editingQuestion._id ? editingQuestion : q
                ),
            }));

            setEditingQuestion(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update question");
        }
    };

    
    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">

            {/* ================= EXAMS LIST ================= */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
                <h2 className="text-2xl font-extrabold mb-6 text-blue-700 flex items-center gap-2">
                    <span className="inline-block w-2 h-6 bg-blue-400 rounded-full"></span>
                    All Exams
                </h2>

                {exams.length === 0 ? (
                    <p className="text-gray-500">No exams found</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <div key={exam._id} className="transition-all duration-200 border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl shadow hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between min-h-[140px]">
                                <div>
                                    <h3 className="font-bold text-lg text-blue-800 mb-1">{exam.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {exam.category} • {exam.duration} min
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleManageExam(exam._id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow-sm transition"
                                    >
                                        {loading && selectedExam?._id === exam._id ? "Loading..." : "Manage"}
                                    </button>
                                    <button
                                        onClick={() => deleteExam(exam._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow-sm transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= SELECTED EXAM ================= */}
            {selectedExam && (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-200 mt-8">
                    <h2 className="text-2xl font-extrabold mb-6 text-purple-700 flex items-center gap-2">
                        <span className="inline-block w-2 h-6 bg-purple-400 rounded-full"></span>
                        {selectedExam.title} <span className="text-lg font-normal text-gray-400">- Questions</span>
                    </h2>

                    {/* Add Question Button */}
                    {!addingQuestion && (
                        <button
                            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-6 py-2 rounded-lg font-bold shadow mb-8 transition"
                            onClick={() => setAddingQuestion(true)}
                        >
                            + Add Question
                        </button>
                    )}

                    {/* Add Question Form */}
                    {addingQuestion && (
                        <div className="border-2 border-green-200 p-6 mb-8 rounded-xl bg-green-50 shadow-md animate-fade-in">
                            <h3 className="font-bold mb-3 text-green-700">Add New Question</h3>
                            {addError && <div className="text-red-600 mb-2 font-semibold">{addError}</div>}
                            <textarea
                                className="border-2 border-green-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Question text"
                                value={newQuestion.question}
                                onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
                            />
                            {newQuestion.options.map((opt, i) => (
                                <input
                                    key={i}
                                    className="border-2 border-green-200 p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={e => {
                                        const newOpts = [...newQuestion.options];
                                        newOpts[i] = e.target.value;
                                        setNewQuestion({ ...newQuestion, options: newOpts });
                                    }}
                                />
                            ))}
                            <select
                                className="border-2 border-green-200 p-2 w-full mt-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                                value={newQuestion.correctAnswer}
                                onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: Number(e.target.value) })}
                            >
                                <option value={0}>Option 1</option>
                                <option value={1}>Option 2</option>
                                <option value={2}>Option 3</option>
                                <option value={3}>Option 4</option>
                            </select>
                            <textarea
                                className="border-2 border-green-200 p-2 w-full mt-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                                placeholder="Explanation (optional)"
                                value={newQuestion.explanation}
                                onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleAddQuestion}
                                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-1.5 rounded font-bold shadow transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => { setAddingQuestion(false); setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }); setAddError(""); }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-1.5 rounded font-bold shadow transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedExam.questions?.length === 0 ? (
                        <p className="text-gray-500">No questions</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {selectedExam.questions?.map((q, idx) => (
                                <div key={q._id} className="border-2 border-purple-200 bg-purple-50 p-5 rounded-xl shadow hover:shadow-xl transition-all duration-200">
                                    {/* ================= EDIT MODE ================= */}
                                    {editingQuestion?._id === q._id ? (
                                        <>
                                            <div className="font-bold text-purple-700 mb-2">Q{idx + 1}</div>
                                            <textarea
                                                className="border-2 border-purple-300 p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                value={editingQuestion.question|| ""}
                                                onChange={(e) =>
                                                    setEditingQuestion({
                                                        ...editingQuestion,
                                                        question: e.target.value,
                                                    })
                                                }
                                            />
                                            {editingQuestion.options.map((opt, i) => (
                                                <div key={i} className="flex items-center mb-1">
                                                    <span className="w-6 font-bold text-purple-500">{String.fromCharCode(65 + i)}.</span>
                                                    <input
                                                        className="border-2 border-purple-200 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                                                        value={typeof opt === 'object' && opt !== null ? opt.text : opt}
                                                        onChange={(e) => {
                                                            const newOpts = [...editingQuestion.options];
                                                            newOpts[i] = typeof newOpts[i] === 'object' && newOpts[i] !== null
                                                                ? { ...newOpts[i], text: e.target.value }
                                                                : e.target.value;
                                                            setEditingQuestion({
                                                                ...editingQuestion,
                                                                options: newOpts,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            <select
                                                className="border-2 border-purple-200 p-2 w-full mt-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                                                value={editingQuestion.correctAnswer}
                                                onChange={(e) =>
                                                    setEditingQuestion({
                                                        ...editingQuestion,
                                                        correctAnswer: Number(e.target.value),
                                                    })
                                                }
                                            >
                                                <option value={0}>Option 1</option>
                                                <option value={1}>Option 2</option>
                                                <option value={2}>Option 3</option>
                                                <option value={3}>Option 4</option>
                                            </select>
                                            <textarea
                                                className="border-2 border-purple-200 p-2 w-full mt-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                                                value={editingQuestion.explanation}
                                                onChange={(e) =>
                                                    setEditingQuestion({
                                                        ...editingQuestion,
                                                        explanation: e.target.value,
                                                    })
                                                }
                                            />
                                            <div className="flex gap-3 mt-3">
                                                <button
                                                    onClick={updateQuestion}
                                                    className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-1.5 rounded font-bold shadow transition"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingQuestion(null)}
                                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1.5 rounded font-bold shadow transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* ================= DISPLAY MODE ================= */}
                                            <div className="font-bold text-purple-700 mb-2">Q{idx + 1}</div>
                                            <p className="font-semibold text-purple-800 text-lg mb-1">{q.question || "No question text available"}</p>
                                            <div className="mb-2">
                                                {q.options?.map((opt, i) => (
                                                    <p key={i} className={"flex items-center px-2 py-1 rounded mb-1 " + (q.correctAnswer === i ? "bg-green-100 text-green-700 font-bold" : "bg-white text-gray-700") }>
                                                        <span className="w-6 font-bold text-purple-500">{String.fromCharCode(65 + i)}.</span>
                                                        {q.correctAnswer === i ? "✅" : ""} {typeof opt === 'object' && opt !== null ? opt.text : opt}
                                                    </p>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                <span className="font-semibold text-purple-500">Explanation:</span> {q.explanation}
                                            </p>
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => setEditingQuestion(q)}
                                                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded font-bold shadow transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteQuestion(selectedExam._id, q._id)
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded font-bold shadow transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}