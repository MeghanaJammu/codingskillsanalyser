/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../../context/TimerContext";

const TOPIC_OPTIONS = [
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

const HOW_IT_WORKS_DATA = [
  {
    title: "Select Your Arena",
    description:
      "Choose from a wide range of topics and set the difficulty to match your skill level.",
  },
  {
    title: "Solve the Challenge",
    description:
      "Engage with real-world problems and write your best code to solve them.",
  },
  {
    title: "Get Instant Insights",
    description:
      "Submit your solution and receive immediate, AI-powered feedback to improve.",
  },
];

const selectCustomStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderColor: "#334155",
    boxShadow: "none",
    "&:hover": { borderColor: "#475569" },
  }),
  input: (styles) => ({ ...styles, color: "#e2e8f0" }),
  multiValue: (styles) => ({ ...styles, backgroundColor: "#334155" }),
  multiValueLabel: (styles) => ({ ...styles, color: "#e2e8f0" }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#94a3b8",
    ":hover": { backgroundColor: "#475569", color: "#e2e8f0" },
  }),
  menu: (base) => ({ ...base, backgroundColor: "#1e293b" }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#2563eb" : isFocused ? "#334155" : undefined,
    color: "#e2e8f0",
    ":active": { backgroundColor: "#1d4ed8" },
  }),
};

const Navbar = ({ onLogout }) => (
  <header className="sticky top-0 z-50 h-[7vh] flex justify-between items-center px-6 md:px-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
    <div className="font-bold text-xl text-white">SmartCoder</div>
    <button
      onClick={onLogout}
      className="bg-slate-700 px-4 py-1.5 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-600 transition-colors"
    >
      Logout
    </button>
  </header>
);

const Hero = ({ onCTAClick }) => (
  <div className="min-h-[93vh] relative flex items-center justify-center text-center px-6 py-16 bg-cover bg-center">
    <div className="absolute inset-0 bg-black opacity-60"></div>
    <div className="relative z-10 max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
        Master the Code, Master Your Future
      </h1>
      <p className="mt-6 text-lg md:text-xl text-slate-300">
        The ultimate platform for sharpening your coding skills with AI-driven
        feedback and a personalized practice environment.
      </p>
      <button
        onClick={onCTAClick}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-transform hover:scale-105"
      >
        Start Your Journey
      </button>
    </div>
  </div>
);

const HowItWorks = () => (
  <section className="py-20 bg-slate-950">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        How It Works
      </h2>
      <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
        Our platform is designed to be simple and effective. In just a few
        steps, you can start improving your coding skills.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {HOW_IT_WORKS_DATA.map(({ title, description }, index) => (
          <div
            key={title}
            className="p-8 bg-slate-900 rounded-lg border border-slate-800"
          >
            <div className="text-3xl font-bold text-blue-400 mb-4">
              0{index + 1}
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
            <p className="text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PracticeSetupForm = () => {
  const navigate = useNavigate();
  const { startTimer } = useTimer();
  const username = localStorage.getItem("username");

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [difficultyCounts, setDifficultyCounts] = useState(() => {
    const saved = localStorage.getItem(`${username}_difficultyCounts`);
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  const handleCountChange = (level, value) => {
    setDifficultyCounts((prev) => ({
      ...prev,
      [level.toLowerCase()]: Math.max(0, parseInt(value)) || 0,
    }));
  };

  const handleStartSolving = () => {
    const topics = selectedTopics.map((option) => option.value);
    const totalQuestions = Object.values(difficultyCounts).reduce(
      (a, b) => a + b,
      0
    );

    if (topics.length === 0 || totalQuestions === 0) {
      alert(
        "Please select at least one topic and specify the number of questions."
      );
      return;
    }

    if (username) {
      localStorage.setItem(`${username}_topics`, JSON.stringify(topics));
      localStorage.setItem(
        `${username}_difficultyCounts`,
        JSON.stringify(difficultyCounts)
      );
    }
    startTimer(difficultyCounts);
    navigate("/questions", { state: { topics, difficultyCounts } });
  };

  return (
    <div className="w-full max-w-lg bg-slate-800/60 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-slate-700">
      <h3 className="text-2xl font-bold text-white text-center mb-6">
        Customize Your Practice Session
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            Topics
          </label>
          <Select
            isMulti
            options={TOPIC_OPTIONS}
            value={selectedTopics}
            onChange={setSelectedTopics}
            classNamePrefix="react-select"
            styles={selectCustomStyles}
            placeholder="Select topics..."
          />
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-2">
            Number of Questions
          </label>
          <div className="space-y-3">
            {["Easy", "Medium", "Hard"].map((level) => (
              <div key={level} className="flex justify-between items-center">
                <span className="text-slate-200">{level}</span>
                <input
                  type="number"
                  min="0"
                  value={difficultyCounts[level.toLowerCase()]}
                  onChange={(e) => handleCountChange(level, e.target.value)}
                  className="w-24 bg-slate-700 border border-slate-600 px-3 py-1.5 rounded-md text-right text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleStartSolving}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold transition-transform hover:scale-105"
        >
          Start Solving
        </button>
      </div>
    </div>
  );
};

const PracticeSetup = ({ sectionRef }) => (
  <section
    ref={sectionRef}
    className="min-h-screen flex items-center justify-center bg-slate-900 py-20 px-6"
  >
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
      <div className="flex-1 max-w-lg text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Begin?
        </h2>
        <p className="text-lg text-slate-400 mb-6">
          Fine-tune your session by selecting your desired topics and the number
          of questions for each difficulty level.
        </p>
        <div className="space-y-3">
          {[
            "Choose Your Topics",
            "Set Problem Difficulty",
            "Solve and Submit Code",
            "Receive Instant Feedback",
          ].map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <span className="text-blue-400 font-bold text-xl">✓</span>
              <span className="text-slate-300">{step}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 w-full flex justify-center">
        <PracticeSetupForm />
      </div>
    </div>
  </section>
);

const Home = () => {
  const practiceSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.clear();
    navigate("/login");
  };

  const scrollToPractice = () => {
    practiceSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-slate-950 text-white font-sans">
      <Navbar onLogout={handleLogout} />
      <main>
        <Hero onCTAClick={scrollToPractice} />
        <HowItWorks />
        <PracticeSetup sectionRef={practiceSectionRef} />
      </main>
    </div>
  );
};

export default Home;
