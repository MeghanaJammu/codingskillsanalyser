/* eslint-disable react/prop-types */
import React from "react";

const SubmissionResults = ({ results }) => {
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-[#0d1b2a] text-gray-200 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-400">
        Submission Results
      </h2>
      <p className="mb-4">
        Passed <span className="text-green-400">{passed}</span> out of{" "}
        <span className="text-yellow-400">{total}</span> test cases.
      </p>

      {passed === total ? (
        <div className="text-green-400 font-semibold">
          🎉 All test cases passed!
        </div>
      ) : (
        <div>
          <h3 className="text-red-400 font-semibold mb-2">Failed Cases</h3>
          <ul className="list-disc pl-6 space-y-2">
            {results.map((r, idx) =>
              !r.passed ? (
                <li key={idx}>
                  <p>❌ Test Case {idx + 1}</p>
                  <p className="text-sm text-gray-400">
                    Your Output: {r.actual}
                  </p>
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubmissionResults;
