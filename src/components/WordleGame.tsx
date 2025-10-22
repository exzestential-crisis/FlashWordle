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
import { VALID_WORDS_SET, GAME_WORDS, getDailyWord } from "@/lib/words";
import { Keyboard, Grid } from "./atoms";
import WinModal from "./WinModal";
import BaseButton from "./BaseButton";

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
  const [lost, setLost] = useState(false);
  const [dailyPlayed, setDailyPlayed] = useState(false);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    { username: string; score: number }[]
  >([]);

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

  const handleKey = (key: string) => {
    if (solved || lost || currentRow >= ROWS) return;

    if (key === "Enter") {
      if (currentGuess.length !== COLS) {
        setShakeRow(currentRow);
        setTimeout(() => setShakeRow(null), 300);
        return;
      }

      const guessUpper = currentGuess.toUpperCase();
      if (!VALID_WORDS_SET.has(guessUpper)) {
        setShakeRow(currentRow);
        setTimeout(() => setShakeRow(null), 300);
        return;
      }

      const newGuesses = [...guesses];
      newGuesses[currentRow] = guessUpper;
      setGuesses(newGuesses);

      markWordPlayed(guessUpper);

      if (guessUpper === WORD) {
        const pointsEarned = 10 - currentRow;
        incrementScore(pointsEarned);
        setSolved(true);
      } else if (currentRow + 1 >= ROWS) {
        setLost(true);
      }

      setCurrentRow(currentRow + 1);
      setCurrentGuess("");
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < COLS) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  const incrementScore = async (points = 1) => {
    const newScore = score + points;
    setScore(newScore);
    await updateDoc(doc(db, "scores", user.uid), {
      score: newScore,
      lastUpdated: new Date(),
    });
  };

  const markWordPlayed = async (word: string) => {
    const docRef = doc(db, "scores", user.uid);
    const docSnap = await getDoc(docRef);
    const playedWords: string[] = docSnap.data()?.playedWords || [];
    if (!playedWords.includes(word)) {
      await updateDoc(docRef, { playedWords: [...playedWords, word] });
      if (word === getDailyWord()) setDailyPlayed(true);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  const playAgain = async (daily = false) => {
    let nextWord = daily ? getDailyWord() : WORD;
    if (!daily) {
      const docSnap = await getDoc(doc(db, "scores", user.uid));
      const playedWords: string[] = docSnap.data()?.playedWords || [];
      const unplayed = GAME_WORDS.filter((w) => !playedWords.includes(w));
      if (unplayed.length > 0) {
        nextWord = unplayed[Math.floor(Math.random() * unplayed.length)];
      }
    }
    setWORD(nextWord);
    setGuesses(Array(ROWS).fill(""));
    setCurrentRow(0);
    setCurrentGuess("");
    setSolved(false);
    setLost(false);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKey(e.key);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  });

  const getLetterColor = (letter: string, idx: number, rowIdx: number) => {
    if (rowIdx >= currentRow) return "border-4 border-gray-300 bg-white";
    if (letter === WORD[idx])
      return "bg-brand border-4 border-brand-dark text-white";
    if (WORD.includes(letter))
      return "bg-accent border-4 border-yellow-600 text-gray-800";
    return "bg-gray-400 border-4 border-gray-500 text-white";
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl py-4 px-8 flex flex-col gap-4 items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-4 bg-brand-light rounded-2xl px-6 py-3 shadow-lg">
          <p className="text-white font-black text-lg">{user.displayName}</p>
          <p className="text-white text-lg font-bold">Score: {score}</p>
        </div>
        <BaseButton
          onClick={handleLogout}
          variant="danger"
          rounded="rounded-2xl"
        >
          <span className="font-bold">Logout</span>
        </BaseButton>
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
          won={true}
          word={WORD}
          leaderboard={leaderboard}
          dailyPlayed={dailyPlayed}
          onPlayAgain={playAgain}
        />
      )}

      {/* Lose Modal */}
      {lost && (
        <WinModal
          won={false}
          word={WORD}
          leaderboard={leaderboard}
          dailyPlayed={dailyPlayed}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  );
}
