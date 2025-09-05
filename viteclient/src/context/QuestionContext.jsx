import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { fetchQuestionById } from "../axios/solvingQuestion";

const QuestionContext = createContext();
export const useQuestion = () => useContext(QuestionContext);

// Safe helpers
const safeParse = (str, fallback) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// Build localStorage keys per user
const getLSKeys = (username) => {
  return {
    questions: `${username}_questions`,
    currentIndex: `${username}_currentIndex`,
  };
};

export const QuestionProvider = ({ id, children }) => {
  const username = localStorage.getItem("username") || "guest";
  const LS_KEYS = useMemo(() => getLSKeys(username), [username]);

  // Boot from localStorage
  const bootQuestions = (() => {
    const raw = localStorage.getItem(LS_KEYS.questions);
    return raw ? safeParse(raw, []) : [];
  })();

  const bootIndex = (() => {
    const raw = localStorage.getItem(LS_KEYS.currentIndex);
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 ? n : 0;
  })();

  // Global state
  const [questions, setQuestions] = useState(bootQuestions);
  const [currentIndex, setCurrentIndex] = useState(() =>
    bootQuestions.length ? Math.min(bootIndex, bootQuestions.length - 1) : 0
  );
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const setQuestionList = (qList) => setQuestions(qList);

  // Persist changes
  useEffect(() => {
    const savedIndex = localStorage.getItem(LS_KEYS.currentIndex);
    if (String(currentIndex) !== savedIndex) {
      localStorage.setItem(LS_KEYS.currentIndex, String(currentIndex));
    }
    if (questions.length > 0) {
      const savedQs = localStorage.getItem(LS_KEYS.questions);
      const newQs = JSON.stringify(questions);
      if (savedQs !== newQs) {
        localStorage.setItem(LS_KEYS.questions, newQs);
      }
    }
  }, [questions, currentIndex, LS_KEYS]);

  // Derive current question safely
  useEffect(() => {
    if (questions.length > 0) {
      const clamped = Math.min(Math.max(currentIndex, 0), questions.length - 1);

      if (clamped !== currentIndex) {
        setCurrentIndex(clamped);
      } else {
        setQuestion(questions[clamped]);
        setLoading(false);
      }
    }
  }, [currentIndex, questions]);

  // Fallback: fetch single question if no list
  useEffect(() => {
    if (questions.length === 0 && id) {
      const load = async () => {
        try {
          const data = await fetchQuestionById(id);
          setQuestion(data);
        } catch (err) {
          console.error("Error loading question:", err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [id, questions.length]);

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      return questions[nextIndex];
    }
    return null;
  };

  const clearSession = () => {
    localStorage.removeItem(LS_KEYS.questions);
    localStorage.removeItem(LS_KEYS.currentIndex);
    setQuestions([]);
    setCurrentIndex(0);
    setQuestion(null);
  };

  return (
    <QuestionContext.Provider
      value={{
        question,
        loading,
        questions,
        setQuestionList,
        currentIndex,
        setCurrentIndex,
        nextQuestion,
        clearSession,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

QuestionProvider.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
};
