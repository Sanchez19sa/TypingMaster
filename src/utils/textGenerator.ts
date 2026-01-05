import type { Difficulty, TestMode, CodeLanguage } from '../types/typing.types';
import { englishTexts } from '../data/texts/en';
import { spanishTexts } from '../data/texts/es';
import { javascriptSnippets, pythonSnippets, typescriptSnippets } from '../data/CodeSnippet';

interface TextGeneratorResult {
  text: string;
  index: number;
}

export const generateText = (
  mode: TestMode,
  difficulty: Difficulty,
  lang: string,
  codeLanguage: CodeLanguage = 'javascript',
  forceIndex?: number,
  excludeIndex?: number
): TextGeneratorResult => {
  let pool: string[] = [];

  if (mode === 'code') {
    switch (codeLanguage) {
        case 'python':
            pool = pythonSnippets[difficulty];
            break;
        case 'typescript':
            pool = typescriptSnippets[difficulty];
            break;
        case 'javascript':
        default:
            pool = javascriptSnippets[difficulty];
            break;
    }
  } else {
    // Determine text source based on language
    const texts = lang === 'es' ? spanishTexts : englishTexts;
    pool = texts[difficulty] || [];
  }

  // Fallback if pool is empty
  if (!pool || pool.length === 0) {
    return { text: "Error: No content available.", index: -1 };
  }

  // Use forced index if valid, otherwise generate random
  let index: number;
  if (forceIndex !== undefined && forceIndex >= 0 && forceIndex < pool.length) {
    index = forceIndex;
  } else {
    // Generate random with exclusion logic
    if (pool.length > 1 && excludeIndex !== undefined) {
        do {
            index = Math.floor(Math.random() * pool.length);
        } while (index === excludeIndex);
    } else {
        index = Math.floor(Math.random() * pool.length);
    }
  }

  return { text: pool[index], index };
};

