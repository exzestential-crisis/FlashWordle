"use client";
import BaseButton from "./BaseButton";

type Props = {
  won: boolean;
  word: string;
  leaderboard: { username: string; score: number }[];
  dailyPlayed: boolean;
  onPlayAgain: (daily?: boolean) => void;
};

export default function WinModal({
  won,
  word,
  leaderboard,
  dailyPlayed,
  onPlayAgain,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 w-96 flex flex-col items-center shadow-2xl transform animate-slideUp">
        {/* Icon */}
        <div
          className={`w-20 h-20 ${
            won ? "bg-accent" : "bg-danger"
          } rounded-full flex items-center justify-center mb-4 shadow-lg`}
        >
          <span className="text-5xl">{won ? "🏆" : "😢"}</span>
        </div>

        <h2
          className={`text-3xl font-black ${
            won ? "text-brand" : "text-danger"
          } mb-6`}
        >
          {won ? "You Win!" : "Game Over!"}
        </h2>

        {/* Show the word if they lost */}
        {!won && (
          <div className="mb-6 bg-gray-100 rounded-2xl px-6 py-4">
            <p className="text-gray-600 text-sm font-semibold mb-1">
              The word was:
            </p>
            <p className="text-3xl font-black text-brand tracking-wider">
              {word}
            </p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="w-full mb-6 bg-gradient-to-br from-brand-light to-brand rounded-2xl p-5 shadow-lg">
          <h3 className="font-bold text-xl text-white text-center mb-3 flex items-center justify-center gap-2">
            <span>👑</span> Leaderboard <span>👑</span>
          </h3>
          <ol className="space-y-2">
            {leaderboard.map((u, i) => (
              <li
                key={i}
                className="bg-white rounded-xl px-4 py-2 flex justify-between items-center shadow-md"
              >
                <span className="font-bold text-gray-700">
                  {i + 1}. {u.username}
                </span>
                <span className="font-black text-brand text-lg">{u.score}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Play Again Buttons */}
        <div className="flex gap-3 mt-2 w-full">
          {!dailyPlayed && (
            <BaseButton
              onClick={() => onPlayAgain(true)}
              variant="default"
              fullWidth
            >
              <span className="font-bold">Daily Challenge</span>
            </BaseButton>
          )}
          <BaseButton
            onClick={() => onPlayAgain(false)}
            variant="default"
            fullWidth
            style="bg-accent shadow-[0_4px_0_theme('colors.accent-dark')] hover:bg-accent-light"
          >
            <span className="font-bold text-gray-800">Play Again</span>
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
