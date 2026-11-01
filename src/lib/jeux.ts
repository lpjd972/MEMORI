// Niveau atteint dans les autres jeux (mots mêlés, versets à trous, labyrinthe), pour chaque
// catégorie d'âge, gardé sur l'appareil.

import type { ModeAge } from "@/lib/gameData";

export type Jeu = "mots-meles" | "versets" | "labyrinthe";

const cle = (jeu: Jeu, mode: ModeAge) => `memory-bible-${jeu}-${mode}`;

export function lireNiveauJeu(jeu: Jeu, mode: ModeAge): number {
  try {
    const n = Number(localStorage.getItem(cle(jeu, mode)));
    return Number.isFinite(n) && n >= 1 ? n : 1;
  } catch {
    return 1;
  }
}

export function ecrireNiveauJeu(jeu: Jeu, mode: ModeAge, niveau: number): void {
  try {
    localStorage.setItem(cle(jeu, mode), String(niveau));
  } catch {
    // stockage indisponible : le niveau n'est simplement pas gardé
  }
}

/** Stars needed for a hint, or exchanged for lives (3 stars = 3 hearts) */
export const PRIX_INDICE = 3;
