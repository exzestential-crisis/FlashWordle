// lib/words.ts
import wordJson from "./validWords.json"; // the big 5-letter word JSON

export const WORD_LIST: string[] = wordJson as string[]; // thousands of words
export const WORD_SET = new Set(WORD_LIST); // for fast O(1) validation

export const getDailyWord = () => {
  const startDate = new Date("2025-01-01"); // reference start
  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = diffDays % WORD_LIST.length;
  return WORD_LIST[index];
};

// optional: random word without repeats
export const getRandomWord = (playedWords: string[] = []) => {
  const unplayed = WORD_LIST.filter((w) => !playedWords.includes(w));
  if (unplayed.length === 0) return null;
  return unplayed[Math.floor(Math.random() * unplayed.length)];
};
