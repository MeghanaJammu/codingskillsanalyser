import React, { useEffect, useState } from "react";
import { fetchFilteredQuestions } from "../../axios/selectedQuestions";
import { useLocation, useNavigate } from "react-router-dom";
import { useTimer } from "../../context/TimerContext";
import { useQuestion } from "../../context/QuestionContext";
import Cookies from "js-cookie";

const Questions = () => {
  const { startTimer } = useTimer();
  const { questions, setQuestionList, setCurrentIndex } = useQuestion();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { topics: stateTopics = [], difficultyCounts: stateDiffs = {} } =
    location.state || {};

  // fetch username from localStorage
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Fallback: load from localStorage if location.state is missing
    let storedTopics = stateTopics;
    let storedDiffs = stateDiffs;

    if (
      (!storedTopics || storedTopics.length === 0) &&
      username &&
      localStorage.getItem(`${username}_topics`)
    ) {
      storedTopics = JSON.parse(localStorage.getItem(`${username}_topics`));
    }

    if (
      Object.keys(storedDiffs).length === 0 &&
      username &&
      localStorage.getItem(`${username}_difficultyCounts`)
    ) {
      storedDiffs = JSON.parse(
        localStorage.getItem(`${username}_difficultyCounts`)
      );
    }

    // only fetch if context has no cached questions
    if (questions.length > 0) {
      setLoading(false);
      return;
    }

    const loadQuestions = async () => {
      try {
        const data = await fetchFilteredQuestions(storedTopics, storedDiffs);
        setQuestionList(data);
        console.log("here");
        console.log(data);

        // persist fetched questions (user-specific)
        if (username) {
          localStorage.setItem(`${username}_questions`, JSON.stringify(data));
        }

        startTimer(storedDiffs);
      } catch (err) {
        console.error("Error fetching questions", err);
      } finally {
        setLoading(false);
      }
    };

    // if already in localStorage (user-specific), use it
    if (username && localStorage.getItem(`${username}_questions`)) {
      setQuestionList(
        JSON.parse(localStorage.getItem(`${username}_questions`))
      );
      setLoading(false);
    } else {
      loadQuestions();
    }
  }, [stateTopics, stateDiffs, username]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-orange-400";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0e1726] text-white py-10 px-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {loading ? (
          <p className="text-gray-400 text-center">Loading questions...</p>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full rounded-lg overflow-hidden border border-[#1f2d3d]">
                <thead className="bg-[#1e293b] text-gray-300">
                  <tr>
                    <th className="py-3 px-4 text-left">QUESTION</th>
                    <th className="py-3 px-4 text-left">DIFFICULTY</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, index) => (
                    <tr
                      key={q.id}
                      className="border-t cursor-pointer border-[#1f2d3d] hover:bg-[#1a2233] transition-all"
                    >
                      <td className="py-3 px-4 text-blue-400 font-medium">
                        {q.title}
                      </td>
                      <td
                        className={`py-3 px-4 font-semibold ${getDifficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          className="text-blue-400 cursor-pointer hover:text-blue-500"
                          onClick={() => {
                            setCurrentIndex(index);
                            navigate(`/question/${q.id}`);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 inline-block"
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
                        </button>
                      </td>
                    </tr>
                  ))}
                  {questions.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-5 text-center text-gray-500"
                      >
                        No questions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 w-full flex justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md 
               hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 
               focus:ring-red-400 focus:ring-opacity-50 transition-colors duration-200"
              >
                End Test
              </button>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg w-[90%] max-w-md">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Are you sure you want to end the test?
                  </h2>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (username) {
                          localStorage.removeItem(`${username}_questions`);
                          localStorage.removeItem(`${username}_topics`);
                          localStorage.removeItem(
                            `${username}_difficultyCounts`
                          );
                          // remove all saved user code (for all questions + langs)
                          Object.keys(localStorage).forEach((key) => {
                            if (key.startsWith(`${username}_userCode_`)) {
                              localStorage.removeItem(key);
                            }
                          });
                        }
                        setQuestionList([]); // clear context
                        setCurrentIndex(0); // reset index
                        startTimer({}); // reset timer
                        navigate("/");
                      }}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, End Test
                    </button>
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
