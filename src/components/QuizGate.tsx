import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { shuffleArray, type QuizQuestion } from "@/lib/gameData";
import { HINT_COST } from "@/hooks/useGameState";
import { arreterVoix, lireAVoixHaute, voixDisponible } from "@/lib/voix";
import { BIBLE_APP, passageAlire } from "@/lib/lienBible";

interface QuizGateProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
  /** Points available to buy a hint; leave undefined to hide the hint button */
  score?: number;
  onSpendHint?: () => void;
  /** Read the question aloud as soon as it appears (little ones) */
  autoRead?: boolean;
  /**
   * Level gate: after a wrong answer the same question comes back (options reshuffled) until it is
   * answered right, and the player is sent to the Bible passage. Otherwise (Bible challenge) the
   * player moves on to the next question. The right answer is never revealed after a mistake.
   */
  retryOnWrong?: boolean;
  /** Wording for children who cannot read the Bible alone yet */
  petits?: boolean;
}

const QuizGate = ({
  question,
  onAnswer,
  score,
  onSpendHint,
  autoRead = false,
  retryOnWrong = false,
  petits = false,
}: QuizGateProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [hidden, setHidden] = useState<number[]>([]);
  // Display order of the options (indexes into question.options), reshuffled on each retry
  const [order, setOrder] = useState<number[]>(() => question.options.map((_, i) => i));
  const passage = passageAlire(question.reference);

  const lire = () =>
    lireAVoixHaute([question.question, ...order.filter((i) => !hidden.includes(i)).map((i) => question.options[i])]);

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
    if (correct) {
      setTimeout(() => onAnswer(true), 1600);
    } else if (retryOnWrong) {
      onAnswer(false);
    }
  };

  const retry = () => {
    setOrder(shuffleArray(question.options.map((_, i) => i)));
    setSelected(null);
    setAnswered(false);
  };

  /** Hint: each purchase crosses out one wrong answer, until two choices remain */
  const canBuyHint = question.options.length - hidden.length > 2;
  const buyHint = () => {
    if (!onSpendHint || score === undefined || score < HINT_COST || !canBuyHint) return;
    const wrong = question.options.map((_, i) => i).filter((i) => i !== question.correctIndex && !hidden.includes(i));
    setHidden((h) => [...h, shuffleArray(wrong)[0]]);
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
          {order.map((i) => {
            const option = question.options[i];
            const barre = hidden.includes(i);
            let style = barre
              ? "bg-muted text-muted-foreground line-through opacity-50 border-2 border-transparent"
              : "bg-game-surface text-foreground border-2 border-transparent";
            if (answered && isCorrect && i === question.correctIndex) {
              style = "bg-game-card-matched text-secondary-foreground border-2 border-secondary";
            } else if (answered && i === selected && i !== question.correctIndex) {
              style = "bg-game-card-wrong text-destructive-foreground border-2 border-destructive animate-shake";
            }

            return (
              <motion.button
                key={i}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${style}`}
                onClick={() => handleSelect(i)}
                disabled={answered || barre}
                whileTap={!answered && !barre ? { scale: 0.97 } : {}}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        {answered && isCorrect && (
          <motion.p className="mt-5 text-sm font-bold text-secondary" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            ✅ Bravo ! <span className="text-muted-foreground font-semibold">📖 {question.reference}</span>
          </motion.p>
        )}

        {answered && !isCorrect && (
          <motion.div className="mt-5 space-y-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-bold text-destructive">❌ Pas encore…</p>
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 text-sm text-foreground">
              {petits ? (
                <>
                  📖 Demande à un adulte de te lire l'histoire dans la Bible :{" "}
                  <strong>{passage?.chapitre ?? question.reference}</strong>. La réponse est dedans !
                </>
              ) : (
                <>
                  📖 La réponse se trouve dans <strong>{question.reference}</strong>. Ouvre ta Bible et relis{" "}
                  {passage ? <strong>tout le chapitre {passage.chapitre}</strong> : "ce passage"} pour trouver la bonne
                  réponse.
                </>
              )}
            </div>
            {passage && (
              <a
                href={passage.url}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary/20"
              >
                📖 Lire {passage.chapitre} (Louis Segond)
              </a>
            )}
            <p className="text-[11px] text-muted-foreground text-center">
              Pas de Bible sous la main ? L'appli gratuite « {BIBLE_APP.nom} » :{" "}
              <a href={BIBLE_APP.playStore} target="_blank" rel="noreferrer" className="underline">
                Android
              </a>{" "}
              ·{" "}
              <a href={BIBLE_APP.appStore} target="_blank" rel="noreferrer" className="underline">
                iPhone
              </a>
            </p>
            <button
              onClick={retryOnWrong ? retry : () => onAnswer(false)}
              className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl"
            >
              {retryOnWrong ? "🔄 J'ai relu, je réessaie" : "Question suivante →"}
            </button>
          </motion.div>
        )}
      </div>

      {onSpendHint && score !== undefined && !answered && canBuyHint && (
        <div className="text-center mt-4">
          <button
            onClick={buyHint}
            disabled={score < HINT_COST}
            className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            💡 Indice : barrer une mauvaise réponse ({HINT_COST} ⭐)
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default QuizGate;
