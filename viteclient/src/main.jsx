import React from "react";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { TimerProvider } from "./context/TimerContext.jsx";
import { QuestionProvider } from "./context/QuestionContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TimerProvider>
      <QuestionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QuestionProvider>
    </TimerProvider>
  </StrictMode>
);
