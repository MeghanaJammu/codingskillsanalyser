/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

const TimerContext = createContext();

// Build per-user localStorage keys
const getLSKeys = () => {
  const username = Cookies.get("username") || "guest";
  return {
    endTime: `timer_endTime_${username}`,
    active: `timer_isActive_${username}`,
  };
};

export const TimerProvider = ({ children }) => {
  const LS_KEYS = getLSKeys();

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // On mount, restore from localStorage
  useEffect(() => {
    const storedEndTime = localStorage.getItem(LS_KEYS.endTime);
    const storedActive = localStorage.getItem(LS_KEYS.active) === "true";

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
        localStorage.removeItem(LS_KEYS.endTime);
        localStorage.removeItem(LS_KEYS.active);
      }
    }
  }, [LS_KEYS]);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsActive(false);
            localStorage.removeItem(LS_KEYS.endTime);
            localStorage.removeItem(LS_KEYS.active);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft, LS_KEYS]);

  const startTimer = (difficultyCounts) => {
    if (!isActive) {
      const time =
        (difficultyCounts.easy || 0) * 15 * 60 +
        (difficultyCounts.medium || 0) * 30 * 60 +
        (difficultyCounts.hard || 0) * 45 * 60;

      setSecondsLeft(time);
      setIsActive(true);

      const endTime = Date.now() + time * 1000;
      localStorage.setItem(LS_KEYS.endTime, endTime.toString());
      localStorage.setItem(LS_KEYS.active, "true");
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
