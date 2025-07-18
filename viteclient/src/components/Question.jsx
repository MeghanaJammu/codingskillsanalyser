import React from "react";
import PropTypes from "prop-types";

import { useQuestion } from "../context/QuestionContext";

const Question = () => {
  const { question, loading } = useQuestion();

  if (loading || !question) {
    return (
      <div className="text-center mt-10 text-gray-400 text-lg">
        Loading question...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-6 text-gray-300 bg-[#1e1e2e] rounded-xl shadow-lg overflow-y-auto">
      {/* Title and difficulty */}
      <div className="flex items-center justify-between flex-wrap mb-4">
        <h1 className="text-2xl font-bold">{question.title}</h1>
        <span
          className={`text-sm sm:mt-6 px-3 py-1 rounded-full font-semibold ${
            question.difficulty === "Easy"
              ? "bg-green-900"
              : question.difficulty === "Medium"
                ? "bg-yellow-900"
                : "bg-red-900"
          }`}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Description */}
      <div className="mb-6 whitespace-pre-line text-base leading-relaxed">
        {question.description}
      </div>

      {/* Input Format */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Input Format:</h2>
        <p className="whitespace-pre-line bg-[#2a2a40] p-3 rounded-md">
          {question.input_format}
        </p>
      </div>

      {/* Output Format */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Output Format:</h2>
        <p className="whitespace-pre-line bg-[#2a2a40] p-3 rounded-md">
          {question.output_format}
        </p>
      </div>

      {/* Examples */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Examples:</h2>
        {question.examples?.map((ex, idx) => (
          <div key={idx} className="mb-4 bg-[#2a2a40] p-4 rounded-md">
            <p>
              <span className="font-semibold">Input:</span> {ex.formatted_input}
            </p>
            <p>
              <span className="font-semibold">Output:</span> {ex.output}
            </p>
            {ex.explanation && (
              <p>
                <span className="font-semibold">Explanation:</span>
                <br />
                <span className="whitespace-pre-line">
                  {ex.explanation.trim()}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Constraints */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Constraints:</h2>
        <p className="whitespace-pre-line">{question.constraints}</p>
      </div>
    </div>
  );
};

export default Question;

Question.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
