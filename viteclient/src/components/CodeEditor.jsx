import React, { useEffect, useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import { executeCode } from "../axios/editorrun";
import { evaluateRunCode, submitCode } from "../axios/evaluateRun";
import { ClipLoader } from "react-spinners";
import Editor from "@monaco-editor/react";
import Examples from "./Examples";
import SubmissionResults from "./SubmissionResults";
import { useQuestion } from "../context/QuestionContext";

const CodeEditor = () => {
  const { question } = useQuestion();
  const qid = question?.id;

  const examples = question?.examples || [];
  const username = localStorage.getItem("username"); // active user

  const editorRef = useRef();
  const [userCode, setUserCode] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [isChecked, setIsChecked] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isError, setIsError] = useState(false);

  // Loading states
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Results
  const [runResults, setRunResults] = useState([]);
  const [submitResults, setSubmitResults] = useState([]);
  const [isSubmission, setIsSubmission] = useState(false);

  // storage key
  const STORAGE_KEY = (qid, lang) => `${username}_userCode_${qid}_${lang}`;

  useEffect(() => {
    if (!qid || !username) return;
    const savedCode = localStorage.getItem(STORAGE_KEY(qid, language));
    setUserCode(savedCode || CODE_SNIPPETS[language]);
    setIsEditorReady(true);
  }, [qid, language, username]);

  useEffect(() => {
    if (!qid) return;
    setRunResults([]);
    setSubmitResults([]);
    setIsSubmission(false);
    setCustomOutput("");
    setIsError(false);
  }, [qid]);

  useEffect(() => {
    if (isEditorReady && qid && username) {
      localStorage.setItem(STORAGE_KEY(qid, language), userCode);
    }
  }, [userCode, qid, language, isEditorReady, username]);

  const handleToggle = () => setIsChecked((prev) => !prev);

  const onSelect = (lang) => {
    setIsEditorReady(false);
    setLanguage(lang);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleRunCode = async () => {
    setIsSubmission(false);
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    if (qid && username) {
      localStorage.setItem(STORAGE_KEY(qid, language), sourceCode);
    }

    try {
      setIsRunLoading(true);

      if (isChecked) {
        const { run } = await executeCode(language, sourceCode, customInput);
        setCustomOutput(run.output);
        setIsError(!!run.stderr);
      } else {
        const { results } = await evaluateRunCode(
          language,
          sourceCode,
          examples
        );
        setRunResults(results);
      }
    } catch (error) {
      if (isChecked) {
        setCustomOutput(error.message || "Execution Error");
        setIsError(true);
      } else {
        setRunResults([{ output: error.message || "Execution Error" }]);
      }
    } finally {
      setIsRunLoading(false);
    }
  };

  const handleResetCode = () => {
    const defaultCode = CODE_SNIPPETS[language];
    setUserCode(defaultCode);
    setCustomInput("");
    setCustomOutput("");
    setRunResults([]);
    setSubmitResults([]);
    setIsError(false);
    if (qid && username) {
      localStorage.setItem(STORAGE_KEY(qid, language), defaultCode);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmission(true);
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    if (qid && username) {
      localStorage.setItem(STORAGE_KEY(qid, language), sourceCode);
    }

    try {
      setIsSubmitLoading(true);
      const { results } = await submitCode(sourceCode, language, qid);
      setSubmitResults(results);
      setCustomOutput("");
      setIsError(results.some((r) => !r.passed));
    } catch (error) {
      setSubmitResults([{ output: error.message || "Submission Error" }]);
      setIsError(true);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F111A] p-6 flex flex-col gap-6 text-gray-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <LanguageSelector language={language} onSelect={onSelect} />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleResetCode}
            className="px-4 py-2 text-sm cursor-pointer font-medium border border-gray-600 rounded-lg bg-[#1C1F2E] hover:bg-[#262B3F] transition"
          >
            Reset
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunLoading}
            className="px-5 py-2 text-sm cursor-pointer font-medium rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition flex items-center justify-center"
          >
            {isRunLoading ? <ClipLoader color="#fff" size={18} /> : "Run"}
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={isSubmitLoading}
            className="px-5 py-2 text-sm cursor-pointer font-medium rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition flex items-center justify-center"
          >
            {isSubmitLoading ? <ClipLoader color="#fff" size={18} /> : "Submit"}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="w-full h-[55vh] border border-gray-700 rounded-xl shadow-md bg-[#1C1F2E] overflow-hidden">
        {isEditorReady && (
          <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            language={language}
            value={userCode}
            onChange={(value) => setUserCode(value)}
            onMount={onMount}
          />
        )}
      </div>

      {/* I/O and Results */}
      <div className="w-full border border-gray-700 rounded-xl bg-[#1A1D2B] shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg tracking-wide">
            Execution Panel
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="custom"
              checked={isChecked}
              onChange={handleToggle}
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="custom"
              className="text-sm font-medium cursor-pointer"
            >
              Custom Input
            </label>
          </div>
        </div>

        {isChecked ? (
          <div className="flex flex-col gap-4">
            <div>
              <label
                className="text-sm cursor-pointer font-medium"
                htmlFor="userInput"
              >
                Input
              </label>
              <textarea
                id="userInput"
                rows="4"
                className="w-full mt-2 p-3 rounded-lg bg-[#0F111A] border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              ></textarea>
            </div>
            <div>
              <p className="text-sm font-medium">Output</p>
              <div
                id="userOutput"
                className={`w-full min-h-[120px] mt-2 p-3 rounded-lg bg-[#0F111A] border transition ${
                  isError
                    ? "border-red-500 text-red-400"
                    : "border-gray-600 text-gray-300"
                }`}
              >
                {customOutput ? (
                  <pre className="whitespace-pre-wrap break-words">
                    {customOutput}
                  </pre>
                ) : (
                  "Click RUN to view output"
                )}
              </div>
            </div>
          </div>
        ) : isSubmission ? (
          isSubmitLoading ? (
            <div className="flex justify-center items-center py-10">
              <ClipLoader color="#36d7b7" size={40} />
            </div>
          ) : (
            <SubmissionResults results={submitResults} />
          )
        ) : (
          <Examples examples={examples} results={runResults} />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
