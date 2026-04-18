import { motion } from "framer-motion";

interface MemoryCardProps {
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
}

const MemoryCard = ({ symbol, isFlipped, isMatched, onClick, disabled }: MemoryCardProps) => {
  return (
    <motion.button
      className="card-flip aspect-square w-full"
      onClick={onClick}
      disabled={disabled || isFlipped || isMatched}
      whileTap={!disabled && !isFlipped && !isMatched ? { scale: 0.95 } : {}}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className={`card-inner relative w-full h-full ${isFlipped || isMatched ? "flipped" : ""}`}>
        {/* Back of card */}
        <div className="card-back absolute inset-0 rounded-xl bg-game-card-back flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
          <span className="text-2xl sm:text-3xl font-bold text-primary-foreground select-none">?</span>
        </div>
        {/* Front of card */}
        <div
          className={`card-front absolute inset-0 rounded-xl flex items-center justify-center shadow-lg ${
            isMatched ? "bg-game-card-matched" : "bg-card"
          }`}
        >
          <span className="text-2xl sm:text-4xl select-none">{symbol}</span>
        </div>
      </div>
    </motion.button>
  );
};

export default MemoryCard;
