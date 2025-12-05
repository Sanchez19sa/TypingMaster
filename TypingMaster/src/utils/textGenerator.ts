import type { Difficulty, TestMode } from '../types/typing.types';
import { englishWords, englishSentences } from '../data/texts/en';
import { spanishWords, spanishSentences } from '../data/texts/es';
import { javascriptSnippets, pythonSnippets, typescriptSnippets } from '../data/CodeSnippet';

export const generateText = (
  mode: TestMode,
  difficulty: Difficulty,
  lang: string,
  count: number = 50
): string => {
  if (mode === 'code') {
    const allSnippets = [...javascriptSnippets, ...pythonSnippets, ...typescriptSnippets];
    const snippet = allSnippets[Math.floor(Math.random() * allSnippets.length)];
    return snippet;
  }

  const words = lang === 'es' ? spanishWords : englishWords;
  const sentences = lang === 'es' ? spanishSentences : englishSentences;

  if (difficulty === 'hard') {
    let text = sentences[Math.floor(Math.random() * sentences.length)];
    for (let i = 0; i < 5; i++) {
        text += ' ' + words.hard[Math.floor(Math.random() * words.hard.length)];
    }
    return text;
  }

  const pool = [...words.easy, ...(difficulty === 'medium' ? words.medium : [])];
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  return result.join(' ');
};

