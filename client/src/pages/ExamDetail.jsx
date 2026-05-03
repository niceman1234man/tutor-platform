import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ExamDetail() {
  // Animation styles for this component only
  const animationStyles = `
    .animate-fade-in { animation: fadeIn 0.5s; }
    .animate-pop { animation: popIn 0.3s; }
    .animate-shake { animation: shake 0.3s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
    @keyframes popIn { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
    @keyframes shake { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(4px); } 30%, 50%, 70% { transform: translateX(-8px); } 40%, 60% { transform: translateX(8px); } }
  `;

  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [taking, setTaking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const { data } = await API.get(`/admin/exams/${id}`);
        if (!mounted) return;
        setExam(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load exam.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => (mounted = false);
  }, [id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  if (loading) return <div className="p-6">Loading exam…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!exam) return <div className="p-6">Exam not found.</div>;

  const beginExam = () => {
    setTaking(true);
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setShowFinal(false);
    setScore(0);
    // initialize and start timer (in seconds)
    const seconds = exam.duration ? Number(exam.duration) * 60 : 0;
    setTimeLeft(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    if (seconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            // finish exam when time's up
            setTaking(false);
            // show final score modal
            setShowFinal(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  };

  const chooseAnswer = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const q = exam.questions[currentIndex];
    if (Number(idx) === Number(q.correctAnswer)) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    const next = currentIndex + 1;
    if (next < (exam.questions?.length || 0)) {
      setCurrentIndex(next);
      setSelected(null);
      setShowResult(false);
    } else {
      // finished
      setTaking(false);
      setShowFinal(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentQuestion = taking && exam.questions ? exam.questions[currentIndex] : null;

  const progressPercent = exam.questions && exam.questions.length > 0
    ? Math.round((currentIndex / exam.questions.length) * 100)
    : 0;

  return (
    <>
      <style>{animationStyles}</style>
      <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-teal-50 shadow-2xl rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b pb-4 mb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-teal-700 drop-shadow-sm tracking-tight mb-1 animate-fade-in">{exam.title}</h2>
            <div className="text-sm text-gray-500">Category: <span className="font-semibold text-indigo-600">{exam.category || "—"}</span></div>
            <div className="text-sm text-gray-500">Duration: <span className="font-semibold text-indigo-600">{exam.duration ? `${exam.duration} minutes` : "—"}</span></div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="mr-2 border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 transition">Back</button>
            {!taking ? (
              <button onClick={beginExam} className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow-lg font-semibold text-lg hover:scale-105 active:scale-100 transition-transform duration-150 animate-pop">Begin Exam</button>
            ) : (
              <div className="text-sm text-gray-600 text-right">
                <div className="font-medium">Question <span className="text-indigo-600">{currentIndex + 1}</span> / {exam.questions.length}</div>
                <div className="text-xs text-gray-500">Time: <span className="font-semibold text-teal-700">{timeLeft > 0 ? formatTime(timeLeft) : '00:00'}</span></div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-1">Progress: <span className="font-semibold text-indigo-600">{progressPercent}%</span></div>
        </div>

        <div className="mt-6 space-y-4">
          {exam.questions && exam.questions.length === 0 && (
            <div className="text-gray-600">No questions in this exam.</div>
          )}

          {currentQuestion ? (
            <div key={currentIndex} className="p-6 border-2 border-indigo-100 rounded-2xl bg-white shadow-xl animate-fade-in">
              <div className="font-semibold text-lg text-indigo-700 mb-2 flex items-center gap-2">
                <span className="inline-block bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">Q{currentIndex + 1}</span>
                {currentQuestion.question}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {currentQuestion.options && currentQuestion.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = Number(currentQuestion.correctAnswer) === Number(idx);
                  let cls = "flex items-center justify-between text-left px-5 py-3 rounded-xl border-2 font-medium text-lg shadow-sm transition-all duration-150 cursor-pointer";
                  if (!showResult) cls += " hover:bg-teal-50 hover:border-teal-300";
                  if (showResult) {
                    if (isCorrect) cls += " bg-green-50 border-green-400 animate-pop";
                    else if (isSelected) cls += " bg-red-50 border-red-400 animate-shake";
                    else cls += " bg-white border-gray-200";
                  } else {
                    cls += " border-gray-200";
                  }
                  return (
                    <button
                      key={idx}
                      className={cls}
                      onClick={() => chooseAnswer(idx)}
                      disabled={showResult}
                      style={{ boxShadow: isSelected && !showResult ? '0 0 0 2px #38b2ac' : undefined }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-indigo-500 text-xl">{String.fromCharCode(65 + idx)}.</span>
                        <span>{opt.text || opt}</span>
                      </div>
                      <div className="ml-4 text-xl">
                        {showResult && isCorrect && <span className="text-green-600">✓</span>}
                        {showResult && isSelected && !isCorrect && <span className="text-red-500">✕</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className="mt-5 animate-fade-in">
                  <div className={`font-bold text-lg ${Number(selected) === Number(currentQuestion.correctAnswer) ? 'text-green-700' : 'text-red-600'}`}
                  >
                    {Number(selected) === Number(currentQuestion.correctAnswer) ? 'Correct 🎉' : 'Incorrect'}
                  </div>
                  {currentQuestion.explanation && (
                    <div className="text-base text-gray-600 mt-2">Explanation: {currentQuestion.explanation}</div>
                  )}
                  <div className="mt-4">
                    <button onClick={nextQuestion} className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white px-6 py-2 rounded-lg shadow-md font-semibold text-lg hover:scale-105 active:scale-100 transition-transform duration-150">
                      {currentIndex + 1 < exam.questions.length ? 'Next' : 'Finish'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Not taking: show summary list but hide correct answers/explanations
            exam.questions && exam.questions.map((q, i) => (
              <div key={i} className="p-4 border-2 border-indigo-100 rounded-2xl bg-white shadow-md mb-2 animate-fade-in">
                <div className="font-semibold text-indigo-700 mb-1 flex items-center gap-2">
                  <span className="inline-block bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">Q{i + 1}</span>
                  {q.question}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.options && q.options.map((opt, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-base bg-white text-gray-800 border border-gray-200">
                      {String.fromCharCode(65 + idx)}. {opt.text || opt}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}

          {!taking && showResult === false && exam.questions && exam.questions.length > 0 && (
            <div className="text-sm text-gray-500">Click "Begin Exam" to start — correct answers and explanations will be revealed after you answer each question.</div>
          )}

          {!taking && score > 0 && (
            <div className="mt-4 font-medium">Score: {score} / {exam.questions.length}</div>
          )}

          {/* Final modal */}
          {showFinal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
              <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm" onClick={() => setShowFinal(false)} />
              <div className="relative bg-gradient-to-br from-white via-indigo-50 to-teal-50 rounded-2xl p-8 shadow-2xl w-full max-w-md border-2 border-indigo-200 animate-pop">
                <h3 className="text-2xl font-extrabold text-teal-700 mb-2">Exam Finished</h3>
                <p className="mt-2 text-gray-700 text-lg">Your score: <span className="font-bold text-indigo-600 text-xl">{score} / {exam.questions.length}</span></p>
                <div className="mt-6 flex gap-4 justify-center">
                  <button onClick={() => { setShowFinal(false); beginExam(); }} className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow-md font-semibold text-lg hover:scale-105 active:scale-100 transition-transform duration-150">Retake</button>
                  <button onClick={() => navigate(-1)} className="border border-gray-300 px-6 py-2 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">Back</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
