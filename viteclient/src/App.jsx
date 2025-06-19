import React from "react";
import "./App.css";

import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CodeEditor from "./components/CodeEditor";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<CodeEditor />} />
    </Routes>
  );
}

export default App;
