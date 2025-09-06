import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { useTimer } from "../../context/TimerContext";
import { useQuestion } from "../../context/QuestionContext";

const AnalysisResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearSession } = useQuestion();
  const { resetTimer } = useTimer();

  const results = location.state?.results?.results || {};

  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <p className="text-lg">No analysis results found.</p>
      </div>
    );
  }

  const handleGoHome = () => {
    clearSession();
    resetTimer();

    const username = localStorage.getItem("username");
    if (username) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(`${username}_userCode_`)) {
          localStorage.removeItem(key);
        }
      });
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Analysis Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(results).map(([id, res]) => (
          <div
            key={id}
            className="bg-[#1e293b] border border-gray-700 shadow-lg rounded-2xl p-4 space-y-4"
          >
            <h2 className="text-lg font-semibold">{res.title}</h2>

            <div>
              <h3 className="font-medium text-blue-300">Code</h3>
              <pre className="bg-[#0f172a] p-2 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                {res.code}
              </pre>
            </div>

            <div className="flex justify-between text-sm">
              <span>
                <span className="font-semibold">Time:</span> {res.tc_final}
              </span>
              <span>
                <span className="font-semibold">Space:</span> {res.sc_gemini}
              </span>
            </div>

            <div>
              <h3 className="font-medium text-blue-300">Suggestion</h3>
              <p className="text-sm text-gray-300">{res.suggestion}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
          onClick={handleGoHome}
        >
          <IoHome className="text-lg" />
          Home
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
