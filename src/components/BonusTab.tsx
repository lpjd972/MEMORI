import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuizGate from "./QuizGate";
import LouangePause from "./LouangePause";
import { pickBonusQuestions, type ModeAge, type QuizQuestion } from "@/lib/gameData";
import { LOUANGES } from "@/lib/louanges";

interface BonusTabProps {
  level: number;
  mode: ModeAge;
  onEarnLives: (amount: number) => void;
  onClose: () => void;
}

const DEFI_QUESTIONS = 3;
const LIVES_PER_GOOD_ANSWER = 3;

/** Lives are earned by answering Bible questions; the worship break is free and unrewarded. */
const BonusTab = ({ level, mode, onEarnLives, onClose }: BonusTabProps) => {
  const [defi, setDefi] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [goodAnswers, setGoodAnswers] = useState(0);
  const [showLouange, setShowLouange] = useState(false);

  const startDefi = () => {
    setDefi(pickBonusQuestions(level, mode, DEFI_QUESTIONS));
    setIndex(0);
    setGoodAnswers(0);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setGoodAnswers((g) => g + 1);
      onEarnLives(LIVES_PER_GOOD_ANSWER);
    }
    setIndex((i) => i + 1);
  };

  const defiDone = defi !== null && index >= defi.length;

  return (
    <>
      <AnimatePresence>{showLouange && <LouangePause key="louange" onClose={() => setShowLouange(false)} />}</AnimatePresence>

      <motion.div className="min-h-screen flex flex-col bg-background" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
          <button onClick={onClose} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            ← Retour
          </button>
          <h1 className="text-lg font-extrabold text-foreground">🎁 Bonus</h1>
          <div className="w-12" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          {defi && !defiDone ? (
            <div className="w-full">
              <p className="text-center text-sm font-bold text-accent mb-4">
                📖 Défi de la Parole — question {index + 1}/{defi.length}
              </p>
              <QuizGate key={index} question={defi[index]} onAnswer={handleAnswer} autoRead={mode === "petits"} />
            </div>
          ) : (
            <>
              {defiDone && (
                <motion.div className="text-center mb-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="text-5xl mb-2">{goodAnswers > 0 ? "🎉" : "🙏"}</div>
                  <p className="font-extrabold text-foreground text-lg">
                    {goodAnswers}/{defi!.length} bonnes réponses · +{goodAnswers * LIVES_PER_GOOD_ANSWER} ❤️
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col gap-3 w-full max-w-sm">
                <motion.button
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors text-left"
                  onClick={startDefi}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-3xl">📖</span>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{defiDone ? "Rejouer le Défi de la Parole" : "Défi de la Parole"}</p>
                    <p className="text-xs text-muted-foreground">
                      {DEFI_QUESTIONS} questions sur les histoires déjà vues. Chaque bonne réponse rapporte des vies.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg whitespace-nowrap">
                    +{LIVES_PER_GOOD_ANSWER} ❤️ / réponse
                  </span>
                </motion.button>

                <motion.button
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors text-left"
                  onClick={() => setShowLouange(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-3xl">🎵</span>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Pause louange (30 s)</p>
                    <p className="text-xs text-muted-foreground">
                      {LOUANGES.length > 0
                        ? "Découvre un chant de louange d'une chaîne YouTube chrétienne."
                        : "Un psaume à méditer pendant 30 secondes."}
                    </p>
                  </div>
                </motion.button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center max-w-sm mt-2">
                Aucune publicité dans Memory Bible. Les chants viennent de chaînes de louange, pour les faire connaître.
              </p>
            </>
          )}
        </main>
      </motion.div>
    </>
  );
};

export default BonusTab;
