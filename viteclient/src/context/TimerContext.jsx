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

  /*initially the isActive is false, when the timer starts first, then this runs and isActive will be true entirely in test*/
  const startTimer = (difficultyCounts) => {
    if (!isActive) {
      const time =
        (difficultyCounts.easy || 0) * 15 * 60 +
        (difficultyCounts.medium || 0) * 30 * 60 +
        (difficultyCounts.hard || 0) * 45 * 60;
      console.log(time);
      setSecondsLeft(time);
      setIsActive(true);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hStr = String(hours).padStart(2, "0");
    const mStr = String(minutes).padStart(2, "0");
    const sStr = String(seconds).padStart(2, "0");

    if (hours > 0) {
      return `${hStr}:${mStr}:${sStr}`; // HH:MM:SS
    } else {
      return `${mStr}:${sStr}`; // MM:SS
    }
  };

  return (
    <TimerContext.Provider
      value={{ secondsLeft, isActive, startTimer, formatTime }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
