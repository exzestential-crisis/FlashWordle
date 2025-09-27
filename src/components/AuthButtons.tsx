"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  GithubAuthProvider,
  signInWithPopup,
  signInAnonymously,
  updateProfile,
  User,
} from "firebase/auth";

type Props = {
  onLogin: (user: User) => void; // callback when login completed
};

export default function AuthButtons({ onLogin }: Props) {
  const [guestName, setGuestName] = useState("");
  const [guestInputVisible, setGuestInputVisible] = useState(false);

  // GitHub login
  const loginGitHub = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    onLogin(result.user);
  };

  // Guest login
  const loginGuest = async () => {
    const { user } = await signInAnonymously(auth);
    setGuestInputVisible(true); // show input for guest name
  };

  const submitGuestName = async () => {
    if (!guestName.trim() || !auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: guestName });
    setGuestInputVisible(false);
    onLogin(auth.currentUser!); // trigger callback
  };

  return (
    <div className="flex flex-col gap-2">
      {!guestInputVisible ? (
        <>
          <button
            onClick={loginGitHub}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Login with GitHub
          </button>
          <button
            onClick={loginGuest}
            className="bg-green-600 px-4 py-2 rounded text-white"
          >
            Play as Guest
          </button>
        </>
      ) : (
        <div className="flex gap-2 items-center mt-2">
          <input
            type="text"
            placeholder="Enter your name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="px-3 py-2 border-2 border-gray-400 rounded w-48 "
            autoFocus
          />
          <button
            onClick={submitGuestName}
            className="bg-yellow-600 px-3 py-2 rounded text-white"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
