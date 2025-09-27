type Props = {
  letter: string;
  colorClass: string;
};

export default function LetterBox({ letter, colorClass }: Props) {
  return (
    <div
      className={`w-10 h-10 border flex items-center justify-center text-xl font-bold ${colorClass}`}
    >
      {letter}
    </div>
  );
}
