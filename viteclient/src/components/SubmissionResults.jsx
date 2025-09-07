/* eslint-disable react/prop-types */
import React from "react";
import { GoCheckCircleFill } from "react-icons/go";
import { RxCrossCircled } from "react-icons/rx";

const SubmissionResults = ({ results }) => {
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-gray-200 rounded-2xl shadow-2xl border border-gray-700">
      {/* Header */}
      <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
        Submission Results
      </h2>

      {/* Summary */}
      <div className="flex flex-col items-center mb-10">
        <p className="text-lg font-medium">
          Passed <span className="text-green-400 font-bold">{passed}</span> out
          of <span className="text-yellow-400 font-bold">{total}</span> test
          cases
        </p>
        {passed === total ? (
          <div className="mt-4 flex items-center space-x-3 text-green-400 text-lg font-semibold">
            <GoCheckCircleFill className="text-green-500" size={32} />
            <span>All test cases passed! 🎉</span>
          </div>
        ) : (
          <div className="mt-4 flex items-center space-x-3 text-red-400 text-lg font-semibold">
            <RxCrossCircled className="text-red-500" size={32} />
            <span>Some test cases failed</span>
          </div>
        )}
      </div>

      {/* Test case cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {results.map((r, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-5 shadow-md border transition-all duration-300 ${
              r.passed
                ? "bg-green-500/10 border-green-500/40 hover:shadow-green-500/30"
                : "bg-red-500/10 border-red-500/40 hover:shadow-red-500/30"
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              {r.passed ? (
                <GoCheckCircleFill className="text-green-400" size={28} />
              ) : (
                <RxCrossCircled className="text-red-400" size={28} />
              )}
              <h3
                className={`font-semibold text-lg ${
                  r.passed ? "text-green-400" : "text-red-400"
                }`}
              >
                Test Case {idx + 1}
              </h3>
            </div>

            {/* Show details only if failed */}
            {!r.passed && (
              <div className="text-sm space-y-2">
                <p className="text-gray-300">
                  <span className="font-semibold text-red-400">
                    Your Output:
                  </span>{" "}
                  {r.actual}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold text-blue-400">Expected:</span>{" "}
                  {r.expected}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionResults;
