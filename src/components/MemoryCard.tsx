import { motion } from "framer-motion";
import type { ModeAge } from "@/lib/gameData";

interface MemoryCardProps {
  emoji: string;
  mot: string;
  mode: ModeAge;
  columns: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
}

/** Petits : grande image + mot · Enfants : image + mot · Ados & adultes : le mot seul */
const MemoryCard = ({ emoji, mot, mode, columns, isFlipped, isMatched, onClick, disabled }: MemoryCardProps) => {
  const dense = columns >= 5;
  const emojiSize = mode === "petits" ? "text-4xl sm:text-5xl" : dense ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl";
  const wordSize =
    mode === "grands"
      ? dense
        ? "text-[10px] sm:text-xs"
        : "text-xs sm:text-sm"
      : mode === "petits"
        ? "text-xs sm:text-sm"
        : dense
          ? "text-[9px] sm:text-[11px]"
          : "text-[11px] sm:text-xs";

  return (
    <motion.button
      className={`card-flip w-full ${mode === "grands" ? "aspect-[4/5]" : "aspect-square"}`}
      onClick={onClick}
      disabled={disabled || isFlipped || isMatched}
      aria-label={isFlipped || isMatched ? mot : "Carte cachée"}
      whileTap={!disabled && !isFlipped && !isMatched ? { scale: 0.95 } : {}}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className={`card-inner relative w-full h-full ${isFlipped || isMatched ? "flipped" : ""}`}>
        {/* Back of card */}
        <div className="card-back absolute inset-0 rounded-xl bg-game-card-back flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
          <span className="text-xl sm:text-2xl select-none opacity-90">📖</span>
        </div>
        {/* Front of card */}
        <div
          className={`card-front absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-0.5 p-1 shadow-lg ${
            isMatched ? "bg-game-card-matched text-secondary-foreground" : "bg-card text-foreground"
          }`}
        >
          {mode !== "grands" && <span className={`${emojiSize} leading-none select-none`}>{emoji}</span>}
          <span className={`${wordSize} font-extrabold leading-tight text-center break-words hyphens-auto select-none`}>
            {mot}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default MemoryCard;
