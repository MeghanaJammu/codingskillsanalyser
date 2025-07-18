import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchQuestionById } from "../axios/solvingQuestion";

const QuestionContext = createContext();

export const useQuestion = () => useContext(QuestionContext);

export const QuestionProvider = ({ id, children }) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [id]);

  return (
    <QuestionContext.Provider value={{ question, loading }}>
      {children}
    </QuestionContext.Provider>
  );
};

QuestionProvider.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.node.isRequired,
};
