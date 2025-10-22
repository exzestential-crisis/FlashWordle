import validWords from "./validWords.json" assert { type: "json" };

export const VALID_WORDS = validWords as string[];
export const VALID_WORDS_SET = new Set<string>(VALID_WORDS);
