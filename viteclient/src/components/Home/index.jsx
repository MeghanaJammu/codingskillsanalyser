import React from "react";

import Select from "react-select";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { GiBrain } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { TbAnalyzeFilled } from "react-icons/tb";
import { FaLaptopCode } from "react-icons/fa6";

const Home = () => {
  const secondSectionRef = useRef(null);
  const navigate = useNavigate();

  const topicOptions = [
    { value: "binaryTree", label: "Binary Tree" },
    { value: "binarySearchTree", label: "Binary Search Tree" },
    { value: "linkedLists", label: "Linked Lists" },
    { value: "stacks", label: "Stacks" },
    { value: "queues", label: "Queues" },
    { value: "heaps", label: "Heaps" },
    { value: "sorting", label: "Sorting" },
    { value: "searching", label: "Searching" },
    { value: "graphs", label: "Graphs" },
    { value: "dp", label: "Dynamic Programming" },
    { value: "recursion", label: "Recursion" },
    { value: "arrays", label: "Arrays" },
    { value: "strings", label: "Strings" },
  ];

  const handleTryNowClick = () => {
    secondSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [selectedTopics, setSelectedTopics] = useState([]);

  const onChangeOptions = (selected) => {
    setSelectedTopics(selected);
    const selectedValues = selected.map((option) => option.value);
    console.log("Selected Topics:", selectedValues);
  };

  const onLoggingOut = () => {
    navigate("/login");
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/*Section One*/}
      <div className="bg-black text-white h-screen w-screen flex flex-col">
        {/*navigation bar*/}
        <div className="h-[10vh] flex justify-between items-center px-10 py-2 bg-[#2c2c2c] text-white">
          <div className="font-semibold text-sm">LOGO/TITLE</div>
          <button
            onClick={onLoggingOut}
            className="bg-[#3f3f3f] hover:bg-[#5a5a5a] px-4 py-1 rounded-full text-sm"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 p-10 items-center justify-between">
          {/* Left Section */}
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold leading-snug text-gray-100">
              Become a better <br /> coder the smarter way
            </h1>
            <p className="mt-4 text-xl text-gray-400">
              Analyze and improve different aspects of <br /> your code using
              AI.
            </p>
            <button
              onClick={handleTryNowClick}
              className="mt-6 bg-[#2d2d2d] hover:bg-[#444] text-white font-medium px-6 py-2 rounded-md"
            >
              Try Now
            </button>
          </div>

          {/* Right Section */}
          <div className="relative">
            <img
              src="https://t3.ftcdn.net/jpg/12/06/93/54/360_F_1206935418_7DMt53VUEroTnschxh9J0B6kgCL2AHPj.jpg"
              alt="Coder"
              className="w-[800px] max-w-full h-auto"
            />
            <div className="absolute top-25 right-25 rounded-full">
              <GiBrain className="text-white text-6xl" />
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-black border-t border-gray-700 p-10 flex justify-center text-sm">
          <div className="flex flex-col mr-60 items-center gap-2 text-gray-300">
            <FaLaptopCode className="text-gray-400 text-4xl" />
            <p className="text-lg font-medium">Write Code</p>
          </div>
          <div className="flex flex-col mr-60 items-center gap-2 text-gray-300">
            <TbAnalyzeFilled className="text-gray-400 text-4xl" />
            <p className="text-lg font-medium">Get Feedback</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <FaArrowTrendUp className="text-gray-400 text-4xl" />
            <p className="text-lg font-medium">Improve</p>
          </div>
        </div>
      </div>

      <div
        ref={secondSectionRef}
        className="bg-black min-h-screen w-full flex items-center justify-center px-10 py-10 text-white font-sans"
      >
        <div className="flex w-full max-w-7xl justify-between items-center gap-16">
          {/* Left Content */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold leading-tight">
              Boost Your Coding <br />
              Precision with <span className="text-gray-300">AI</span>
            </h1>

            <ul className="mt-8 space-y-4 text-lg text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-3xl">✔</span> Choose
                Topics
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-3xl">✔</span> Set
                Difficulty & Timer
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-3xl">✔</span> Get Smart
                Feedback Instantly
              </li>
            </ul>
          </div>

          {/* Right Box */}
          <div className="bg-[#242424] rounded-xl p-8 shadow-md w-full max-w-md">
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
                  multiValueLabel: (styles) => ({
                    ...styles,
                    color: "white",
                  }),
                  multiValueRemove: (styles) => ({
                    ...styles,
                    color: "white",
                    ":hover": {
                      backgroundColor: "#555",
                      color: "white",
                    },
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
              <label className="block text-lg font-semibold mb-2 text-gray-300">
                Number of questions for each level :
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
                      className="w-20 bg-[#1e1e1e] border border-gray-600 px-2 py-1 rounded-md text-white text-right"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-300">
                Time Limit (mins)
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="time"
                    defaultChecked
                    className="accent-blue-500"
                  />
                  Auto
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="time" className="accent-blue-500" />
                  Custom
                </label>
              </div>
            </div>

            <button className="w-full bg-[#2d2d2d] hover:bg-[#444] py-2 rounded-md text-lg font-semibold">
              Start Solving
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
