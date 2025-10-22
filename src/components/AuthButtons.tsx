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
import BaseButton from "@/components/BaseButton";

type Props = {
  onLogin: (user: User) => void;
};

export default function AuthButtons({ onLogin }: Props) {
  const [guestName, setGuestName] = useState("");
  const [guestInputVisible, setGuestInputVisible] = useState(false);

  const loginGitHub = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    onLogin(result.user);
  };

  const loginGuest = async () => {
    const { user } = await signInAnonymously(auth);
    setGuestInputVisible(true);
  };

  const submitGuestName = async () => {
    if (!guestName.trim() || !auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: guestName });
    setGuestInputVisible(false);
    onLogin(auth.currentUser!);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 w-96">
      {!guestInputVisible ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Get Started
          </h2>
          <BaseButton onClick={loginGitHub} variant="default" fullWidth>
            <span className="text-lg font-semibold">Login with GitHub</span>
          </BaseButton>
          <BaseButton
            onClick={loginGuest}
            variant="default"
            fullWidth
            style="bg-accent shadow-[0_4px_0_theme('colors.accent-dark')] hover:bg-accent-light"
          >
            <span className="text-lg font-semibold text-gray-800">
              Play as Guest
            </span>
          </BaseButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            What's your name?
          </h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="px-4 py-3 border-4 border-brand rounded-xl text-lg font-medium focus:outline-none focus:border-brand-dark transition"
            autoFocus
          />
          <BaseButton onClick={submitGuestName} variant="default" fullWidth>
            <span className="text-lg font-semibold">Let's Play!</span>
          </BaseButton>
        </div>
      )}
    </div>
  );
}
