import React, { useEffect, useState } from "react";
import { fetchFilteredQuestions } from "../../axios/selectedQuestions";
import { analyzeUserCodes } from "../../axios/analyzeCodes";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../../context/TimerContext";
import { useQuestion } from "../../context/QuestionContext";
import Cookies from "js-cookie";

const Questions = () => {
  const { startTimer } = useTimer();
  const { questions, setQuestionList, setCurrentIndex } = useQuestion();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (questions.length > 0) {
      setLoading(false);
      return;
    }

    const loadQuestions = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      const storedTopics = JSON.parse(
        localStorage.getItem(`${username}_topics`) || "[]"
      );
      const storedDiffs = JSON.parse(
        localStorage.getItem(`${username}_difficultyCounts`) || "{}"
      );

      if (storedTopics.length === 0 || Object.keys(storedDiffs).length === 0) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const data = await fetchFilteredQuestions(storedTopics, storedDiffs);
        setQuestionList(data);
        startTimer(storedDiffs);
      } catch (err) {
        console.error("Error fetching questions", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [username, questions.length, setQuestionList, startTimer, navigate]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1726] text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <img
            src="/codeSmartLogo.jpg"
            alt="CodeSmart Logo"
            className="w-12 h-12 object-contain rounded-full shadow-md border border-slate-700"
          />
          <h2 className="text-white font-extrabold text-2xl tracking-wide">
            <span className="hover:text-blue-400 transition-colors">Code</span>
            <span className="text-blue-400">Smart</span>
          </h2>
        </div>

        <h1 className="text-3xl font-semibold mb-8 text-center">Questions</h1>

        {loading ? (
          <p className="text-gray-400 text-center">Loading questions...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-[#1f2d3d] rounded-lg">
                <thead className="bg-[#1a2233] text-gray-300">
                  <tr>
                    <th className="text-left py-3 px-4">Question</th>
                    <th className="text-left py-3 px-4">Difficulty</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, index) => (
                    <tr
                      key={q.id}
                      className="border-t border-[#1f2d3d] hover:bg-[#151c2a] transition-colors cursor-pointer"
                      onClick={() => {
                        setCurrentIndex(index);
                        navigate(`/question/${q.id}`);
                      }}
                    >
                      <td className="py-3 px-4 font-medium text-blue-400">
                        {q.title}
                      </td>
                      <td
                        className={`py-3 px-4 font-semibold ${getDifficultyColor(q.difficulty)}`}
                      >
                        {q.difficulty}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 inline-block text-gray-400 hover:text-gray-200 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-600 cursor-pointer px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                End Test
              </button>
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-[#1e293b] w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
                  <div className="flex flex-col items-center text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-red-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
                      />
                    </svg>

                    <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                      End Test
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Are you sure you want to submit and end the test? This
                      action cannot be undone.
                    </p>

                    <div className="flex w-full justify-center gap-4">
                      {/* Cancel */}
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-2 px-4 rounded-lg bg-gray-700 text-gray-200 font-medium hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>

                      {/* End Test without Analysis */}
                      <button
                        onClick={() => {
                          const username = localStorage.getItem("username");
                          localStorage.clear();
                          if (username)
                            localStorage.setItem("username", username);
                          navigate("/");
                        }}
                        className="flex-1 py-2 px-4 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition"
                      >
                        End Test (No Analyze)
                      </button>

                      {/* End Test and Analyze */}
                      <button
                        onClick={async () => {
                          if (!questions || questions.length === 0) return;
                          setAnalyzing(true);
                          try {
                            const results = await analyzeUserCodes(questions);
                            navigate("/analysis-results", {
                              state: { results },
                            });
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setAnalyzing(false);
                          }
                        }}
                        className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                      >
                        {analyzing ? "Analyzing..." : "End Test & Analyze"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Questions;
