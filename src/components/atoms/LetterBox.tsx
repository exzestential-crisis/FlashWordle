type Props = {
  letter: string;
  colorClass: string;
};

export default function LetterBox({ letter, colorClass }: Props) {
  return (
    <div
      className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl font-black uppercase ${colorClass} transition-all duration-200 transform hover:scale-105`}
    >
      {letter}
    </div>
  );
}
