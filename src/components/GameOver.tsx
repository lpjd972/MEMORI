import { motion } from "framer-motion";
import { INITIAL_LIVES } from "@/hooks/useGameState";

interface GameOverProps {
  score: number;
  level: number;
  onContinue: () => void;
  onHome: () => void;
}

const GameOver = ({ score, level, onContinue, onHome }: GameOverProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div className="text-6xl" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        💔
      </motion.div>
      <h2 className="text-2xl font-extrabold text-foreground">Plus de vies…</h2>
      <p className="text-muted-foreground font-semibold">
        Niveau atteint : {level} · Score : {score}
      </p>
      <p className="text-sm text-muted-foreground max-w-xs">
        « Sept fois le juste tombe, et il se relève. » <span className="whitespace-nowrap">— Proverbes 24:16</span>
      </p>
      <motion.button
        className="game-gradient text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg text-lg"
        onClick={onContinue}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🔄 Reprendre au niveau {level} ({INITIAL_LIVES} ❤️)
      </motion.button>
      <motion.button
        className="bg-muted text-muted-foreground font-bold px-6 py-2 rounded-xl text-sm"
        onClick={onHome}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🏠 Retour au menu (la progression est gardée)
      </motion.button>
    </motion.div>
  );
};

export default GameOver;
