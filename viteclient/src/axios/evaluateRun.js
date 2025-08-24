import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constants";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const evaluateRunCode = async (language, sourceCode, examples) => {
  const response = await API.post("/evaluate", {
    language,
    version: LANGUAGE_VERSIONS[language],
    sourceCode,
    examples,
  });
  return response.data;
};

export const submitCode = async (sourceCode, language, qid) => {
  const res = await API.post("/submit", {
    sourceCode,
    language,
    version: LANGUAGE_VERSIONS[language],
    qid,
  });
  return res.data;
};
