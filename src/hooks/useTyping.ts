import { useState, useCallback, useEffect, useRef } from 'react';
import type { TestStatus, TestMode, Difficulty, TestStats, CodeLanguage, ChartPoint } from '../types/typing.types';
import { generateText } from '../utils/textGenerator';
import { useTimer } from './useTimer';
import { calculateWPM, calculateAccuracy } from '../utils/statsCalculator';

interface UseTypingProps {
  duration: number;
  mode: TestMode;
  difficulty: Difficulty;
  lang: string;
  codeLanguage: CodeLanguage;
}

interface UseTypingReturn {
  text: string;
  userInput: string;
  status: TestStatus;
  timeLeft: number;
  stats: TestStats;
  progress: { current: number; total: number };
  resetTest: (keepIndex?: boolean) => void;
  skipTest: () => void;
  handleKey: (key: string) => void;
}

export const useTyping = ({ duration, mode, difficulty, lang, codeLanguage }: UseTypingProps): UseTypingReturn => {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [text, setText] = useState('');
  const [textIndex, setTextIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState('');
  
  // Ref to track textIndex without triggering re-creation of resetTest
  const textIndexRef = useRef(textIndex);
  useEffect(() => {
      textIndexRef.current = textIndex;
  }, [textIndex]);

  // Store final immutable stats here to prevent any recalculation glitches
  const finalStatsRef = useRef<TestStats | null>(null);

  const [stats, setStats] = useState<TestStats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    consistency: 0,
    correctChars: 0,
    incorrectChars: 0,
    missedChars: 0,
    extraChars: 0,
    correctWords: 0,
    incorrectWords: 0,
    chartData: []
  });

  // Track stats history for chart
  const statsHistory = useRef<ChartPoint[]>([]);
  // Track errors that happened in the current second interval
  const errorsInCurrentInterval = useRef<number>(0);

  // Helper to calculate word stats
  const calculateWordStats = (currentInput: string, currentText: string) => {
    const inputWords = currentInput.trim().split(/\s+/);
    const targetWords = currentText.trim().split(/\s+/);
    
    let correctWords = 0;
    let incorrectWords = 0;
    
    inputWords.forEach((word, index) => {
        if (!word) return;
        if (index < targetWords.length) {
            if (word === targetWords[index]) {
                correctWords++;
            } else {
                incorrectWords++;
            }
        } else {
            incorrectWords++;
        }
    });

    return { correctWords, incorrectWords };
  };

  const finishTest = useCallback(() => {
    // Critical: Do not run if already finished to avoid overwriting manual completion stats
    if (status === 'finished') return;

    setStatus('finished');
    
    const correctChars = userInput.split('').filter((char, i) => char === text[i]).length;
    const totalChars = userInput.length;
    const accuracy = calculateAccuracy(correctChars, totalChars);
    
    const { correctWords, incorrectWords } = calculateWordStats(userInput, text);
    
    const wpm = calculateWPM(correctChars, duration); 
    const rawWpm = calculateWPM(totalChars, duration);

    const finalResults = {
        wpm,
        rawWpm,
        accuracy,
        consistency: stats.consistency, // Keep existing consistency
        correctChars,
        incorrectChars: totalChars - correctChars,
        missedChars: 0,
        extraChars: 0,
        correctWords,
        incorrectWords,
        chartData: statsHistory.current
    };

    setStats(finalResults);
    finalStatsRef.current = finalResults;

  }, [userInput, text, duration, status, stats.consistency]);

  const { timeLeft, startTimer, resetTimer, stopTimer } = useTimer(duration, finishTest);

  const resetTest = useCallback((keepIndex: boolean = false) => {
    const result = generateText(
      mode, 
      difficulty, 
      lang, 
      codeLanguage, 
      keepIndex ? textIndexRef.current : undefined
    );
    
    setText(result.text);
    setTextIndex(result.index);
    setUserInput('');
    setStatus('idle');
    
    // Clear immutable stats
    finalStatsRef.current = null;

    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      consistency: 0,
      correctChars: 0,
      incorrectChars: 0,
      missedChars: 0,
      extraChars: 0,
      correctWords: 0,
      incorrectWords: 0,
      chartData: []
    });
    statsHistory.current = [];
    errorsInCurrentInterval.current = 0;
    
    resetTimer(duration);
  }, [mode, difficulty, lang, duration, codeLanguage, resetTimer]);

  const skipTest = useCallback(() => {
    const result = generateText(
      mode, 
      difficulty, 
      lang, 
      codeLanguage, 
      undefined,
      textIndexRef.current
    );
    
    setText(result.text);
    setTextIndex(result.index);
    setUserInput('');
    setStatus('idle');
    finalStatsRef.current = null;
    
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      consistency: 0,
      correctChars: 0,
      incorrectChars: 0,
      missedChars: 0,
      extraChars: 0,
      correctWords: 0,
      incorrectWords: 0,
      chartData: []
    });
    statsHistory.current = [];
    errorsInCurrentInterval.current = 0;
    resetTimer(duration);
  }, [mode, difficulty, lang, codeLanguage, duration, resetTimer]);

  // MOUNT only: Ensure we have text on first load.
  useEffect(() => {
    if (!text) {
        resetTest(false);
    }
  }, []);

  const handleKey = useCallback((key: string) => {
    if (status === 'finished') return;

    if (status === 'idle') {
      setStatus('running');
      startTimer();
    }

    let charToAdd = '';
    if (key === 'Enter') {
        const nextCharInText = text[userInput.length];
        if (nextCharInText === '\n') {
            charToAdd = '\n';
            
            // UX IMPROVEMENT: Auto-indent for code mode
            // If the next line starts with spaces, add them automatically
            if (mode === 'code') {
                let i = userInput.length + 1;
                while (i < text.length && text[i] === ' ') {
                    charToAdd += ' ';
                    i++;
                }
            }
        }
    } else if (key.length === 1) {
        charToAdd = key;
    }

    if (charToAdd) {
        const nextInput = userInput + charToAdd;
        const indexToCheck = nextInput.length - 1;

        // Check for error on the *last* character added.
        // In auto-indent case, the added characters are derived from text, so they match.
        // We mainly need to catch errors on manually typed single characters.
        if (nextInput[indexToCheck] !== text[indexToCheck]) {
            errorsInCurrentInterval.current += 1;
        }
        
        if (nextInput.length <= text.length) {
            setUserInput(nextInput);

            if (nextInput.length === text.length) {
                // STOP THE TIMER IMMEDIATELY
                stopTimer();
                setStatus('finished');
                
                const correctChars = nextInput.split('').filter((char, i) => char === text[i]).length;
                const total = nextInput.length;
                const accuracy = calculateAccuracy(correctChars, total);
                const timeElapsed = duration - timeLeft;
                // Avoid division by zero, min 1 second
                const effectiveTime = timeElapsed > 0 ? timeElapsed : 1;
                
                const wpm = calculateWPM(correctChars, effectiveTime);
                const rawWpm = calculateWPM(total, effectiveTime);

                const { correctWords, incorrectWords } = calculateWordStats(nextInput, text);

                const finalResults = {
                    wpm,
                    rawWpm,
                    accuracy,
                    consistency: stats.consistency, // Keep consistency calculated so far
                    correctChars,
                    incorrectChars: total - correctChars,
                    missedChars: 0,
                    extraChars: 0,
                    correctWords,
                    incorrectWords,
                    chartData: statsHistory.current
                };

                setStats(finalResults);
                finalStatsRef.current = finalResults;
            }
        }
    }
  }, [status, startTimer, stopTimer, text, userInput, duration, timeLeft, stats.consistency, mode]);

  // Real-time stats update & History recording
  useEffect(() => {
    // CRITICAL: Strictly stop updating if not running
    if (status !== 'running') return;

    const timeElapsed = duration - timeLeft;
    if (timeElapsed <= 0) return;

    const correct = userInput.split('').filter((char, i) => char === text[i]).length;
    const totalTyped = userInput.length;
    
    const currentWpm = calculateWPM(correct, timeElapsed);
    const currentRawWpm = calculateWPM(totalTyped, timeElapsed);
    
    setStats(prev => ({
        ...prev,
        wpm: currentWpm,
        rawWpm: currentRawWpm,
        correctChars: correct,
        incorrectChars: totalTyped - correct
    }));

    const lastEntry = statsHistory.current[statsHistory.current.length - 1];
    // Record history every second
    if (!lastEntry || lastEntry.time !== timeElapsed) {
        // Calculate current word number
        const words = userInput.trim().split(/\s+/);
        const currentWordNumber = userInput.trim().length > 0 ? words.length : 0;
        const totalWordsInText = text.trim().split(/\s+/).length;

        statsHistory.current.push({ 
            time: timeElapsed, 
            wpm: currentWpm,
            raw: currentRawWpm,
            error: errorsInCurrentInterval.current,
            wordNumber: currentWordNumber,
            totalWords: totalWordsInText
        });
        errorsInCurrentInterval.current = 0;
    }
  }, [userInput, timeLeft, duration, status, text]);

  const totalWords = text.trim().split(/\s+/).length;
  const currentWords = userInput.length === 0 ? 0 : userInput.trim().split(/\s+/).length;

  // Return immutable final stats if finished
  const activeStats = (status === 'finished' && finalStatsRef.current) 
      ? finalStatsRef.current 
      : stats;

  return {
    text,
    userInput,
    status,
    timeLeft,
    stats: activeStats,
    progress: { current: Math.min(currentWords, totalWords), total: totalWords },
    resetTest: (keepIndex = false) => resetTest(keepIndex), 
    skipTest,
    handleKey
  };
};

