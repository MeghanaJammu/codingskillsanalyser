import React from "react";
import PropTypes from "prop-types";
import { useQuestion } from "../context/QuestionContext";

const Question = () => {
  const { question, loading } = useQuestion();

  if (loading || !question) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a] text-gray-400 text-lg">
        Loading question...
      </div>
    );
  }

  const difficultyColors = {
    Easy: "text-green-400 border border-green-400/30 bg-green-400/10",
    Medium: "text-yellow-400 border border-yellow-400/30 bg-yellow-400/10",
    Hard: "text-red-400 border border-red-400/30 bg-red-400/10",
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6 text-gray-200 bg-[#0f172a] rounded-xl shadow-lg border border-gray-700">
      {/* Title + difficulty */}
      <div className="flex items-center justify-between flex-wrap mb-4">
        <h1 className="text-2xl font-semibold text-gray-100">
          {question.title}
        </h1>
        <span
          className={`px-3 py-1 rounded text-sm font-medium ${difficultyColors[question.difficulty]}`}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Description */}
      <div className="mb-6 whitespace-pre-line text-gray-300 leading-relaxed">
        {question.description}
      </div>

      {/* Input Format */}
      <div className="mb-4 bg-[#1e293b] p-4 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <h2 className="text-md font-semibold text-blue-400 mb-1">
          Input Format
        </h2>
        <p className="whitespace-pre-line text-gray-200">
          {question.input_format}
        </p>
      </div>

      {/* Output Format */}
      <div className="mb-4 bg-[#1e293b] p-4 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <h2 className="text-md font-semibold text-blue-400 mb-1">
          Output Format
        </h2>
        <p className="whitespace-pre-line text-gray-200">
          {question.output_format}
        </p>
      </div>

      {/* Examples */}
      {question.examples?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-md font-semibold text-blue-400 mb-2">Examples</h2>
          {question.examples.map((ex, idx) => (
            <div
              key={idx}
              className="mb-3 bg-[#1e293b] p-4 rounded-lg shadow-sm border border-gray-700 hover:shadow-md transition"
            >
              <p className="mb-1">
                <span className="font-semibold text-gray-200">Input:</span>{" "}
                <pre className="inline text-gray-100">{ex.formatted_input}</pre>
              </p>
              <p className="mb-1">
                <span className="font-semibold text-gray-200">Output:</span>{" "}
                <span className="text-gray-100">{ex.output}</span>
              </p>
              {ex.explanation && (
                <p className="mb-1">
                  <span className="font-semibold text-gray-200">
                    Explanation:
                  </span>
                  <br />
                  <span className="whitespace-pre-line text-gray-300">
                    {ex.explanation.trim()}
                  </span>
                </p>
              )}
              {ex.image_url && (
                <img
                  src={ex.image_url}
                  alt="explanation"
                  className="mt-2 rounded-lg border border-gray-600"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      <div className="bg-[#1e293b] p-4 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <h2 className="text-md font-semibold text-blue-400 mb-1">
          Constraints
        </h2>
        <p className="whitespace-pre-line text-gray-300">
          {question.constraints}
        </p>
      </div>
    </div>
  );
};

export default Question;

Question.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
