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
import { useGameState, HINT_COST } from "@/hooks/useGameState";
import { useAuth } from "@/hooks/useAuth";
import { useCloudSave } from "@/hooks/useCloudSave";
import { MODES_ORDER, pickQuestion, type ModeAge, type QuizQuestion } from "@/lib/gameData";
import { LOUANGES } from "@/lib/louanges";

const MODE_KEY = "memory-bible-mode";
/** A worship break is offered every N completed levels (when songs are configured) */
const LOUANGE_EVERY = 3;

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
  const [mode, setMode] = useState<ModeAge>(readMode);

  const {
    gameState,
    startGame,
    goHome,
    restartGame,
    continueAfterGameOver,
    loadSavedState,
    loseLives,
    spendScore,
    addLives,
    completeMemory,
    completeQuiz,
    nextLevel,
  } = useGameState();

  const { saveProgress, loadProgress, saveScore } = useCloudSave(user?.id);

  const { phase, lives, currentLevel, score } = gameState;

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(() => pickQuestion(1, readMode()));
  // Incremented for every new question so the quiz always remounts (even if the same text comes back)
  const [questionKey, setQuestionKey] = useState(0);
  const askedRef = useRef<string[]>([]);

  const changeMode = useCallback((m: ModeAge) => {
    setMode(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      // storage unavailable: the choice simply won't be remembered
    }
  }, []);

  // Load saved progress when user logs in
  useEffect(() => {
    if (user) {
      loadProgress().then((saved) => {
        if (saved && saved.levelsCompleted > 0) {
          loadSavedState(saved);
        }
      });
    }
  }, [user, loadProgress, loadSavedState]);

  // Auto-save progress on state changes
  useEffect(() => {
    if (user && phase !== "home" && phase !== "gameOver") {
      saveProgress(gameState);
    }
  }, [user, gameState, phase, saveProgress]);

  // Save score on game over
  useEffect(() => {
    if (user && phase === "gameOver") {
      saveScore(score, currentLevel);
    }
  }, [user, phase, score, currentLevel, saveScore]);

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
      newQuestion(currentLevel);
      completeMemory(bonus);
    },
    [completeMemory, newQuestion, currentLevel]
  );

  const handleQuizAnswer = useCallback(
    (correct: boolean) => {
      completeQuiz(correct);
      if (!correct) newQuestion(currentLevel);
    },
    [completeQuiz, newQuestion, currentLevel]
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
    return <Leaderboard onClose={() => setShowLeaderboard(false)} />;
  }

  if (showBonus) {
    return (
      <BonusTab level={currentLevel} mode={mode} onEarnLives={addLives} onClose={() => setShowBonus(false)} />
    );
  }

  if (phase === "home") {
    return (
      <HomeScreen
        onStart={startGame}
        mode={mode}
        onModeChange={changeMode}
        currentLevel={currentLevel}
        onRestart={restartGame}
        onBonus={() => setShowBonus(true)}
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
              <QuizGate
                question={currentQuestion}
                onAnswer={handleQuizAnswer}
                score={score}
                onSpendHint={handleSpendHint}
                autoRead={mode === "petits"}
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
