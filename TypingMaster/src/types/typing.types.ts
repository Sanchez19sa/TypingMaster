
export type TestMode = 'text' | 'code';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TestStatus = 'idle' | 'running' | 'finished';
export type SupportedLanguage = 'en' | 'es';
export type CodeLanguage = 'javascript' | 'python' | 'typescript';

export interface TestConfig {
  mode: TestMode;
  duration: number;
  difficulty: Difficulty;
  includeNumbers: boolean;
  includePunctuation: boolean;
}

export interface CharState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'extra';
}

export interface ChartPoint {
    time: number;
    wpm: number;
    raw: number;
    error: number;
    wordNumber?: number;
    totalWords?: number;
}

export interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  extraChars: number;
  correctWords: number;
  incorrectWords: number;
  chartData: ChartPoint[];
}

