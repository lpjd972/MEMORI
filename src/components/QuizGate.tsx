import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { shuffleArray, type QuizQuestion } from "@/lib/gameData";
import { HINT_COST } from "@/hooks/useGameState";
import { arreterVoix, lireAVoixHaute, voixDisponible } from "@/lib/voix";

interface QuizGateProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
  /** Points available to buy a hint; leave undefined to hide the hint button */
  score?: number;
  onSpendHint?: () => void;
  /** Read the question aloud as soon as it appears (little ones) */
  autoRead?: boolean;
}

const QuizGate = ({ question, onAnswer, score, onSpendHint, autoRead = false }: QuizGateProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [hidden, setHidden] = useState<number[]>([]);

  const lire = () => lireAVoixHaute([question.question, ...question.options.filter((_, i) => !hidden.includes(i))]);

  useEffect(() => {
    if (autoRead) lire();
    return () => arreterVoix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const handleSelect = (index: number) => {
    if (answered) return;
    arreterVoix();
    setSelected(index);
    setAnswered(true);
    const correct = index === question.correctIndex;
    setTimeout(() => onAnswer(correct), correct ? 1600 : 2200);
  };

  /** Hint: removes wrong answers until only two choices remain */
  const buyHint = () => {
    if (!onSpendHint || score === undefined || score < HINT_COST || hidden.length > 0) return;
    const wrong = question.options.map((_, i) => i).filter((i) => i !== question.correctIndex);
    setHidden(shuffleArray(wrong).slice(0, question.options.length - 2));
    onSpendHint();
  };

  const isCorrect = selected === question.correctIndex;

  return (
    <motion.div className="w-full max-w-md mx-auto px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-card rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{question.category}</span>
          {voixDisponible() && (
            <button
              onClick={lire}
              className="text-xs font-bold bg-muted text-foreground px-3 py-1 rounded-full hover:bg-muted/70"
              aria-label="Écouter la question"
            >
              🔊 Écouter
            </button>
          )}
        </div>
        <h3 className="text-lg font-bold text-foreground mb-6">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option, i) => {
            if (hidden.includes(i)) return null;
            let style = "bg-game-surface text-foreground border-2 border-transparent";
            if (answered && i === question.correctIndex) {
              style = "bg-game-card-matched text-secondary-foreground border-2 border-secondary";
            } else if (answered && i === selected && i !== question.correctIndex) {
              style = "bg-game-card-wrong text-destructive-foreground border-2 border-destructive animate-shake";
            }

            return (
              <motion.button
                key={i}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${style}`}
                onClick={() => handleSelect(i)}
                disabled={answered}
                whileTap={!answered ? { scale: 0.97 } : {}}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        {answered && (
          <motion.p
            className={`mt-5 text-sm font-bold ${isCorrect ? "text-secondary" : "text-destructive"}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isCorrect ? "✅ Bravo !" : "❌ Ce n'est pas ça… La réponse est dans ta Bible."}{" "}
            <span className="text-muted-foreground font-semibold">📖 À lire : {question.reference}</span>
          </motion.p>
        )}
      </div>

      {onSpendHint && score !== undefined && !answered && hidden.length === 0 && question.options.length > 2 && (
        <div className="text-center mt-4">
          <button
            onClick={buyHint}
            disabled={score < HINT_COST}
            className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            💡 Indice : retirer des mauvaises réponses ({HINT_COST} ⭐)
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default QuizGate;
