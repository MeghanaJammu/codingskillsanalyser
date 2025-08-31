import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { GiBrain } from "react-icons/gi";
import { FaArrowTrendUp, FaLaptopCode } from "react-icons/fa6";
import { TbAnalyzeFilled } from "react-icons/tb";
import { useTimer } from "../../context/TimerContext";

const Home = () => {
  const secondSectionRef = useRef(null);
  const navigate = useNavigate();
  const { startTimer } = useTimer();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const topicOptions = [
    { value: "array", label: "Arrays" },
    { value: "binary_search", label: "Binary Search" },
    { value: "string", label: "Strings" },
    { value: "recursion", label: "Recursion" },
    { value: "linked_list", label: "Linked Lists" },
    { value: "bit_manipulation", label: "Bit Manipulation" },
    { value: "math", label: "Math" },
    { value: "combinatorics", label: "Combinatorics" },
    { value: "sliding_window", label: "Sliding Window" },
    { value: "two_pointer", label: "Two Pointer" },
    { value: "greedy", label: "Greedy" },
    { value: "binary_tree", label: "Binary Tree" },
    { value: "binary_search_tree", label: "Binary Search Tree" },
    { value: "stack", label: "Stacks" },
    { value: "heap", label: "Heaps" },
    { value: "graphs", label: "Graphs" },
    { value: "dp", label: "Dynamic Programming" },
  ];

  // Restore selected topics from localStorage
  const [selectedTopics, setSelectedTopics] = useState(() => {
    const saved = localStorage.getItem("topics");
    if (saved) {
      return JSON.parse(saved)
        .map((val) => topicOptions.find((opt) => opt.value === val))
        .filter(Boolean);
    }
    return [];
  });

  // Restore difficulty counts from localStorage
  const [difficultyCounts, setDifficultyCounts] = useState(() => {
    const saved = localStorage.getItem("difficultyCounts");
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  const onChangeOptions = (selected) => {
    setSelectedTopics(selected);
  };

  const onCountChange = (level, value) => {
    setDifficultyCounts((prev) => ({
      ...prev,
      [level.toLowerCase()]: parseInt(value) || 0,
    }));
  };

  const handleStartSolving = () => {
    const topics = selectedTopics.map((option) => option.value);

    // Save to localStorage for persistence
    localStorage.setItem("topics", JSON.stringify(topics));
    localStorage.setItem("difficultyCounts", JSON.stringify(difficultyCounts));

    startTimer(difficultyCounts);

    navigate("/questions", {
      state: {
        topics,
        difficultyCounts,
      },
    });
  };

  const onLoggingOut = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Section One */}
      <div className="bg-black text-white min-h-screen flex flex-col">
        {/* Navigation */}
        <div className="h-[7vh] flex justify-between items-center px-6 py-2 bg-[#2a495c] text-white">
          <div className="font-semibold text-sm">LOGO/TITLE</div>
          <button
            onClick={onLoggingOut}
            className="bg-[#373c40] cursor-pointer hover:bg-black border border-[#6d8391] px-4 py-1 rounded-md text-sm"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col-reverse lg:flex-row flex-1 p-3 md:py-1  md:px-10 items-center justify-between gap-6">
          {/* Left */}
          <div className="w-full text-center lg:w-1/2 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-snug text-gray-100">
              Become a better <br /> coder the smarter way
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-400">
              Analyze and improve different aspects of <br /> your code using
              AI.
            </p>
            <button
              onClick={() =>
                secondSectionRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-6 bg-[#2d2d2d] cursor-pointer hover:bg-[#444] text-white font-medium px-6 py-2 rounded-md"
            >
              Try Now
            </button>
          </div>

          {/* Right */}
          <div className="relative w-full lg:w-1/2 flex justify-center">
            <img
              src="https://i.pinimg.com/736x/c6/2f/76/c62f7697ad1ab75b206ae3bf5b3a3caa.jpg"
              alt="Coder"
              className="w-full max-w-[350px] filter brightness-50 h-auto object-contain"
            />
            <div className="absolute top-10 right-10 rounded-full">
              <GiBrain className="text-white text-5xl md:text-6xl" />
            </div>
          </div>
        </div>

        {/* Bottom Steps */}
        <div className="bg-black border-t border-gray-700 p-6 md:p-10 flex flex-wrap justify-center gap-12 text-sm">
          {[
            ["Solve Questions", FaLaptopCode],
            ["Get Feedback", TbAnalyzeFilled],
            ["Improve", FaArrowTrendUp],
          ].map(([label, Icon], idx) => (
            <div
              key={idx}
              className="flex flex-col md:mr-20 items-center gap-4 text-gray-300"
            >
              <Icon className="text-gray-400 text-4xl" />
              <p className="text-lg font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Two */}
      <div
        ref={secondSectionRef}
        className="min-h-screen bg-black w-full px-4 py-12 pt-25 text-white font-sans"
      >
        <div className="flex flex-col-reverse lg:flex-row w-full max-w-7xl mx-auto items-center gap-10">
          {/* Left */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Boost Your Coding <br />
              Precision with <span className="text-gray-300">AI</span>
            </h1>

            <ul className="mt-8 space-y-4 text-base md:text-lg text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-2xl">✔</span> Choose
                Topics
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-2xl">✔</span> Set
                Difficulty & Timer
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-2xl">✔</span> Solve and
                submit
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-2xl">✔</span> Get Smart
                Feedback Instantly
              </li>
            </ul>
          </div>

          {/* Middle Image */}
          <img
            src="https://i.pinimg.com/736x/cb/3c/ef/cb3cefbcba842dc7a34c0dfafcf38858.jpg"
            alt="guy coding"
            className="w-full max-w-[400px] h-auto object-contain filter brightness-50"
          />

          {/* Right Form */}
          <div className="bg-[#171613] rounded-xl p-6 md:p-8 shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
              SELECT TOPICS
            </h2>

            <div className="mb-6">
              <Select
                isMulti
                options={topicOptions}
                value={selectedTopics}
                onChange={onChangeOptions}
                className="text-black"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#1e1e1e",
                    borderColor: "#444",
                    color: "white",
                  }),
                  multiValue: (styles) => ({
                    ...styles,
                    backgroundColor: "#333",
                  }),
                  multiValueLabel: (styles) => ({ ...styles, color: "white" }),
                  multiValueRemove: (styles) => ({
                    ...styles,
                    color: "white",
                    ":hover": { backgroundColor: "#555", color: "white" },
                  }),
                  singleValue: (styles) => ({ ...styles, color: "white" }),
                  input: (styles) => ({ ...styles, color: "white" }),
                  menu: (styles) => ({
                    ...styles,
                    backgroundColor: "#1e1e1e",
                    color: "white",
                  }),
                  option: (styles, { isFocused, isSelected }) => ({
                    ...styles,
                    backgroundColor: isSelected
                      ? "#444"
                      : isFocused
                        ? "#2a2a2a"
                        : "#1e1e1e",
                    color: "white",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-base font-semibold mb-2 text-gray-300">
                Number of questions for each level:
              </label>
              <div className="space-y-2">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <div
                    key={level}
                    className="flex justify-between items-center"
                  >
                    <span>{level}</span>
                    <input
                      type="number"
                      min="0"
                      value={difficultyCounts[level.toLowerCase()] || ""}
                      onChange={(e) => onCountChange(level, e.target.value)}
                      className="w-20 bg-[#1e1e1e] border border-gray-600 px-2 py-1 rounded-md text-white text-right"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartSolving}
              className="w-full bg-[#2d2d2d] cursor-pointer hover:bg-[#444] py-2 rounded-md text-lg font-semibold"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
