import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeScreen from "@/components/HomeScreen";
import AuthScreen from "@/components/AuthScreen";
import MemoryBoard from "@/components/MemoryBoard";
import LivesDisplay from "@/components/LivesDisplay";
import QuizGate from "@/components/QuizGate";
import LevelComplete from "@/components/LevelComplete";
import GameOver from "@/components/GameOver";
import EnigmaLevel from "@/components/EnigmaLevel";
import Leaderboard from "@/components/Leaderboard";
import PubsTab from "@/components/PubsTab";
import { useGameState } from "@/hooks/useGameState";
import { useAuth } from "@/hooks/useAuth";
import { useCloudSave } from "@/hooks/useCloudSave";

const Index = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPubs, setShowPubs] = useState(false);

  const {
    gameState,
    startGame,
    goHome,
    restartGame,
    continueAfterGameOver,
    loadSavedState,
    loseLives,
    useHint,
    addLives,
    addScore,
    skipLevel,
    completeMemory,
    completeEnigma,
    completeQuiz,
    nextLevel,
    getRandomQuestion,
  } = useGameState();

  const { saveProgress, loadProgress, saveScore } = useCloudSave(user?.id);

  const [currentQuestion, setCurrentQuestion] = useState(() => getRandomQuestion());

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
    if (user && gameState.phase !== "home" && gameState.phase !== "gameOver") {
      saveProgress(gameState);
    }
  }, [user, gameState, saveProgress]);

  // Save score on game over
  useEffect(() => {
    if (user && gameState.phase === "gameOver") {
      saveScore(gameState.score, gameState.currentLevel);
    }
  }, [user, gameState.phase, gameState.score, gameState.currentLevel, saveScore]);

  const handleMemoryComplete = useCallback(
    (score: number) => {
      setCurrentQuestion(getRandomQuestion());
      completeMemory(score);
    },
    [completeMemory, getRandomQuestion]
  );

  const handleQuizAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        completeQuiz(true);
      } else {
        completeQuiz(false);
        setTimeout(() => setCurrentQuestion(getRandomQuestion()), 1300);
      }
    },
    [completeQuiz, getRandomQuestion]
  );

  const handleEnigmaComplete = useCallback(
    (bonusScore: number) => {
      setCurrentQuestion(getRandomQuestion());
      completeEnigma(bonusScore);
    },
    [completeEnigma, getRandomQuestion]
  );

  const handleEnigmaFail = useCallback(
    (livesLost: number) => {
      loseLives(livesLost);
    },
    [loseLives]
  );

  const handleBuyHint = useCallback(() => {
    return useHint();
  }, [useHint]);

  const { phase, lives, currentLevel, score } = gameState;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-5xl" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          🧠
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

  if (showPubs) {
    return (
      <PubsTab
        onEarnLives={(amount) => { addLives(amount); }}
        onEarnHint={() => { addScore(3); }}
        onSkipLevel={() => { skipLevel(); setShowPubs(false); }}
        onClose={() => setShowPubs(false)}
      />
    );
  }

  if (phase === "home") {
    return (
      <HomeScreen
        onStart={startGame}
        user={user}
        profile={profile}
        onAuthClick={() => setShowAuth(true)}
        onSignOut={signOut}
        onLeaderboard={() => setShowLeaderboard(true)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <button
          onClick={goHome}
          className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Menu
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-game-gold">⭐ {score}</span>
          <button
            onClick={() => setShowPubs(true)}
            className="text-xs font-bold bg-accent/20 text-accent px-2 py-1 rounded-lg hover:bg-accent/30 transition-colors"
          >
            📺 PUBS
          </button>
        </div>
        <LivesDisplay lives={lives} />
      </header>

      <main className="flex-1 flex items-center justify-center py-6 px-4">
        <AnimatePresence mode="wait">
          {phase === "memory" && (
            <motion.div
              key={`memory-${currentLevel}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <MemoryBoard
                level={currentLevel}
                onComplete={handleMemoryComplete}
                onError={loseLives}
              />
            </motion.div>
          )}

          {phase === "enigma" && (
            <motion.div
              key={`enigma-${currentLevel}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <div className="text-center mb-4">
                <span className="text-sm font-bold text-accent">🔐 Épreuve Escape Game</span>
              </div>
              <EnigmaLevel
                level={currentLevel}
                onComplete={handleEnigmaComplete}
                onFail={handleEnigmaFail}
              />
              <HintButton score={score} onBuyHint={handleBuyHint} />
            </motion.div>
          )}

          {phase === "quiz" && (
            <motion.div
              key={`quiz-${currentQuestion.question}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <div className="text-center mb-4">
                <span className="text-sm font-bold text-accent">🔓 Question pour débloquer le niveau suivant</span>
              </div>
              <QuizGate question={currentQuestion} onAnswer={handleQuizAnswer} />
              <HintButton score={score} onBuyHint={handleBuyHint} />
            </motion.div>
          )}

          {phase === "levelComplete" && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LevelComplete level={currentLevel} score={score} onNext={nextLevel} />
            </motion.div>
          )}

          {phase === "gameOver" && (
            <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GameOver
                score={score}
                level={currentLevel}
                onContinue={continueAfterGameOver}
                onRestart={restartGame}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

/** Small button to buy a hint with 3 points */
function HintButton({ score, onBuyHint }: { score: number; onBuyHint: () => boolean }) {
  const [bought, setBought] = useState(false);

  const handleClick = () => {
    const success = onBuyHint();
    if (success) setBought(true);
  };

  if (bought) {
    return (
      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-sm font-bold text-primary">💡 Indice activé ! Regarde bien la question.</span>
      </motion.div>
    );
  }

  return (
    <div className="text-center mt-4">
      <button
        onClick={handleClick}
        disabled={score < 3}
        className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        💡 Acheter un indice (3 ⭐)
      </button>
    </div>
  );
}

export default Index;
