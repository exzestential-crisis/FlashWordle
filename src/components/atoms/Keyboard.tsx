"use client";

import React from "react";

type Props = {
  onKeyPress: (key: string) => void;
  guesses: string[];
  currentRow: number;
  WORD: string;
};

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

export default function Keyboard({
  onKeyPress,
  guesses,
  currentRow,
  WORD,
}: Props) {
  // Compute letter states from all past guesses
  const keyStates: Record<string, "correct" | "present" | "absent"> = {};

  for (let i = 0; i < currentRow; i++) {
    const guess = guesses[i] || "";
    for (let j = 0; j < guess.length; j++) {
      const letter = guess[j];
      if (letter === WORD[j]) {
        keyStates[letter] = "correct";
      } else if (WORD.includes(letter)) {
        // Only upgrade if not already correct
        if (keyStates[letter] !== "correct") keyStates[letter] = "present";
      } else {
        if (!keyStates[letter]) keyStates[letter] = "absent";
      }
    }
  }

  const getKeyClass = (key: string) => {
    let base =
      "px-2 py-2 rounded text-sm font-bold flex-1 text-center border transition-colors duration-150";
    if (key.length === 1) base += " w-10";
    if (key === "Enter" || key === "Backspace") base += " w-16 bg-gray-200";

    if (key.length === 1) {
      switch (keyStates[key]) {
        case "correct":
          base += " bg-sky-400 text-white";
          break;
        case "present":
          base += " bg-yellow-400 text-white";
          break;
        case "absent":
          base += " bg-gray-400 text-white";
          break;
        default:
          base += " bg-white";
      }
    }

    return base;
  };

  return (
    <div className="flex flex-col gap-1 select-none mt-2">
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={getKeyClass(key)}
            >
              {key === "Backspace" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
