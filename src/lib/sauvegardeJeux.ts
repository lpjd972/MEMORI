// Niveaux des autres jeux et progression du Défi de la Parole, pour une catégorie d'âge, dans le format
// gardé avec le compte (colonne `jeux` de game_progress). Sur un nouvel appareil, on garde le plus
// avancé des deux : celui de l'appareil ou celui du compte (demande de JD du 01/11/2026 : « tout retrouver »).

import type { ModeAge } from "@/lib/gameData";
import { ecrireNiveauJeu, lireNiveauJeu, type Jeu } from "@/lib/jeux";
import { ecrirePalier, fusionnerQuestionsVues, lirePalier, lireQuestionsVues } from "@/lib/defi";

export interface JeuxSauves {
  "mots-meles"?: number;
  versets?: number;
  labyrinthe?: number;
  "defi-palier"?: number;
  "defi-vues"?: string[];
}

const JEUX: Jeu[] = ["mots-meles", "versets", "labyrinthe"];

/** What this device holds for the category */
export function lireJeuxLocaux(mode: ModeAge): JeuxSauves {
  const jeux: JeuxSauves = {};
  for (const jeu of JEUX) jeux[jeu] = lireNiveauJeu(jeu, mode);
  jeux["defi-palier"] = lirePalier(mode);
  jeux["defi-vues"] = lireQuestionsVues(mode);
  return jeux;
}

const nombre = (x: unknown): number => (typeof x === "number" && Number.isFinite(x) ? Math.floor(x) : 0);

/** Brings the account copy into this device, keeping the most advanced level of each game */
export function fusionnerJeux(mode: ModeAge, compte: unknown): void {
  if (!compte || typeof compte !== "object") return;
  const c = compte as Record<string, unknown>;
  for (const jeu of JEUX) {
    const n = nombre(c[jeu]);
    if (n > lireNiveauJeu(jeu, mode)) ecrireNiveauJeu(jeu, mode, n);
  }
  const palier = nombre(c["defi-palier"]);
  if (palier > lirePalier(mode)) ecrirePalier(mode, palier);
  const vues = c["defi-vues"];
  if (Array.isArray(vues)) fusionnerQuestionsVues(mode, vues.filter((v): v is string => typeof v === "string"));
}
