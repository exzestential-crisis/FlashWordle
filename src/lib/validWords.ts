// lib/validWords.ts
import validWordsJson from "./validWords.json";

export const VALID_WORDS: string[] = validWordsJson as string[];
export const VALID_WORDS_SET = new Set(VALID_WORDS); // for fast lookup
