import React from "react";
import "./App.css";

import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import SolvingPage from "./pages/SolvingPage";
import { TimerProvider } from "./context/TimerContext";

function App() {
  return (
    <TimerProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/solve" element={<SolvingPage />} />
      </Routes>
    </TimerProvider>
  );
}

export default App;
