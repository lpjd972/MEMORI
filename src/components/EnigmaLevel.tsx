import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ENIGMA_CHALLENGES, type EnigmaChallenge, shuffleArray } from "@/lib/gameData";

interface EnigmaLevelProps {
  level: number;
  onComplete: (bonusScore: number) => void;
  onFail: (livesLost: number) => void;
}

const EnigmaLevel = ({ level, onComplete, onFail }: EnigmaLevelProps) => {
  const [challenge, setChallenge] = useState<EnigmaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const pool = ENIGMA_CHALLENGES.filter((c) => c.difficulty <= Math.min(level, 5));
    const picked = shuffleArray(pool)[0];
    setChallenge(picked);
    setUserAnswer("");
    setAttempts(0);
    setHint(false);
    setSolved(false);
    setTimeLeft(60);
  }, [level]);

  useEffect(() => {
    if (solved || !challenge) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onFail(2);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [challenge, solved, onFail]);

  const handleSubmit = useCallback(() => {
    if (!challenge || solved) return;
    const normalized = userAnswer.trim().toLowerCase();
    const correct = challenge.answers.some((a) => a.toLowerCase() === normalized);
    if (correct) {
      setSolved(true);
      setTimeout(() => onComplete(hint ? 30 : 60), 1200);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        onFail(3);
      } else {
        onFail(1);
      }
      setUserAnswer("");
    }
  }, [challenge, userAnswer, attempts, hint, solved, onComplete, onFail]);

  if (!challenge) return null;

  return (
    <motion.div
      className="w-full max-w-md mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-card rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="bg-accent/20 text-accent text-xs font-bold px-3 py-1 rounded-full">
            🔐 Énigme
          </span>
          <span className={`text-sm font-black ${timeLeft <= 10 ? "text-destructive animate-pulse-heart" : "text-muted-foreground"}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground">{challenge.question}</h3>

        {challenge.type === "riddle" && (
          <div className="space-y-3">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ta réponse..."
              className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary"
              disabled={solved}
            />
            <motion.button
              className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl"
              onClick={handleSubmit}
              whileTap={{ scale: 0.97 }}
              disabled={solved}
            >
              {solved ? "✅ Correct !" : "Valider"}
            </motion.button>
          </div>
        )}

        {challenge.type === "sequence" && (
          <div className="space-y-3">
            <p className="text-center text-2xl font-black tracking-widest text-primary">
              {challenge.sequence?.join("  ")} ?
            </p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Nombre suivant..."
              className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary"
              disabled={solved}
            />
            <motion.button
              className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl"
              onClick={handleSubmit}
              whileTap={{ scale: 0.97 }}
              disabled={solved}
            >
              {solved ? "✅ Correct !" : "Valider"}
            </motion.button>
          </div>
        )}

        {challenge.type === "wordPuzzle" && (
          <div className="space-y-3">
            <p className="text-center text-3xl font-black tracking-widest text-primary">
              {challenge.scrambled}
            </p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Mot déchiffré..."
              className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary"
              disabled={solved}
            />
            <motion.button
              className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl"
              onClick={handleSubmit}
              whileTap={{ scale: 0.97 }}
              disabled={solved}
            >
              {solved ? "✅ Correct !" : "Valider"}
            </motion.button>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Tentative {attempts}/3</span>
          {!hint && !solved && (
            <button
              onClick={() => setHint(true)}
              className="text-primary font-bold"
            >
              💡 Indice (-30pts)
            </button>
          )}
        </div>
        {hint && (
          <p className="text-sm text-accent font-semibold italic">💡 {challenge.hint}</p>
        )}

        {solved && (
          <motion.div
            className="text-center text-secondary font-black text-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            🎉 Bravo !
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EnigmaLevel;
