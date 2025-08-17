import React from "react";
import PropTypes from "prop-types";

const Examples = ({ examples, results }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-200">Examples</h2>
      <div className="flex flex-col gap-4">
        {examples.map((ex, idx) => {
          const result = results?.[idx]; // link result by index
          return (
            <div
              key={idx}
              className="bg-[#1a1a2e] p-4 rounded-xl border border-gray-700 shadow-md"
            >
              <p className="text-sm text-gray-400 mb-2 font-semibold">
                Example {idx + 1}
              </p>

              <p className="mb-1">
                <span className="font-semibold text-gray-300">Input: </span>
                <span className="text-gray-100">{ex.formatted_input}</span>
              </p>

              <p className="mb-1">
                <span className="font-semibold text-gray-300">Expected: </span>
                <span className="text-gray-100">{ex.output}</span>
              </p>

              {ex.explanation && (
                <p className="mb-2">
                  <span className="font-semibold text-gray-300">
                    Explanation:
                  </span>
                  <br />
                  <span className="text-gray-400 whitespace-pre-line">
                    {ex.explanation.trim()}
                  </span>
                </p>
              )}

              {/* Show runtime output if available */}
              {result && (
                <p className="mt-2">
                  <span className="font-semibold text-gray-300">
                    Your Output:{" "}
                  </span>
                  <span
                    className={
                      result.output.trim() === ex.output.trim()
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {result.output}
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Examples.propTypes = {
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      formatted_input: PropTypes.string,
      output: PropTypes.string,
      explanation: PropTypes.string,
    })
  ),
  results: PropTypes.arrayOf(
    PropTypes.shape({
      output: PropTypes.string,
    })
  ),
};

export default Examples;
