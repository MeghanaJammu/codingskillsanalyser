import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchQuestionById } from "../axios/solvingQuestion";
import Cookies from "js-cookie";

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
const getLSKeys = () => {
  const username = Cookies.get("username") || "guest";
  return {
    questions: `questions_${username}`,
    currentIndex: `currentIndex_${username}`,
  };
};

export const QuestionProvider = ({ id, children }) => {
  const LS_KEYS = getLSKeys();

  const bootQuestions = (() => {
    const raw = localStorage.getItem(LS_KEYS.questions);
    return raw ? safeParse(raw, []) : [];
  })();

  const bootIndex = (() => {
    const raw = localStorage.getItem(LS_KEYS.currentIndex);
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 ? n : 0;
  })();

  // global question list + position
  const [questions, setQuestions] = useState(bootQuestions);
  const [currentIndex, setCurrentIndex] = useState(() =>
    bootQuestions.length ? Math.min(bootIndex, bootQuestions.length - 1) : 0
  );

  // currently focused question (derived)
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const setQuestionList = (qList) => setQuestions(qList);

  // keep localStorage in sync (per-user)
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(LS_KEYS.questions, JSON.stringify(questions));
    }
    localStorage.setItem(LS_KEYS.currentIndex, String(currentIndex));
  }, [questions, currentIndex, LS_KEYS]);

  // derive current question from list + index
  useEffect(() => {
    if (questions.length > 0) {
      const clamped = Math.min(Math.max(currentIndex, 0), questions.length - 1);
      if (clamped !== currentIndex) {
        setCurrentIndex(clamped);
        return; // will re-run
      }
      setQuestion(questions[clamped]);
      setLoading(false);
    }
  }, [currentIndex, questions]);

  // fallback: fetch single question by id if no list is present
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

  // optional: call later when test finishes
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
