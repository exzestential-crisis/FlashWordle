"use client";

import { useState } from "react";
import AuthButtons from "@/components/AuthButtons";
import WordleGame from "@/components/WordleGame";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  return (
    <main className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">FlashWordle</h1>

      {!user ? (
        <AuthButtons onLogin={(u) => setUser(u)} />
      ) : (
        <>
          <WordleGame user={user} onLogout={() => setUser(null)} />
        </>
      )}
    </main>
  );
}
