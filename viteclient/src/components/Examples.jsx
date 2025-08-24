/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useQuestion } from "../context/QuestionContext";

const Examples = ({ examples, results }) => {
  const [activeTab, setActiveTab] = useState(0);
  console.log(results);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-[#0d1b2a] text-gray-200 rounded-xl shadow-lg">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-600 pb-2">
        {examples?.map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded-t-md transition ${
              activeTab === idx
                ? "bg-[#1b263b] border border-b-0 border-blue-500 text-blue-400"
                : "bg-[#1b263b] text-gray-400 hover:text-blue-300"
            } flex items-center space-x-2 cursor-pointer`}
            onClick={() => setActiveTab(idx)}
          >
            <span>TEST CASE {idx + 1}</span>
            {results.length !== 0 &&
              (results[idx]?.passed ? (
                <span className="text-green-400">✔</span>
              ) : (
                <span className="text-red-400">✘</span>
              ))}
          </button>
        ))}
      </div>

      {/* Test case content */}
      <div className="bg-[#1b263b] p-4 rounded-b-md">
        <h3 className="font-semibold text-blue-500 mb-2">Input</h3>
        <pre className="bg-[#0d1b2a] p-3 rounded-md text-gray-100 whitespace-pre-wrap">
          {examples[activeTab]?.input}
        </pre>

        {results.length !== 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-blue-500 mb-2">Your Output</h3>
              <pre className="bg-[#0d1b2a] p-3 rounded-md text-gray-100 whitespace-pre-wrap">
                {results[activeTab]?.actual}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-blue-500 mb-2">Expected</h3>
              <pre className="bg-[#0d1b2a] p-3 rounded-md text-gray-100 whitespace-pre-wrap">
                {examples[activeTab]?.output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Examples;
