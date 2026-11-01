// Progression du « Défi de la Parole » sur cet appareil, pour chaque catégorie d'âge : plus on réussit
// de défis, plus les questions sont difficiles. Les questions déjà posées sont évitées tant qu'il en
// reste de nouvelles.

import type { ModeAge } from "@/lib/gameData";
import { signalerChangementJeux } from "@/lib/jeux";

const clePalier = (mode: ModeAge) => `memory-bible-defi-palier-${mode}`;
const cleVues = (mode: ModeAge) => `memory-bible-defi-vues-${mode}`;

function lire<T>(cle: string, defaut: T): T {
  try {
    const brut = localStorage.getItem(cle);
    return brut ? (JSON.parse(brut) as T) : defaut;
  } catch {
    return defaut;
  }
}

function ecrire(cle: string, valeur: unknown): void {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    // stockage indisponible : la progression du défi n'est simplement pas gardée
  }
}

/** Nombre de défis réussis (au moins 2 bonnes réponses sur 3) */
export const lirePalier = (mode: ModeAge): number => lire<number>(clePalier(mode), 0);
export const monterPalier = (mode: ModeAge): void => {
  ecrire(clePalier(mode), lirePalier(mode) + 1);
  signalerChangementJeux();
};
/** Used when the account copy is ahead of this device (no signal: nothing new to send) */
export const ecrirePalier = (mode: ModeAge, palier: number): void => ecrire(clePalier(mode), palier);

export const lireQuestionsVues = (mode: ModeAge): string[] => lire<string[]>(cleVues(mode), []);
const ajouterVues = (mode: ModeAge, questions: string[]): void =>
  ecrire(cleVues(mode), [...new Set([...lireQuestionsVues(mode), ...questions])].slice(-300));
export const noterQuestionsVues = (mode: ModeAge, questions: string[]): void => {
  ajouterVues(mode, questions);
  signalerChangementJeux();
};
/** Merges the questions already seen on another device (no signal) */
export const fusionnerQuestionsVues = (mode: ModeAge, questions: string[]): void => ajouterVues(mode, questions);
