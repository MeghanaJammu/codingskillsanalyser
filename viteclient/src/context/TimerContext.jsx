/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect, useContext } from "react";

const TimerContext = createContext();

const LS_ENDTIME = "timer_endTime";
const LS_ACTIVE = "timer_isActive";

export const TimerProvider = ({ children }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // On mount, restore from localStorage
  useEffect(() => {
    const storedEndTime = localStorage.getItem(LS_ENDTIME);
    const storedActive = localStorage.getItem(LS_ACTIVE) === "true";

    if (storedActive && storedEndTime) {
      const now = Date.now();
      const diff = Math.floor((parseInt(storedEndTime, 10) - now) / 1000);

      if (diff > 0) {
        setSecondsLeft(diff);
        setIsActive(true);
      } else {
        // timer expired
        setSecondsLeft(0);
        setIsActive(false);
        localStorage.removeItem(LS_ENDTIME);
        localStorage.removeItem(LS_ACTIVE);
      }
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsActive(false);
            localStorage.removeItem(LS_ENDTIME);
            localStorage.removeItem(LS_ACTIVE);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft]);

  const startTimer = (difficultyCounts) => {
    if (!isActive) {
      const time =
        (difficultyCounts.easy || 0) * 15 * 60 +
        (difficultyCounts.medium || 0) * 30 * 60 +
        (difficultyCounts.hard || 0) * 45 * 60;

      setSecondsLeft(time);
      setIsActive(true);

      const endTime = Date.now() + time * 1000;
      localStorage.setItem(LS_ENDTIME, endTime.toString());
      localStorage.setItem(LS_ACTIVE, "true");
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hStr = String(hours).padStart(2, "0");
    const mStr = String(minutes).padStart(2, "0");
    const sStr = String(seconds).padStart(2, "0");

    return hours > 0 ? `${hStr}:${mStr}:${sStr}` : `${mStr}:${sStr}`;
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
