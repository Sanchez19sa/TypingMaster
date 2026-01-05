import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialDuration: number, onFinish: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  // Use a ref for the callback to prevent startTimer from changing when onFinish changes
  const onFinishRef = useRef(onFinish);
  
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const startTimer = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          // Call the latest callback
          if (onFinishRef.current) onFinishRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isRunning]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback((duration: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(duration);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { timeLeft, isRunning, startTimer, stopTimer, resetTimer };
};

