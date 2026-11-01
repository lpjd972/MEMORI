// Progression de chaque catégorie d'âge (Petits, Enfants, Ados & adultes), séparée : sur un même
// compte ou un même appareil, la petite, le grand et maman ont chacun leur niveau (demande de JD
// du 30/10/2026). Sans compte, elle est gardée sur l'appareil ; avec un compte, dans Supabase.

import type { ModeAge } from "@/lib/gameData";

export interface Progression {
  lives: number;
  currentLevel: number;
  score: number;
  levelsCompleted: number;
}

const cle = (mode: ModeAge) => `memory-bible-progression-${mode}`;

export function lireProgressionLocale(mode: ModeAge): Progression | null {
  try {
    const brut = localStorage.getItem(cle(mode));
    if (!brut) return null;
    const p = JSON.parse(brut) as Partial<Progression>;
    if (typeof p.currentLevel !== "number") return null;
    return {
      lives: p.lives ?? 100,
      currentLevel: p.currentLevel,
      score: p.score ?? 0,
      levelsCompleted: p.levelsCompleted ?? 0,
    };
  } catch {
    return null;
  }
}

export function ecrireProgressionLocale(mode: ModeAge, p: Progression): void {
  try {
    const { lives, currentLevel, score, levelsCompleted } = p;
    localStorage.setItem(cle(mode), JSON.stringify({ lives, currentLevel, score, levelsCompleted }));
  } catch {
    // stockage indisponible : la progression n'est simplement pas gardée sur cet appareil
  }
}
