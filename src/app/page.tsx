"use client";
import { useState } from "react";
import AuthButtons from "@/components/AuthButtons";
import WordleGame from "@/components/WordleGame";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-light via-white to-accent-light flex flex-col items-center justify-center gap-2">
      {/* Logo & Title */}
      <div className="text-center">
        <h1 className="text-6xl font-black text-brand drop-shadow-lg ">
          <span className="text-accent">Flash</span>Wordle
        </h1>
        <Link href={"https://studyflashback.vercel.app"}>
          <p>
            Powered by <span className="font-bold">Flashback</span>
          </p>
        </Link>
      </div>

      {!user ? (
        <AuthButtons onLogin={(u) => setUser(u)} />
      ) : (
        <WordleGame user={user} onLogout={() => setUser(null)} />
      )}
    </main>
  );
}
