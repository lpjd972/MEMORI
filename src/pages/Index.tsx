import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeScreen from "@/components/HomeScreen";
import AuthScreen from "@/components/AuthScreen";
import MemoryBoard from "@/components/MemoryBoard";
import LivesDisplay from "@/components/LivesDisplay";
import QuizGate from "@/components/QuizGate";
import LevelComplete from "@/components/LevelComplete";
import GameOver from "@/components/GameOver";
import Leaderboard from "@/components/Leaderboard";
import BonusTab from "@/components/BonusTab";
import LouangePause from "@/components/LouangePause";
import MotsMelesGame from "@/components/MotsMelesGame";
import VersetsGame from "@/components/VersetsGame";
import { useGameState, HINT_COST, INITIAL_LIVES } from "@/hooks/useGameState";
import { useAuth } from "@/hooks/useAuth";
import { useCloudSave } from "@/hooks/useCloudSave";
import { MODES_ORDER, getLevelConfig, pickQuestion, type ModeAge, type QuizQuestion } from "@/lib/gameData";
import { LOUANGES } from "@/lib/louanges";
import { ecrireProgressionLocale, lireProgressionLocale, type Progression } from "@/lib/progression";

const MODE_KEY = "memory-bible-mode";
/** A worship break is offered every N completed levels (when songs are configured) */
const LOUANGE_EVERY = 3;
/** Below this many lives, the player is told once how to earn more in the Bonus tab */
const LOW_LIVES = 20;
/** After this many wrong answers on the same level, the player is sent back to the Bible passage */
const STUCK_AFTER = 2;

function readMode(): ModeAge {
  try {
    const saved = localStorage.getItem(MODE_KEY) as ModeAge | null;
    return saved && MODES_ORDER.includes(saved) ? saved : "enfants";
  } catch {
    return "enfants";
  }
}

const Index = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [showLouange, setShowLouange] = useState(false);
  const [jeu, setJeu] = useState<"mots-meles" | "versets" | null>(null);
  const [mode, setMode] = useState<ModeAge>(readMode);

  const {
    gameState,
    startGame,
    goHome,
    restartGame,
    continueAfterGameOver,
    replaceProgress,
    loseLives,
    spendScore,
    addScore,
    addLives,
    completeMemory,
    completeQuiz,
    nextLevel,
  } = useGameState();

  const { saveProgress, loadProgress, loadLevels, saveScore } = useCloudSave(user?.id);
  // Level reached in each age category, shown on the "Qui joue ?" buttons
  const [levels, setLevels] = useState<Partial<Record<ModeAge, number>>>({});
  // Guards against a slow load overwriting a newer one (quick category changes)
  const loadTokenRef = useRef(0);
  // Category whose progress is currently in the game state: only that one may be saved
  const loadedModeRef = useRef<ModeAge | null>(null);

  const { phase, lives, currentLevel, score } = gameState;

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(() => pickQuestion(1, readMode()));
  // Incremented for every new question so the quiz always remounts (even if the same text comes back)
  const [questionKey, setQuestionKey] = useState(0);
  const askedRef = useRef<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [lowLivesOpen, setLowLivesOpen] = useState(false);
  const lowLivesShownRef = useRef(false);

  /** Each age category keeps its own progress: on the account when signed in, otherwise on this device */
  const persist = useCallback(
    (m: ModeAge, p: Progression) => {
      if (user) saveProgress(p, m);
      else ecrireProgressionLocale(m, p);
    },
    [user, saveProgress]
  );

  const refreshLevels = useCallback(async () => {
    if (user) {
      setLevels(await loadLevels());
    } else {
      const local: Partial<Record<ModeAge, number>> = {};
      for (const m of MODES_ORDER) {
        const p = lireProgressionLocale(m);
        if (p) local[m] = p.currentLevel;
      }
      setLevels(local);
    }
  }, [user, loadLevels]);

  const loadCategory = useCallback(
    async (m: ModeAge) => {
      const token = ++loadTokenRef.current;
      const saved = user ? await loadProgress(m) : lireProgressionLocale(m);
      if (token !== loadTokenRef.current) return;
      loadedModeRef.current = m;
      replaceProgress(saved);
      refreshLevels();
    },
    [user, loadProgress, replaceProgress, refreshLevels]
  );

  const changeMode = useCallback(
    (m: ModeAge) => {
      if (m === mode) return;
      loadedModeRef.current = null;
      setMode(m);
      try {
        localStorage.setItem(MODE_KEY, m);
      } catch {
        // storage unavailable: the choice simply won't be remembered
      }
      loadCategory(m);
    },
    [mode, loadCategory]
  );

  // Load the current category's progress at start-up and whenever the player signs in or out
  useEffect(() => {
    if (!authLoading) loadCategory(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id]);

  // Auto-save progress (stars and lives also change from the home screen: Bonus, other games),
  // but only once the current category's own progress is loaded
  useEffect(() => {
    if (phase !== "gameOver" && loadedModeRef.current === mode) {
      persist(mode, gameState);
    }
  }, [gameState, phase, mode, persist]);

  const handleRestart = useCallback(() => {
    restartGame();
    persist(mode, { lives: INITIAL_LIVES, currentLevel: 1, score: 0, levelsCompleted: 0 });
    setLevels((l) => ({ ...l, [mode]: 1 }));
  }, [restartGame, persist, mode]);

  // Save score on game over
  useEffect(() => {
    if (user && phase === "gameOver") {
      saveScore(score, currentLevel, mode);
    }
  }, [user, phase, score, currentLevel, mode, saveScore]);

  // Tell the player once, when lives drop to LOW_LIVES, how to earn more; again only after refilling above it
  useEffect(() => {
    if (lives > LOW_LIVES) {
      lowLivesShownRef.current = false;
    } else if (lives > 0 && !lowLivesShownRef.current && (phase === "memory" || phase === "quiz")) {
      lowLivesShownRef.current = true;
      setLowLivesOpen(true);
    }
  }, [lives, phase]);

  const newQuestion = useCallback(
    (level: number) => {
      const q = pickQuestion(level, mode, askedRef.current);
      askedRef.current = [...askedRef.current, q.question];
      setCurrentQuestion(q);
      setQuestionKey((k) => k + 1);
    },
    [mode]
  );

  const handleMemoryComplete = useCallback(
    (bonus: number) => {
      askedRef.current = [];
      setWrongAnswers(0);
      newQuestion(currentLevel);
      completeMemory(bonus);
    },
    [completeMemory, newQuestion, currentLevel]
  );

  const handleQuizAnswer = useCallback(
    (correct: boolean) => {
      // A wrong answer costs a life; the same question stays until it is answered right
      completeQuiz(correct);
      if (!correct) setWrongAnswers((n) => n + 1);
    },
    [completeQuiz]
  );

  const handleSpendHint = useCallback(() => spendScore(HINT_COST), [spendScore]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-5xl" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          📖
        </motion.div>
      </div>
    );
  }

  if (showAuth && !user) {
    return <AuthScreen onSuccess={() => setShowAuth(false)} />;
  }

  if (showLeaderboard) {
    return <Leaderboard mode={mode} onClose={() => setShowLeaderboard(false)} />;
  }

  if (showBonus) {
    return (
      <BonusTab
        level={currentLevel}
        mode={mode}
        onEarnLives={addLives}
        score={score}
        onSpendStars={spendScore}
        onClose={() => setShowBonus(false)}
      />
    );
  }

  if (jeu) {
    const Jeu = jeu === "mots-meles" ? MotsMelesGame : VersetsGame;
    return (
      <Jeu mode={mode} score={score} onSpendStars={spendScore} onEarnStars={addScore} onClose={() => setJeu(null)} />
    );
  }

  if (phase === "home") {
    return (
      <HomeScreen
        onStart={startGame}
        mode={mode}
        onModeChange={changeMode}
        currentLevel={currentLevel}
        levels={levels}
        onRestart={handleRestart}
        onBonus={() => setShowBonus(true)}
        onJeu={setJeu}
        user={user}
        profile={profile}
        onAuthClick={() => setShowAuth(true)}
        onSignOut={signOut}
        onLeaderboard={() => setShowLeaderboard(true)}
      />
    );
  }

  const offerLouange = LOUANGES.length > 0 && gameState.levelsCompleted % LOUANGE_EVERY === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence>{showLouange && <LouangePause key="louange" onClose={() => setShowLouange(false)} />}</AnimatePresence>

      <AnimatePresence>
        {lowLivesOpen && (
          <motion.div
            key="low-lives"
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card rounded-2xl p-6 shadow-xl max-w-sm w-full text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              role="dialog"
              aria-label="Plus beaucoup de vies"
            >
              <div className="text-5xl mb-2">❤️</div>
              <h2 className="text-xl font-extrabold text-foreground mb-2">Plus que {lives} cœurs !</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Tu peux en gagner dans l'onglet <strong>🎁 Bonus</strong> : réussis le <strong>Défi de la Parole</strong>{" "}
                (jusqu'à +50 ❤️) ou fais une <strong>pause psaume</strong> de 30 secondes (+9 ❤️).
              </p>
              <div className="flex flex-col gap-2">
                <button
                  className="game-gradient text-primary-foreground font-bold py-3 rounded-xl"
                  onClick={() => {
                    setLowLivesOpen(false);
                    setShowBonus(true);
                  }}
                >
                  🎁 Aller au Bonus
                </button>
                <button className="text-sm font-bold text-muted-foreground py-2" onClick={() => setLowLivesOpen(false)}>
                  Plus tard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <button onClick={goHome} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          ← Menu
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-game-gold">⭐ {score}</span>
          <button
            onClick={() => setShowBonus(true)}
            className="text-xs font-bold bg-accent/20 text-accent px-2 py-1 rounded-lg hover:bg-accent/30 transition-colors"
          >
            🎁 Bonus
          </button>
        </div>
        <LivesDisplay lives={lives} />
      </header>

      <main className="flex-1 flex items-center justify-center py-6 px-4">
        <AnimatePresence mode="wait">
          {phase === "memory" && (
            <motion.div
              key={`memory-${currentLevel}-${mode}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <MemoryBoard level={currentLevel} mode={mode} onComplete={handleMemoryComplete} onError={loseLives} />
            </motion.div>
          )}

          {phase === "quiz" && (
            <motion.div
              key={`quiz-${questionKey}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <div className="text-center mb-4">
                <span className="text-sm font-bold text-accent">🔓 Question pour débloquer le niveau suivant</span>
              </div>
              {wrongAnswers >= STUCK_AFTER && (
                <div className="max-w-md mx-auto px-4 mb-4">
                  <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 text-sm text-foreground">
                    📖 <strong>Tu bloques ?</strong> Prends ta Bible et relis{" "}
                    <strong>{getLevelConfig(currentLevel, mode).histoire.reference}</strong>. Toutes les réponses sont
                    dedans !
                  </div>
                </div>
              )}
              <QuizGate
                question={currentQuestion}
                onAnswer={handleQuizAnswer}
                score={score}
                onSpendHint={handleSpendHint}
                autoRead={mode === "petits"}
                petits={mode === "petits"}
                retryOnWrong
              />
            </motion.div>
          )}

          {phase === "levelComplete" && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <LevelComplete
                level={currentLevel}
                mode={mode}
                score={score}
                onNext={nextLevel}
                onLouange={offerLouange ? () => setShowLouange(true) : undefined}
              />
            </motion.div>
          )}

          {phase === "gameOver" && (
            <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GameOver score={score} level={currentLevel} onContinue={continueAfterGameOver} onHome={goHome} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
