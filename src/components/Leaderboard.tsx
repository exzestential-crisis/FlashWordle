"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";

export default function Leaderboard() {
  const [scores, setScores] = useState<DocumentData[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "scores"),
      orderBy("score", "desc"),
      limit(10)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setScores(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {scores.map((s, i) => (
          <li key={i}>
            {s.username ?? "Anonymous"}: {s.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
