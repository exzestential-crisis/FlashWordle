import Row from "./Row";

type Props = {
  guesses: string[];
  currentGuess: string;
  currentRow: number;
  getLetterColor: (letter: string, idx: number, rowIdx: number) => string;
  shakeRow?: number | null;
};

export default function Grid({
  guesses,
  currentGuess,
  currentRow,
  getLetterColor,
  shakeRow = null,
}: Props) {
  return (
    <div className="grid grid-rows-6 gap-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner">
      {guesses.map((row, i) => (
        <Row
          key={i}
          guess={row}
          currentGuess={currentGuess}
          rowIdx={i}
          currentRow={currentRow}
          getLetterColor={getLetterColor}
          shake={shakeRow === i}
        />
      ))}
    </div>
  );
}
