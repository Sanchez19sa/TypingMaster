import { useState, useCallback, useEffect, useRef } from 'react';
import type { TestStatus, TestMode, Difficulty, TestStats } from '../types/typing.types';
import { generateText } from '../utils/textGenerator';
import { useTimer } from './useTimer';
import { calculateWPM, calculateAccuracy } from '../utils/statsCalculator';

interface UseTypingProps {
  duration: number;
  mode: TestMode;
  difficulty: Difficulty;
  lang: string;
}

interface UseTypingReturn {
  text: string;
  userInput: string;
  status: TestStatus;
  timeLeft: number;
  stats: TestStats;
  resetTest: () => void;
  handleKey: (key: string) => void;
}

export const useTyping = ({ duration, mode, difficulty, lang }: UseTypingProps): UseTypingReturn => {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [stats, setStats] = useState<TestStats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    consistency: 0,
    correctChars: 0,
    incorrectChars: 0,
    missedChars: 0,
    extraChars: 0,
    chartData: []
  });

  // Track stats history for chart
  const statsHistory = useRef<{ time: number; wpm: number }[]>([]);

  const finishTest = useCallback(() => {
    setStatus('finished');
    // Final Calculation
    const correct = userInput.split('').filter((char, i) => char === text[i]).length;
    const accuracy = calculateAccuracy(correct, userInput.length);
    const wpm = calculateWPM(correct, duration); // Based on full duration
    
    setStats(prev => ({
        ...prev,
        wpm,
        accuracy,
        chartData: statsHistory.current
    }));
  }, [userInput, text, duration]);

  const { timeLeft, startTimer, resetTimer } = useTimer(duration, finishTest);

  // Initialize text
  useEffect(() => {
    resetTest();
  }, [mode, difficulty, lang, duration]);

  const resetTest = useCallback(() => {
    const newText = generateText(mode, difficulty, lang);
    setText(newText);
    setUserInput('');
    setStatus('idle');
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      consistency: 0,
      correctChars: 0,
      incorrectChars: 0,
      missedChars: 0,
      extraChars: 0,
      chartData: []
    });
    statsHistory.current = [];
    resetTimer(duration);
  }, [mode, difficulty, lang, duration, resetTimer]);

  // Handle typing
  const handleKey = useCallback((key: string) => {
    if (status === 'finished') return;

    if (status === 'idle') {
      setStatus('running');
      startTimer();
    }

    // Block backspace in strict mode? Prompt says "No se puede retroceder"
    // So we only accept forward characters.
    if (key.length === 1) {
        setUserInput(prev => {
            if (prev.length >= text.length) return prev;
            return prev + key;
        });
    }
  }, [status, startTimer, text]);

  // Real-time stats update (every second or on key press)
  useEffect(() => {
    if (status === 'running') {
        const timeElapsed = duration - timeLeft;
        if (timeElapsed > 0) {
            const correct = userInput.split('').filter((char, i) => char === text[i]).length;
            const currentWpm = calculateWPM(correct, timeElapsed);
            
            setStats(prev => ({
                ...prev,
                wpm: currentWpm,
                correctChars: correct,
                incorrectChars: userInput.length - correct
            }));

            // Push to history if time has changed (approx every sec)
            const lastEntry = statsHistory.current[statsHistory.current.length - 1];
            if (!lastEntry || lastEntry.time !== timeElapsed) {
                statsHistory.current.push({ time: timeElapsed, wpm: currentWpm });
            }
        }
    }
  }, [userInput, timeLeft, duration, status, text]);

  return {
    text,
    userInput,
    status,
    timeLeft,
    stats,
    resetTest,
    handleKey
  };
};

