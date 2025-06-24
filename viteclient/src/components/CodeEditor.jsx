import React, { useEffect, useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import { executeCode } from "../api";
import { ClipLoader } from "react-spinners";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const editorRef = useRef();
  const [userCode, setUserCode] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [isChecked, setIsChecked] = useState(true);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const STORAGE_KEY = (lang) => `userCode_${lang}`;

  useEffect(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY(language));
    setUserCode(savedCode || CODE_SNIPPETS[language]);
    setIsEditorReady(true);
  }, [language]);

  useEffect(() => {
    if (isEditorReady) {
      localStorage.setItem(STORAGE_KEY(language), userCode);
    }
  }, [userCode, language, isEditorReady]);

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
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run } = await executeCode(language, sourceCode, customInput);
      setCustomOutput(run.output);
      setIsError(!!run.stderr);
    } catch (error) {
      setCustomOutput(error.message || "Execution Error");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCode = () => {
    const defaultCode = CODE_SNIPPETS[language];
    setUserCode(defaultCode);
    setCustomInput("");
    setCustomOutput("");
    setIsError(false);
    localStorage.setItem(STORAGE_KEY(language), defaultCode);
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
            className="bg-[#2b2b2f] border border-[#7976A2] text-gray-400 text-sm px-4 py-1 rounded-md hover:bg-[#3a3a3f]"
          >
            Reset
          </button>
          <button
            onClick={handleRunCode}
            disabled={isLoading}
            className="bg-[#2b2b2f] border border-[#7976A2] text-gray-400 text-sm px-4 py-1 rounded-md hover:bg-[#3a3a3f] flex items-center justify-center min-w-[60px]"
          >
            {isLoading ? (
              <ClipLoader color="#36d7b7" loading={isLoading} size={20} />
            ) : (
              "RUN"
            )}
          </button>
          <button className="bg-[#2b2b2f] border border-[#7976A2] text-gray-400 text-sm px-4 py-1 rounded-md hover:bg-[#3a3a3f]">
            Submit
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

      {/* Output/Input section */}
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

        {isChecked && (
          <div className="flex flex-col gap-4">
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
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
