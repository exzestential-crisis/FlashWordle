// "use client";

// import { useEffect, useState } from "react";
// import { auth } from "@/lib/firebase";
// import { onAuthStateChanged, User } from "firebase/auth";
// import AuthButtons from "@/components/AuthButtons";
// import WordleGame from "@/components/WordleGame";
// import Leaderboard from "@/components/Leaderboard";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     return onAuthStateChanged(auth, (u) => setUser(u));
//   }, []);

//   return (
//     <main className="p-4">
//       <h1>FlashWordle</h1>
//       <AuthButtons user={user} />
//       {user && <WordleGame />}
//       <Leaderboard />
//     </main>
//   );
// }
