import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuizGate from "./QuizGate";
import LouangePause from "./LouangePause";
import { pickBonusQuestions, type ModeAge, type QuizQuestion } from "@/lib/gameData";
import { LOUANGES, VIES_PAUSE_PSAUME } from "@/lib/louanges";
import { lirePalier, lireQuestionsVues, monterPalier, noterQuestionsVues } from "@/lib/defi";

interface BonusTabProps {
  level: number;
  mode: ModeAge;
  onEarnLives: (amount: number) => void;
  onClose: () => void;
}

const DEFI_QUESTIONS = 3;
const LIVES_PER_GOOD_ANSWER = 15;
/** Extra lives for a perfect challenge: 3 × 15 + 5 = 50 */
const PERFECT_BONUS = 5;
const DEFI_MAX = DEFI_QUESTIONS * LIVES_PER_GOOD_ANSWER + PERFECT_BONUS;
/** A challenge counts as passed (and makes the next one harder) from this many good answers */
const DEFI_REUSSI = 2;

/** Lives are earned by answering Bible questions; the worship break is free and unrewarded. */
const BonusTab = ({ level, mode, onEarnLives, onClose }: BonusTabProps) => {
  const [defi, setDefi] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [goodAnswers, setGoodAnswers] = useState(0);
  const [aRelire, setARelire] = useState<string[]>([]);
  const [palier, setPalier] = useState(lirePalier);
  const [louangeMode, setLouangeMode] = useState<"psaume" | "chant" | null>(null);

  const startDefi = () => {
    const questions = pickBonusQuestions(level, mode, DEFI_QUESTIONS, lirePalier(), lireQuestionsVues());
    noterQuestionsVues(questions.map((q) => q.question));
    setDefi(questions);
    setIndex(0);
    setGoodAnswers(0);
    setARelire([]);
  };

  const handleAnswer = (correct: boolean) => {
    const current = defi![index];
    const good = goodAnswers + (correct ? 1 : 0);
    if (correct) {
      onEarnLives(LIVES_PER_GOOD_ANSWER);
    } else {
      setARelire((refs) => [...refs, current.reference]);
    }
    setGoodAnswers(good);
    if (index + 1 === defi!.length) {
      if (good === defi!.length) onEarnLives(PERFECT_BONUS);
      if (good >= DEFI_REUSSI) {
        monterPalier();
        setPalier(lirePalier());
      }
    }
    setIndex((i) => i + 1);
  };

  const gain = goodAnswers * LIVES_PER_GOOD_ANSWER + (defi && goodAnswers === defi.length ? PERFECT_BONUS : 0);

  const defiDone = defi !== null && index >= defi.length;

  return (
    <>
      <AnimatePresence>
        {louangeMode && (
          <LouangePause
            key="louange"
            psaumeSeulement={louangeMode === "psaume"}
            onEarnLives={louangeMode === "psaume" ? onEarnLives : undefined}
            onClose={() => setLouangeMode(null)}
          />
        )}
      </AnimatePresence>

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
                    {goodAnswers}/{defi!.length} bonnes réponses · +{gain} ❤️
                  </p>
                  {goodAnswers >= DEFI_REUSSI && mode !== "petits" && (
                    <p className="text-xs text-muted-foreground mt-1">Le prochain défi sera un peu plus difficile 💪</p>
                  )}
                  {aRelire.length > 0 && (
                    <div className="bg-card rounded-xl p-4 mt-4 text-left max-w-sm mx-auto shadow-sm">
                      <p className="text-sm font-bold text-foreground mb-1">📖 Ouvre ta Bible et relis :</p>
                      <ul className="text-sm text-primary font-semibold list-disc pl-5">
                        {aRelire.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        Les réponses s'y trouvent. Relis tout le chapitre pour bien comprendre l'histoire.
                      </p>
                    </div>
                  )}
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
                      {DEFI_QUESTIONS} questions sur les histoires déjà vues : +{LIVES_PER_GOOD_ANSWER} ❤️ par bonne
                      réponse, +{PERFECT_BONUS} si tout est juste.{palier > 0 && mode !== "petits" && ` Défis réussis : ${palier}.`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg whitespace-nowrap">
                    jusqu'à +{DEFI_MAX} ❤️
                  </span>
                </motion.button>

                <motion.button
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors text-left"
                  onClick={() => setLouangeMode("psaume")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-3xl">🙌</span>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Pause psaume (30 s)</p>
                    <p className="text-xs text-muted-foreground">Un verset des Psaumes à méditer pendant 30 secondes.</p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg whitespace-nowrap">
                    +{VIES_PAUSE_PSAUME} ❤️
                  </span>
                </motion.button>

                {LOUANGES.length > 0 && (
                  <motion.button
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors text-left"
                    onClick={() => setLouangeMode("chant")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-3xl">🎵</span>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">Pause louange (30 s)</p>
                      <p className="text-xs text-muted-foreground">
                        Découvre un chant de louange d'une chaîne YouTube chrétienne.
                      </p>
                    </div>
                  </motion.button>
                )}
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
