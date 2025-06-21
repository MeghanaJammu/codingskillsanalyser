import React from "react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";

import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const editorRef = useRef();
  const [userCode, setUserCode] = useState("");
  const [language, setLanguage] = useState("cpp");

  const onSelect = (language) => {
    setLanguage(language);
    setUserCode(CODE_SNIPPETS[language]);
  };
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className="h-screen w-250 bg-[#171628] p-5">
      <LanguageSelector language={language} onSelect={onSelect} />
      <Editor
        height="70vh"
        width="60vw"
        theme="vs-dark"
        language={language}
        defaultValue={CODE_SNIPPETS[language]}
        value={userCode}
        onChange={(value) => setUserCode(value)}
        onMount={onMount}
      />
    </div>
  );
};

export default CodeEditor;
