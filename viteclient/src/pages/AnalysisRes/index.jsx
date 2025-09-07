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
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-8">
      <h1 className="text-3xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
        Analysis Results
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(results).map(([id, res]) => (
          <div
            key={id}
            className="bg-[#1e293b]/80 backdrop-blur-md border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-xl rounded-2xl p-6 space-y-5 hover:scale-[1.02]"
          >
            <h2 className="text-xl font-semibold text-blue-300 border-b border-gray-600 pb-2">
              {res.title}
            </h2>

            {/* Code Section */}
            <div>
              <h3 className="font-medium text-cyan-400 mb-1">Code</h3>
              <pre className="bg-[#0f172a] p-3 rounded-lg text-sm text-gray-100 border border-gray-700 shadow-inner font-mono leading-relaxed overflow-x-auto overflow-y-auto max-h-52 custom-scrollbar">
                {res.code}
              </pre>
            </div>

            {/* Complexity */}
            <div className="flex justify-between text-sm bg-[#0d1b2a] p-2 rounded-lg border border-gray-700">
              <span className="text-green-400">
                <span className="font-semibold">Time:</span> {res.tc_final}
              </span>
              <span className="text-yellow-400">
                <span className="font-semibold">Space:</span> {res.sc_gemini}
              </span>
            </div>

            {/* Suggestion */}
            <div>
              <h3 className="font-medium text-pink-400 mb-1">Suggestion</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {res.suggestion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="mt-12 flex justify-center">
        <button
          className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 rounded-xl shadow-lg font-semibold transition-all duration-300"
          onClick={handleGoHome}
        >
          <IoHome className="text-xl" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
