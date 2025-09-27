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
    <div className="grid grid-rows-6 gap-1">
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
