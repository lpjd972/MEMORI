import { motion } from "framer-motion";
import { getLevelConfig, type ModeAge } from "@/lib/gameData";

interface LevelCompleteProps {
  level: number;
  mode: ModeAge;
  score: number;
  onNext: () => void;
  /** Offer a 30-second worship break (only when songs are configured) */
  onLouange?: () => void;
}

const LevelComplete = ({ level, mode, score, onNext, onLouange }: LevelCompleteProps) => {
  const { histoire } = getLevelConfig(level, mode);

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-4 gap-5 max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="text-6xl"
        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6 }}
      >
        {histoire.emoji}
      </motion.div>
      <h2 className="text-2xl font-extrabold text-foreground">Niveau {level} réussi !</h2>
      <p className="text-muted-foreground font-semibold">⭐ {score} points</p>

      <div className="bg-card rounded-2xl p-5 shadow-md w-full text-left">
        <p className="text-xs font-bold text-primary mb-2">{histoire.titre} · {histoire.reference}</p>
        {mode === "petits" ? (
          <p className="text-foreground font-semibold">{histoire.resume}</p>
        ) : (
          <>
            <p className="text-foreground font-semibold italic">« {histoire.verset.texte} »</p>
            <p className="text-xs text-muted-foreground mt-2">
              {histoire.verset.reference} — Bible Louis Segond 1910
            </p>
          </>
        )}
      </div>

      <motion.button
        className="game-gradient text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg text-lg"
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Niveau suivant →
      </motion.button>
      {onLouange && (
        <button onClick={onLouange} className="text-sm font-bold text-accent">
          🎵 Une pause louange de 30 secondes ?
        </button>
      )}
    </motion.div>
  );
};

export default LevelComplete;
