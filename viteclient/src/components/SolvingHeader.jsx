import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useTimer } from "../context/TimerContext";
import { useQuestion } from "../context/QuestionContext";
import { useNavigate } from "react-router-dom";

const SolvingHeader = () => {
  const navigate = useNavigate();
  const { nextQuestion } = useQuestion();

  const handleNext = () => {
    const nextQ = nextQuestion();
    if (nextQ) {
      navigate(`/question/${nextQ.id}`);
    } else {
      navigate("/questions"); // or show results page
    }
  };

  const { secondsLeft, formatTime } = useTimer();
  const { question } = useQuestion();

  return (
    <div className="fixed w-screen top-0 left-0 z-50 bg-[#333342] shadow-md border-b border-gray-700 px-6 py-3 flex justify-between items-center">
      {/* Left: Back Button + Title */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="text-white cursor-pointer hover:text-blue-400"
        >
          <FaArrowLeftLong size={20} />
        </button>
        <h1 className="text-white text-sm sm:text-base font-semibold uppercase tracking-wide">
          Coding Exercise | {question?.title || "Loading..."}
        </h1>
      </div>

      {/* Right: Timer + Next Button */}
      <div className="flex items-center space-x-4">
        <div className="text-orange-400 font-mono font-semibold text-lg">
          {formatTime(secondsLeft)}
        </div>
        <button
          onClick={handleNext}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-md font-medium"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default SolvingHeader;
