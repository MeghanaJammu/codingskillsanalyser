import React from "react";
import CodeEditor from "../../components/CodeEditor";
import Question from "../../components/Question";
import SolvingHeader from "../../components/SolvingHeader";

const SolvingPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-1 flex-col lg:flex-row overflow-hidden pt-[64px]">
      {/* Top Header */}
      <SolvingHeader />

      {/* Main Content Section */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Question Section */}
        <div className="lg:w-[45%] w-full p-4 overflow-y-auto border-r border-gray-700 bg-[#1a1a2e]">
          <Question />
        </div>

        {/* Code Editor Section */}
        <div className="lg:w-[55%] w-full p-4 overflow-y-auto">
          <CodeEditor />
        </div>
      </div>
    </div>
  );
};

export default SolvingPage;
