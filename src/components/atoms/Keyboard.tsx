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
  const keyStates: Record<string, "correct" | "present" | "absent"> = {};
  for (let i = 0; i < currentRow; i++) {
    const guess = guesses[i] || "";
    for (let j = 0; j < guess.length; j++) {
      const letter = guess[j];
      if (letter === WORD[j]) {
        keyStates[letter] = "correct";
      } else if (WORD.includes(letter)) {
        if (keyStates[letter] !== "correct") keyStates[letter] = "present";
      } else {
        if (!keyStates[letter]) keyStates[letter] = "absent";
      }
    }
  }

  const getKeyClass = (key: string) => {
    let base =
      "px-3 py-3 rounded-xl text-sm font-bold flex-1 text-center transition-all duration-150 transform active:scale-95 shadow-md";
    if (key.length === 1) base += " min-w-[2.5rem]";
    if (key === "Enter" || key === "Backspace")
      base += " min-w-[4rem] bg-gray-300 text-gray-800 hover:bg-gray-400";
    if (key.length === 1) {
      switch (keyStates[key]) {
        case "correct":
          base += " bg-brand text-white shadow-brand-dark";
          break;
        case "present":
          base += " bg-accent text-gray-800 shadow-yellow-600";
          break;
        case "absent":
          base += " bg-gray-500 text-white shadow-gray-600";
          break;
        default:
          base +=
            " bg-white text-gray-800 hover:bg-gray-100 border-2 border-gray-300";
      }
    }
    return base;
  };

  return (
    <div className="flex flex-col gap-2 select-none mt-2 w-full max-w-lg">
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
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
