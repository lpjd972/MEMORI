import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { GameState } from "./useGameState";

export function useCloudSave(userId: string | undefined) {
  const saveProgress = useCallback(
    async (state: GameState) => {
      if (!userId) return;
      await supabase.from("game_progress").upsert({
        user_id: userId,
        current_level: state.currentLevel,
        lives: state.lives,
        current_score: state.score,
        levels_completed: state.levelsCompleted,
        last_saved_at: new Date().toISOString(),
      });
    },
    [userId]
  );

  const loadProgress = useCallback(async (): Promise<GameState | null> => {
    if (!userId) return null;
    const { data } = await supabase
      .from("game_progress")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (!data) return null;
    return {
      lives: data.lives,
      currentLevel: data.current_level,
      score: data.current_score,
      phase: "home",
      levelsCompleted: data.levels_completed,
    };
  }, [userId]);

  const saveScore = useCallback(
    async (score: number, levelReached: number) => {
      if (!userId) return;
      await supabase.from("game_scores").insert({
        user_id: userId,
        score,
        level_reached: levelReached,
      });
    },
    [userId]
  );

  const getLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("game_scores")
      .select("score, level_reached, created_at, user_id, profiles(display_name)")
      .order("score", { ascending: false })
      .limit(20);
    return data ?? [];
  }, []);

  return { saveProgress, loadProgress, saveScore, getLeaderboard };
}
