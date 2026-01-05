import { WORD_LENGTH_STANDARD } from './constants';

export const calculateWPM = (correctChars: number, timeElapsedSeconds: number): number => {
  if (timeElapsedSeconds === 0) return 0;
  const words = correctChars / WORD_LENGTH_STANDARD;
  const minutes = timeElapsedSeconds / 60;
  return Math.round(words / minutes);
};

export const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
};

