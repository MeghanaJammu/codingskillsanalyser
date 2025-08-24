import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchQuestionById } from "../axios/solvingQuestion";

const LS_QUESTIONS = "questions";
const LS_CURRENT_INDEX = "currentIndex";

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

export const QuestionProvider = ({ id, children }) => {
  const bootQuestions = (() => {
    const raw = localStorage.getItem(LS_QUESTIONS);
    return raw ? safeParse(raw, []) : [];
  })();

  const bootIndex = (() => {
    const raw = localStorage.getItem(LS_CURRENT_INDEX);
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

  // keep localStorage in sync
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(LS_QUESTIONS, JSON.stringify(questions));
    }
    localStorage.setItem(LS_CURRENT_INDEX, String(currentIndex));
  }, [questions, currentIndex]);

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
    localStorage.removeItem(LS_QUESTIONS);
    localStorage.removeItem(LS_CURRENT_INDEX);
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
        clearSession, // for later use
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
