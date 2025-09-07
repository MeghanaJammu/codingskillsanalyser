/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { GoCheckCircleFill } from "react-icons/go";
import { RxCrossCircled } from "react-icons/rx";

const Examples = ({ examples, results }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-[#0d1b2a] text-gray-200 rounded-xl shadow-md">
      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-700 pb-2">
        {examples?.map((_, idx) => {
          const isPassed = results.length && results[idx]?.passed;
          const isActive = activeTab === idx;

          return (
            <button
              key={idx}
              className={`px-3 py-1 rounded-t-md transition flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? "border-b-2 border-blue-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(idx)}
            >
              <span>Test Case {idx + 1}</span>
              {results.length !== 0 && (
                <>
                  {isPassed ? (
                    <GoCheckCircleFill className="text-green-400" size={16} />
                  ) : (
                    <RxCrossCircled className="text-red-400" size={16} />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Test case content */}
      <div className="bg-[#1b263b] p-4 rounded-b-md mt-2">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-200 mb-1">Input</h3>
          <pre className="bg-[#0d1b2a] p-3 rounded text-gray-100 whitespace-pre-wrap">
            {examples[activeTab]?.input}
          </pre>
        </div>

        {results.length !== 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-200 mb-1">Your Output</h3>
              <pre className="bg-[#0d1b2a] p-3 rounded text-gray-100 whitespace-pre-wrap">
                {results[activeTab]?.actual}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-200 mb-1">
                Expected Output
              </h3>
              <pre className="bg-[#0d1b2a] p-3 rounded text-gray-100 whitespace-pre-wrap">
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
