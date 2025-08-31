import React, { useEffect, useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import { executeCode } from "../axios/editorrun";
import { evaluateRunCode } from "../axios/evaluateRun";
import { submitCode } from "../axios/evaluateRun";
import { ClipLoader } from "react-spinners";
import Editor from "@monaco-editor/react";
import Examples from "./Examples";
import SubmissionResults from "./SubmissionResults";
import { useQuestion } from "../context/QuestionContext";

const CodeEditor = () => {
  const { question } = useQuestion();
  const qid = question?.id;

  const examples = question?.examples || [];
  const username = localStorage.getItem("username"); // get active user

  const editorRef = useRef();
  const [userCode, setUserCode] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [isChecked, setIsChecked] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isError, setIsError] = useState(false);

  // ✅ separate loading states
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // ✅ separate results for run vs submit
  const [runResults, setRunResults] = useState([]);
  const [submitResults, setSubmitResults] = useState([]);
  const [isSubmission, setIsSubmission] = useState(false);

  // storage key includes username, qid, and language
  const STORAGE_KEY = (qid, lang) => `${username}_userCode_${qid}_${lang}`;

  // restore saved code when question/language changes
  useEffect(() => {
    if (!qid || !username) return;
    const savedCode = localStorage.getItem(STORAGE_KEY(qid, language));
    setUserCode(savedCode || CODE_SNIPPETS[language]);
    setIsEditorReady(true);
  }, [qid, language, username]);

  // reset results when moving to new question
  useEffect(() => {
    if (!qid) return;
    setRunResults([]);
    setSubmitResults([]);
    setIsSubmission(false);
    setCustomOutput("");
    setIsError(false);
  }, [qid]);

  // save whenever code changes
  useEffect(() => {
    if (isEditorReady && qid && username) {
      localStorage.setItem(STORAGE_KEY(qid, language), userCode);
    }
  }, [userCode, qid, language, isEditorReady, username]);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

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

    // persist immediately when user runs code
    if (qid && username) {
      localStorage.setItem(STORAGE_KEY(qid, language), sourceCode);
    }

    try {
      setIsRunLoading(true);

      if (isChecked) {
        // Run with custom input
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

    // persist when user submits too
    if (qid && username) {
      localStorage.setItem(STORAGE_KEY(qid, language), sourceCode);
    }

    try {
      setIsSubmitLoading(true);
      const { results } = await submitCode(sourceCode, language, qid);
      setSubmitResults(results);
      setCustomOutput("");
      setIsError(results.some((r) => !r.passed)); // if any testcase failed
    } catch (error) {
      setSubmitResults([{ output: error.message || "Submission Error" }]);
      setIsError(true);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171628] p-4 sm:p-6 flex flex-col gap-6">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div className="w-full sm:w-auto">
          <LanguageSelector language={language} onSelect={onSelect} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleResetCode}
            className="bg-[#2b2b2f] cursor-pointer border border-[#7976A2] text-gray-400 text-sm px-4 py-1 rounded-md hover:bg-[#3a3a3f]"
          >
            Reset
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunLoading}
            className="bg-[#2b2b2f] cursor-pointer border border-[#7976A2] text-gray-400 text-sm px-4 py-1 rounded-md hover:bg-[#3a3a3f] flex items-center justify-center min-w-[60px]"
          >
            {isRunLoading ? (
              <ClipLoader color="#36d7b7" loading={isRunLoading} size={20} />
            ) : (
              "RUN"
            )}
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={isSubmitLoading}
            className="bg-[#2b2b2f] cursor-pointer border border-[#7976A2] text-gray-400 text-sm px-4 py-1 rounded-md hover:bg-[#3a3a3f]"
          >
            {isSubmitLoading ? (
              <ClipLoader color="#36d7b7" loading={isSubmitLoading} size={20} />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>

      {/* Editor section */}
      <div className="w-full h-[50vh] border border-[#42375B] rounded-md bg-[#1e1e2e] overflow-hidden">
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

      {/* Output/Input / Examples section */}
      <div className="w-full border border-[#42375B] rounded-lg p-4 bg-[#333240]">
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="custom"
              checked={isChecked}
              onChange={handleToggle}
              className="accent-gray-500 cursor-pointer w-4 h-4"
            />
            <label
              htmlFor="custom"
              className="text-white font-semibold text-sm"
            >
              Custom input
            </label>
          </div>
        </div>

        {isChecked ? (
          <div className="flex flex-col gap-4">
            {/* Custom input/output */}
            <div>
              <label className="text-white" htmlFor="userInput">
                Input
              </label>
              <textarea
                id="userInput"
                rows="4"
                className="w-full mt-2 p-2 rounded-md bg-[#1e1e2e] text-[#878791] border border-[#42375B]"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              ></textarea>
            </div>
            <div>
              <p className="text-gray-300 font-medium">Output</p>
              <div
                id="userOutput"
                className="w-full min-h-[100px] mt-2 p-2 rounded-md bg-[#1e1e2e] border"
                style={{
                  color: isError ? "#dc2626" : "#878791",
                  borderColor: isError ? "#dc2626" : "#42375B",
                }}
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
            <div className="flex justify-center items-center py-8">
              <ClipLoader color="#36d7b7" loading={true} size={40} />
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
