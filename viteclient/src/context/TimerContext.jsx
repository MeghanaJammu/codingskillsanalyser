/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect, useContext } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft]);

  const startTimer = (difficultyCounts) => {
    const time =
      (difficultyCounts.easy || 0) * 15 * 60 +
      (difficultyCounts.medium || 0) * 30 * 60 +
      (difficultyCounts.hard || 0) * 45 * 60;

    setSecondsLeft(time);
    setIsActive(true);
  };

  const formatTime = (totalSeconds) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <TimerContext.Provider value={{ secondsLeft, startTimer, formatTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
