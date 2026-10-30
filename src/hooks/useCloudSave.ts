import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ModeAge } from "@/lib/gameData";
import type { Progression } from "@/lib/progression";

/** Progress and scores are stored per age category, so one family account can hold three players. */
export function useCloudSave(userId: string | undefined) {
  const saveProgress = useCallback(
    async (state: Progression, mode: ModeAge) => {
      if (!userId) return;
      await supabase.from("game_progress").upsert(
        {
          user_id: userId,
          mode,
          current_level: state.currentLevel,
          lives: state.lives,
          current_score: state.score,
          levels_completed: state.levelsCompleted,
          last_saved_at: new Date().toISOString(),
        },
        { onConflict: "user_id,mode" }
      );
    },
    [userId]
  );

  const loadProgress = useCallback(
    async (mode: ModeAge): Promise<Progression | null> => {
      if (!userId) return null;
      const { data } = await supabase
        .from("game_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("mode", mode)
        .maybeSingle();
      if (!data) return null;
      return {
        lives: data.lives,
        currentLevel: data.current_level,
        score: data.current_score,
        levelsCompleted: data.levels_completed,
      };
    },
    [userId]
  );

  /** Current level of each category, to show it on the "Qui joue ?" buttons */
  const loadLevels = useCallback(async (): Promise<Partial<Record<ModeAge, number>>> => {
    if (!userId) return {};
    const { data } = await supabase.from("game_progress").select("mode, current_level").eq("user_id", userId);
    const levels: Partial<Record<ModeAge, number>> = {};
    for (const row of data ?? []) levels[row.mode as ModeAge] = row.current_level;
    return levels;
  }, [userId]);

  const saveScore = useCallback(
    async (score: number, levelReached: number, mode: ModeAge) => {
      if (!userId) return;
      await supabase.from("game_scores").insert({
        user_id: userId,
        score,
        level_reached: levelReached,
        mode,
      });
    },
    [userId]
  );

  const getLeaderboard = useCallback(async (mode: ModeAge) => {
    const { data } = await supabase
      .from("game_scores")
      .select("score, level_reached, created_at, user_id, profiles(display_name)")
      .eq("mode", mode)
      .order("score", { ascending: false })
      .limit(20);
    return data ?? [];
  }, []);

  return { saveProgress, loadProgress, loadLevels, saveScore, getLeaderboard };
}
