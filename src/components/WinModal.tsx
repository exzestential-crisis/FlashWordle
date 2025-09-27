// components/WinModal.tsx
"use client";

type Props = {
  leaderboard: { username: string; score: number }[];
  dailyPlayed: boolean;
  onPlayAgain: (daily?: boolean) => void;
};

export default function WinModal({
  leaderboard,
  dailyPlayed,
  onPlayAgain,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 flex flex-col items-center shadow-lg">
        <h2 className="text-xl font-bold mb-4">🎉 You Win!</h2>

        {/* Leaderboard */}
        <div className="w-full mb-4">
          <h3 className="font-semibold text-center mb-2">Leaderboard</h3>
          <ol className="list-decimal pl-6">
            {leaderboard.map((u, i) => (
              <li key={i}>
                {u.username}: {u.score}
              </li>
            ))}
          </ol>
        </div>

        {/* Play Again Buttons */}
        <div className="flex gap-2 mt-2">
          {!dailyPlayed && (
            <button
              onClick={() => onPlayAgain(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Daily Challenge
            </button>
          )}
          <button
            onClick={() => onPlayAgain(false)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
