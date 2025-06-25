import React from "react";
import SolvingHeader from "../../components/SolvingHeader";
import CodeEditor from "../../components/CodeEditor";
import Question from "../../components/Question";

const SolvingPage = () => {
  return (
    <div className="h-screen flex flex-col bg-[#0f0f1a]">
      {/* Fixed Header */}
      <SolvingHeader />

      {/* Scrollable two-pane layout */}
      <div className="flex flex-1 lg:flex-row overflow-hidden pt-[64px]">
        {/* Left: Question panel */}
        <div className="lg:w-[45%] w-full scrollable-container h-full overflow-y-auto border-r border-gray-700 bg-[#1a1a2e]">
          <div className="min-h-full max-w-3xl mx-auto p-6 text-gray-300 bg-[#1e1e2e] rounded-xl shadow-lg">
            <Question />
          </div>
        </div>

        {/* Right: Code Editor panel */}
        <div className="lg:w-[55%] w-full scrollable-container h-full overflow-y-auto bg-[#171628]">
          <div className="min-h-full p-4 sm:p-6 flex flex-col gap-6">
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvingPage;
