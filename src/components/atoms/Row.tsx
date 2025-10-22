import LetterBox from "./LetterBox";

type Props = {
  guess: string;
  currentGuess?: string;
  rowIdx: number;
  currentRow: number;
  getLetterColor: (letter: string, idx: number, rowIdx: number) => string;
  shake?: boolean;
};

export default function Row({
  guess,
  currentGuess = "",
  rowIdx,
  currentRow,
  getLetterColor,
  shake = false,
}: Props) {
  return (
    <div className={`grid grid-cols-5 gap-2 ${shake ? "shake" : ""}`}>
      {Array.from({ length: 5 }).map((_, j) => {
        const letter = rowIdx === currentRow ? currentGuess[j] : guess[j] || "";
        const colorClass = getLetterColor(letter, j, rowIdx);
        return <LetterBox key={j} letter={letter} colorClass={colorClass} />;
      })}
    </div>
  );
}
