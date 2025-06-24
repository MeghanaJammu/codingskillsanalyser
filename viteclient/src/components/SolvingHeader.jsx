import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

const SolvingHeader = () => {
  const [secondsLeft, setSecondsLeft] = useState(3600); // 1 hour

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="fixed w-screen top-0 left-0 w-full z-50 bg-[#333342] shadow-md border-b border-gray-700 px-6 py-3 flex justify-between items-center">
      {/* Left: Back Button + Title */}
      <div className="flex items-center space-x-2">
        <button className="text-white hover:text-blue-400">
          <FaArrowLeftLong size={20} />
        </button>
        <h1 className="text-white text-sm sm:text-base font-semibold uppercase tracking-wide">
          Coding Exercise | K-Distant Indices
        </h1>
      </div>

      {/* Right: Timer + Next Button */}
      <div className="flex items-center space-x-4">
        <div className="text-orange-400 font-mono font-semibold text-lg">
          {formatTime(secondsLeft)}
        </div>
        <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-md font-medium">
          Next Question
        </button>
      </div>
    </div>
  );
};

export default SolvingHeader;
