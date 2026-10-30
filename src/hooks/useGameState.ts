import { useState, useCallback } from "react";
import type { Progression } from "@/lib/progression";

export interface GameState {
  lives: number;
  currentLevel: number;
  score: number;
  phase: "home" | "memory" | "quiz" | "levelComplete" | "gameOver";
  levelsCompleted: number;
}

export const INITIAL_LIVES = 100;
export const HINT_COST = 3;
export const QUIZ_BONUS = 50;

export function useGameState(initialState?: Partial<GameState>) {
  const [gameState, setGameState] = useState<GameState>({
    lives: initialState?.lives ?? INITIAL_LIVES,
    currentLevel: initialState?.currentLevel ?? 1,
    score: initialState?.score ?? 0,
    phase: "home",
    levelsCompleted: initialState?.levelsCompleted ?? 0,
  });

  const startGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, lives: prev.lives > 0 ? prev.lives : INITIAL_LIVES, phase: "memory" }));
  }, []);

  /** Back to the menu without losing progress (lives are refilled after a game over) */
  const goHome = useCallback(() => {
    setGameState((prev) => ({ ...prev, lives: prev.lives > 0 ? prev.lives : INITIAL_LIVES, phase: "home" }));
  }, []);

  /** Full reset: back to Genesis */
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

  /** Switch to another player's progress (age category), or a fresh start when there is none */
  const replaceProgress = useCallback((saved: Progression | null) => {
    setGameState({
      lives: saved && saved.lives > 0 ? saved.lives : INITIAL_LIVES,
      currentLevel: saved?.currentLevel ?? 1,
      score: saved?.score ?? 0,
      phase: "home",
      levelsCompleted: saved?.levelsCompleted ?? 0,
    });
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

  /** Spend points (e.g. a hint). The caller checks the score first. */
  const spendScore = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, score: Math.max(0, prev.score - amount) }));
  }, []);

  /** Add lives (e.g. from the Bible challenge) */
  const addLives = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, lives: prev.lives + amount }));
  }, []);

  const completeMemory = useCallback((bonusScore: number) => {
    setGameState((prev) => ({ ...prev, score: prev.score + bonusScore, phase: "quiz" }));
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
        score: prev.score + QUIZ_BONUS,
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

  return {
    gameState,
    startGame,
    goHome,
    restartGame,
    continueAfterGameOver,
    replaceProgress,
    loseLives,
    spendScore,
    addLives,
    completeMemory,
    completeQuiz,
    nextLevel,
  };
}
