import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchQuestionById } from "../axios/solvingQuestion";

const QuestionContext = createContext();

export const useQuestion = () => useContext(QuestionContext);

export const QuestionProvider = ({ id, children }) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  // all questions from Questions.jsx
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setQuestionList = (qList) => {
    setQuestions(qList);
  };

  // if we already have a questions list → pick by index
  useEffect(() => {
    if (questions.length > 0) {
      setQuestion(questions[currentIndex]);
      setLoading(false);
    }
  }, [currentIndex, questions]);

  // otherwise, fallback: fetch from API by id
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
  }, [id, questions]);

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      return questions[nextIndex];
    }
    return null;
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
