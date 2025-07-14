import React, { useEffect, useState } from "react";
import { fetchFilteredQuestions } from "../../axios/selectedQuestions";
import { useLocation, useNavigate } from "react-router-dom";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { topics = [], difficultyCounts = {} } = location.state || {};

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchFilteredQuestions(topics, difficultyCounts);
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [topics, difficultyCounts]);

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
      <div className="w-full max-w-5xl mx-auto">
        {loading ? (
          <p className="text-gray-400 text-center">Loading questions...</p>
        ) : (
          <table className="w-full rounded-lg overflow-hidden border border-[#1f2d3d]">
            <thead className="bg-[#1e293b] text-gray-300">
              <tr>
                <th className="py-3 px-4 text-left">QUESTION</th>
                <th className="py-3 px-4 text-left">DIFFICULTY</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr
                  key={q.id}
                  className="border-t cursor-pointer border-[#1f2d3d] hover:bg-[#1a2233] transition-all"
                >
                  <td className="py-3 px-4 text-blue-400 font-medium">
                    {q.title}
                  </td>
                  <td
                    className={`py-3 px-4 font-semibold ${getDifficultyColor(q.difficulty)}`}
                  >
                    {q.difficulty}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="text-blue-400 cursor-pointer hover:text-blue-500"
                      onClick={() =>
                        navigate(`/question/${q.id}`)
                      } /*this is the button which navigates user to specific question code editor page*/
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
              {questions.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-5 text-center text-gray-500">
                    No questions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Questions;
