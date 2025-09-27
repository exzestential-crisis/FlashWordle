import fs from "fs";

const words = fs.readFileSync("words_alpha.txt", "utf-8").split("\n");

const fiveLetterWords = words
  .map((w) => w.trim().toUpperCase()) // trim CR/LF
  .filter((w) => w.length === 5 && /^[A-Z]+$/.test(w)); // only letters

fs.writeFileSync("src/lib/validWords.json", JSON.stringify(fiveLetterWords));

console.log(`Saved ${fiveLetterWords.length} five-letter words!`);
