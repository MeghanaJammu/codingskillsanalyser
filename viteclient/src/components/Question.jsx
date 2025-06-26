import React from "react";

const Question = () => {
  const question = {
    title: "2. Find All K-Distant Indices in an Array",
    difficulty: "Easy",
    description: `
You are given a 0-indexed integer array nums and two integers key and k.
A k-distant index is an index i of nums for which there exists at least one index j such that
|i - j| <= k and nums[j] == key.

Return a list of all k-distant indices sorted in increasing order.
    `,
    examples: [
      {
        input: "nums = [3,4,9,1,3,9,5], key = 9, k = 1",
        output: "[1,2,3,4,5,6]",
        explanation: `
nums[2] == key and nums[5] == key.
So, for all i in [1,2,3,4,5,6], there exists a j such that |i - j| <= 1 and nums[j] == key.
        `,
      },
      {
        input: "nums = [2,2,2,2,2], key = 2, k = 2",
        output: "[0,1,2,3,4]",
        explanation: `
Every index i has a j such that |i - j| <= 2 and nums[j] == key.
        `,
      },
    ],
    constraints: [
      "1 <= nums.length <= 1000",
      "1 <= nums[i] <= 1000",
      "key is an integer from the array nums",
    ],
  };

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

      {/* Examples */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Examples:</h2>
        {question.examples.map((ex, idx) => (
          <div key={idx} className="mb-4 bg-[#2a2a40] p-4 rounded-md">
            <p>
              <span className="font-semibold">Input:</span> {ex.input}
            </p>
            <p>
              <span className="font-semibold">Output:</span> {ex.output}
            </p>
            <p>
              <span className="font-semibold">Explanation:</span>
              <br />{" "}
              <span className="whitespace-pre-line">
                {ex.explanation.trim()}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Constraints */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Constraints:</h2>
        <ul className="list-disc pl-6 space-y-1">
          {question.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Question;
