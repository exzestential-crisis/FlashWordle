"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { WORD_LIST, getDailyWord } from "@/lib/words";
import { Keyboard, Grid } from "./atoms";
import WinModal from "./WinModal";

type Props = {
  user: { displayName: string; uid: string };
  onLogout: () => void;
};

const ROWS = 6;
const COLS = 5;

export default function WordleGame({ user, onLogout }: Props) {
  const [WORD, setWORD] = useState(getDailyWord());
  const [guesses, setGuesses] = useState<string[]>(Array(ROWS).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(false);
  const [dailyPlayed, setDailyPlayed] = useState(false);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    { username: string; score: number }[]
  >([]);

  // ----------- FIRESTORE: Init user doc & score ----------- //
  useEffect(() => {
    const docRef = doc(db, "scores", user.uid);
    setDoc(
      docRef,
      {
        username: user.displayName,
        score: 0,
        lastUpdated: new Date(),
        playedWords: [],
      },
      { merge: true }
    ).then(() => {
      getDoc(docRef).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setScore(data.score || 0);
          setDailyPlayed((data.playedWords || []).includes(getDailyWord()));
        }
      });
    });
  }, [user]);

  // ----------- LEADERBOARD ----------- //
  useEffect(() => {
    const q = query(
      collection(db, "scores"),
      orderBy("score", "desc"),
      limit(5)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setLeaderboard(snapshot.docs.map((doc) => doc.data() as any));
    });
    return () => unsub();
  }, []);

  // ----------- HANDLE KEY PRESS ----------- //
  const handleKey = (key: string) => {
    if (solved || currentRow >= ROWS) return;

    if (key === "Enter") {
      if (currentGuess.length !== COLS) {
        // Shake if incomplete
        setShakeRow(currentRow);
        setTimeout(() => setShakeRow(null), 300);
        return;
      }

      const guessUpper = currentGuess.toUpperCase();
      if (!WORD_LIST.includes(guessUpper)) {
        // Shake if invalid word
        setShakeRow(currentRow);
        setTimeout(() => setShakeRow(null), 300);
        return;
      }

      const newGuesses = [...guesses];
      newGuesses[currentRow] = guessUpper;
      setGuesses(newGuesses);

      markWordPlayed(guessUpper);

      if (guessUpper === WORD) {
        incrementScore();
        setSolved(true);
      }

      setCurrentRow(currentRow + 1);
      setCurrentGuess("");
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < COLS) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  // ----------- SCORE ----------- //
  const incrementScore = async () => {
    const newScore = score + 1;
    setScore(newScore);
    await updateDoc(doc(db, "scores", user.uid), {
      score: newScore,
      lastUpdated: new Date(),
    });
  };

  // ----------- MARK WORD AS PLAYED ----------- //
  const markWordPlayed = async (word: string) => {
    const docRef = doc(db, "scores", user.uid);
    const docSnap = await getDoc(docRef);
    const playedWords: string[] = docSnap.data()?.playedWords || [];
    if (!playedWords.includes(word)) {
      await updateDoc(docRef, { playedWords: [...playedWords, word] });
      if (word === getDailyWord()) setDailyPlayed(true);
    }
  };

  // ----------- LOGOUT ----------- //
  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  // ----------- PLAY AGAIN ----------- //
  const playAgain = async (daily = false) => {
    let nextWord = daily ? getDailyWord() : WORD;
    if (!daily) {
      const docSnap = await getDoc(doc(db, "scores", user.uid));
      const playedWords: string[] = docSnap.data()?.playedWords || [];
      const unplayed = WORD_LIST.filter((w) => !playedWords.includes(w));
      if (unplayed.length > 0) {
        nextWord = unplayed[Math.floor(Math.random() * unplayed.length)];
      }
    }
    setWORD(nextWord);
    setGuesses(Array(ROWS).fill(""));
    setCurrentRow(0);
    setCurrentGuess("");
    setSolved(false);
  };

  // ----------- LISTEN TO KEYBOARD ----------- //
  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKey(e.key);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  });

  // ----------- GET LETTER COLOR ----------- //
  const getLetterColor = (letter: string, idx: number, rowIdx: number) => {
    if (rowIdx >= currentRow) return "border";
    if (letter === WORD[idx]) return "bg-sky-400 text-white";
    if (WORD.includes(letter)) return "bg-yellow-400 text-white";
    return "bg-gray-400 text-white";
  };

  return (
    <div className="border p-4 rounded w-96 flex flex-col gap-4 items-center">
      {/* Header */}
      <div className="flex justify-between w-full">
        <div>
          <p>Player: {user.displayName}</p>
          <p>Score: {score}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded mt-2"
        >
          Logout
        </button>
      </div>

      {/* Grid */}
      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        currentRow={currentRow}
        getLetterColor={getLetterColor}
        shakeRow={shakeRow}
      />

      {/* Keyboard */}
      <Keyboard
        onKeyPress={handleKey}
        guesses={guesses}
        currentRow={currentRow}
        WORD={WORD}
      />

      {/* Win Modal */}
      {solved && (
        <WinModal
          leaderboard={leaderboard}
          dailyPlayed={dailyPlayed}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  );
}
