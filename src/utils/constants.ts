import type { TestConfig } from '../types/typing.types';

export const DEFAULT_CONFIG: TestConfig = {
  mode: 'text',
  duration: 30,
  difficulty: 'medium',
  includeNumbers: false,
  includePunctuation: true,
};

export const WORD_LENGTH_STANDARD = 5;

export const DURATIONS = [15, 30, 60, 120];


