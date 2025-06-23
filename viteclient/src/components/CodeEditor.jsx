import React from "react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import { executeCode } from "../api";

import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const editorRef = useRef();
  const [userCode, setUserCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isChecked, setIsChecked] = useState(true);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  const onSelect = (language) => {
    setLanguage(language);
    setUserCode(CODE_SNIPPETS[language]);
  };
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleRunCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      const {} = await executeCode(language, sourceCode);
    } catch (error) {}
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col justify-between w-[70vw] bg-[#171628]  p-5">
      <div className="h-[50vh] rounded-md w-full overflow-hidden ">
        <div className="p-2 flex items-center justify-between  w-full">
          <LanguageSelector language={language} onSelect={onSelect} />
          <div className="flex space-x-2">
            <button
              onClick={handleRunCode}
              className="bg-[#2b2b2f] border border-[#7976A2] cursor-pointer text-gray-400 text-sm px-4 py-1 rounded-md hover:bg-[#3a3a3f]"
            >
              RUN
            </button>
            <button className="bg-[#2b2b2f] border border-[#7976A2] cursor-pointer text-gray-400 text-sm px-4 py-1 rounded-md hover:bg-[#3a3a3f]">
              Submit
            </button>
          </div>
        </div>

        <Editor
          height="100%"
          width="100%"
          theme="hc-black"
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          value={userCode}
          onChange={(value) => setUserCode(value)}
          onMount={onMount}
        />
      </div>
      <div className="min-h-[40vh] border border-[#7976A2] mt-4 rounded-lg p-6 relative bg-[#333240]">
        <div className="relative flex flex-row justify-end">
          <div className="flex items-center space-x-2">
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
          <div className="flex flex-col">
            <div>
              <label className="text-white" htmlFor="userInput">
                Input
              </label>
              <textarea
                id="userInput"
                rows="4"
                className="w-full mt-2 p-2 rounded-md bg-[#1e1e2e] text-white border border-gray-600"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="text-white" htmlFor="userOutput">
                Output
              </label>
              <textarea
                id="userOutput"
                rows="4"
                className="w-full mt-2 p-2 rounded-md bg-[#1e1e2e] text-white border border-gray-600"
                value={customOutput}
                onChange={(e) => setCustomOutput(e.target.value)}
              ></textarea>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
