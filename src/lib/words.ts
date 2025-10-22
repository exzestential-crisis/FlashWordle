// lib/words.ts
import validWords from "./validWords.json" assert { type: "json" };
import gameWords from "./gameWords.json" assert { type: "json" };

// Large list for validation (accepts any valid 5-letter word)
export const VALID_WORDS = validWords as string[];
export const VALID_WORDS_SET = new Set<string>(VALID_WORDS);

// Smaller curated list for actual game answers
export const GAME_WORDS: string[] = gameWords as string[];

export const getDailyWord = () => {
  const startDate = new Date("2025-01-01");
  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = diffDays % GAME_WORDS.length; // Use GAME_WORDS for daily
  return GAME_WORDS[index];
};

// Random word from game words (not played yet)
export const getRandomWord = (playedWords: string[] = []) => {
  const unplayed = GAME_WORDS.filter((w) => !playedWords.includes(w));
  if (unplayed.length === 0) return null;
  return unplayed[Math.floor(Math.random() * unplayed.length)];
};
