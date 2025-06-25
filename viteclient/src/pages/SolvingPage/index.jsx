import React, { useRef, useState, useEffect } from "react";
import SolvingHeader from "../../components/SolvingHeader";
import CodeEditor from "../../components/CodeEditor";
import Question from "../../components/Question";

const SolvingPage = () => {
  const [leftWidth, setLeftWidth] = useState(40); // in %
  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
  };

  const stopResizing = () => {
    isResizing.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newLeft = (e.clientX / window.innerWidth) * 100;
    if (newLeft > 20 && newLeft < 80) {
      setLeftWidth(newLeft);
    }
  };

  // ensure mouseup is handled even outside the div
  useEffect(() => {
    window.addEventListener("mouseup", stopResizing);
    return () => window.removeEventListener("mouseup", stopResizing);
  }, []);

  return (
    <div
      className="h-screen flex flex-col bg-[#0f0f1a] select-none"
      onMouseMove={handleMouseMove}
    >
      {/* Fixed Header */}
      <SolvingHeader />

      {/* Resizable Layout */}
      <div className="flex flex-1 pt-[64px] overflow-hidden">
        {/* Question Panel */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="scrollable-container overflow-y-auto h-full border-r border-gray-700"
        >
          <div className="min-h-full max-w-3xl mx-auto p-6 text-gray-300 bg-[#1a1a2e] rounded-xl shadow-lg">
            <Question />
          </div>
        </div>

        {/* Divider */}
        <div
          onMouseDown={startResizing}
          className="w-1 bg-gray-600 hover:bg-gray-400 cursor-col-resize"
        />

        {/* Code Editor Panel */}
        <div className="flex-1 scrollable-container overflow-y-auto h-full bg-[#0f0f1a]">
          <div className="min-h-full p-4 sm:p-6 flex flex-col gap-6">
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvingPage;
