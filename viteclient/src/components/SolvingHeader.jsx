import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useTimer } from "../context/TimerContext";
import { useQuestion } from "../context/QuestionContext";
import { useNavigate } from "react-router-dom";

const SolvingHeader = () => {
  const navigate = useNavigate();
  const { nextQuestion, question } = useQuestion();
  const { secondsLeft, formatTime } = useTimer();

  const handleNext = () => {
    const nextQ = nextQuestion();
    if (nextQ) {
      navigate(`/question/${nextQ.id}`);
    } else {
      navigate("/questions");
    }
  };

  return (
    <header
      className="fixed w-full top-0 left-0 z-50 
      bg-gradient-to-r from-[#11131F] via-[#1C1F2E] to-[#11131F] 
      border-b border-indigo-600/40 shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-[#1C1F2E] hover:bg-[#262B3F] 
            transition text-gray-300 hover:text-white cursor-pointer"
          >
            <FaArrowLeftLong size={18} />
          </button>
          <h1 className="text-gray-200 text-sm sm:text-base font-semibold tracking-wide">
            <span className="text-indigo-400">Coding Exercise</span> |{" "}
            {question?.title || "Loading..."}
          </h1>
        </div>

        {/* Right: Timer + Next */}
        <div className="flex items-center gap-5">
          <div
            className="px-3 py-1.5 rounded-md bg-[#1C1F2E] border border-gray-700 
            text-orange-400 font-mono font-bold text-lg shadow-sm"
          >
            {formatTime(secondsLeft)}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 
            hover:opacity-90 transition text-white text-sm font-medium shadow-md cursor-pointer"
          >
            Next Question
          </button>
        </div>
      </div>
    </header>
  );
};

export default SolvingHeader;
