import { motion } from "framer-motion";

interface GameOverProps {
  score: number;
  level: number;
  onContinue: () => void;
  onRestart: () => void;
}

const GameOver = ({ score, level, onContinue, onRestart }: GameOverProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-6xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        💔
      </motion.div>
      <h2 className="text-2xl font-extrabold text-foreground">Game Over</h2>
      <p className="text-muted-foreground font-semibold">
        Niveau atteint : {level} · Score : {score}
      </p>
      <p className="text-sm text-muted-foreground">Plus de vies… mais ne lâche rien !</p>
      <motion.button
        className="game-gradient text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg text-lg"
        onClick={onContinue}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🔄 Recommencer (niveau {level})
      </motion.button>
      <motion.button
        className="bg-muted text-muted-foreground font-bold px-6 py-2 rounded-xl text-sm"
        onClick={onRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🏠 Retour au menu
      </motion.button>
    </motion.div>
  );
};

export default GameOver;
