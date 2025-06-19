import React from "react";
import { useRef, useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const editorRef = useRef();
  const [userCode, setUserCode] = useState("");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Editor
      height="70vh"
      theme="vs-dark"
      defaultLanguage="javascript"
      defaultValue="// Write your code here"
      value={userCode}
      onChange={(value) => setUserCode(value)}
      onMount={onMount}
    />
  );
};

export default CodeEditor;
