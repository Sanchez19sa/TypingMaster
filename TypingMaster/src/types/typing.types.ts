export type TestMode = 'text' | 'code';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TestStatus = 'idle' | 'running' | 'finished';
export type SupportedLanguage = 'en' | 'es';

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

export interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  extraChars: number;
  chartData: { time: number; wpm: number }[];
}


