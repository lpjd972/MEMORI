import { motion } from "framer-motion";
import { getLevelConfig } from "@/lib/gameData";

interface LevelCompleteProps {
  level: number;
  score: number;
  onNext: () => void;
}

const LevelComplete = ({ level, score, onNext }: LevelCompleteProps) => {
  const config = getLevelConfig(level);

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-4 gap-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="text-6xl"
        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6 }}
      >
        🎉
      </motion.div>
      <h2 className="text-2xl font-extrabold text-foreground">
        Niveau {config.level} complété !
      </h2>
      <p className="text-muted-foreground font-semibold">
        +{score} points
      </p>
      <motion.button
        className="game-gradient text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg text-lg"
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Niveau suivant →
      </motion.button>
    </motion.div>
  );
};

export default LevelComplete;
