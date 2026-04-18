import { useState, useCallback } from "react";
import { getLevelConfig, QUIZ_QUESTIONS, shuffleArray } from "@/lib/gameData";

export interface GameState {
  lives: number;
  currentLevel: number;
  score: number;
  phase: "home" | "memory" | "enigma" | "quiz" | "levelComplete" | "gameOver";
  levelsCompleted: number;
}

const INITIAL_LIVES = 100;
const HINT_COST = 3;

export function useGameState(initialState?: Partial<GameState>) {
  const [gameState, setGameState] = useState<GameState>({
    lives: initialState?.lives ?? INITIAL_LIVES,
    currentLevel: initialState?.currentLevel ?? 1,
    score: initialState?.score ?? 0,
    phase: "home",
    levelsCompleted: initialState?.levelsCompleted ?? 0,
  });

  const startGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, phase: "memory" }));
  }, []);

  /** Go back to home without resetting progress */
  const goHome = useCallback(() => {
    setGameState((prev) => ({ ...prev, phase: "home" }));
  }, []);

  /** Full reset to level 1 */
  const restartGame = useCallback(() => {
    setGameState({
      lives: INITIAL_LIVES,
      currentLevel: 1,
      score: 0,
      phase: "home",
      levelsCompleted: 0,
    });
  }, []);

  /** After game over: keep score, restart at same level with fresh lives */
  const continueAfterGameOver = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      lives: INITIAL_LIVES,
      phase: "memory",
    }));
  }, []);

  const loadSavedState = useCallback((saved: Partial<GameState>) => {
    setGameState((prev) => ({
      ...prev,
      lives: saved.lives ?? prev.lives,
      currentLevel: saved.currentLevel ?? prev.currentLevel,
      score: saved.score ?? prev.score,
      levelsCompleted: saved.levelsCompleted ?? prev.levelsCompleted,
    }));
  }, []);

  const loseLives = useCallback((amount: number) => {
    setGameState((prev) => {
      const newLives = Math.max(0, prev.lives - amount);
      if (newLives === 0) {
        return { ...prev, lives: 0, phase: "gameOver" };
      }
      return { ...prev, lives: newLives };
    });
  }, []);

  /** Spend HINT_COST points to get a hint. Returns true if affordable. */
  const useHint = useCallback((): boolean => {
    let success = false;
    setGameState((prev) => {
      if (prev.score >= HINT_COST) {
        success = true;
        return { ...prev, score: prev.score - HINT_COST };
      }
      return prev;
    });
    return success;
  }, []);

  /** Add lives (e.g. from watching ads) */
  const addLives = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, lives: prev.lives + amount }));
  }, []);

  /** Add score points (e.g. from watching ads) */
  const addScore = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, score: prev.score + amount }));
  }, []);

  /** Skip current level (advance without completing) */
  const skipLevel = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      phase: "memory",
    }));
  }, []);

  const completeMemory = useCallback((bonusScore: number) => {
    setGameState((prev) => {
      const config = getLevelConfig(prev.currentLevel);
      if (config.hasEnigma) {
        return { ...prev, score: prev.score + bonusScore, phase: "enigma" };
      }
      return { ...prev, score: prev.score + bonusScore, phase: "quiz" };
    });
  }, []);

  const completeEnigma = useCallback((bonusScore: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + bonusScore,
      phase: "quiz",
    }));
  }, []);

  const completeQuiz = useCallback((correct: boolean) => {
    setGameState((prev) => {
      if (!correct) {
        const newLives = Math.max(0, prev.lives - 1);
        if (newLives === 0) return { ...prev, lives: 0, phase: "gameOver" };
        return { ...prev, lives: newLives };
      }
      return {
        ...prev,
        score: prev.score + 50,
        phase: "levelComplete",
        levelsCompleted: prev.levelsCompleted + 1,
      };
    });
  }, []);

  const nextLevel = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      phase: "memory",
    }));
  }, []);

  const getRandomQuestion = useCallback(() => {
    const shuffled = shuffleArray(QUIZ_QUESTIONS);
    return shuffled[0];
  }, []);

  return {
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
  };
}
