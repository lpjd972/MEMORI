// Progression du « Défi de la Parole » sur cet appareil : plus on réussit de défis, plus les
// questions sont difficiles. Les questions déjà posées sont évitées tant qu'il en reste de nouvelles.

const CLE_PALIER = "memory-bible-defi-palier";
const CLE_VUES = "memory-bible-defi-vues";

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
export const lirePalier = (): number => lire<number>(CLE_PALIER, 0);
export const monterPalier = (): void => ecrire(CLE_PALIER, lirePalier() + 1);

export const lireQuestionsVues = (): string[] => lire<string[]>(CLE_VUES, []);
export const noterQuestionsVues = (questions: string[]): void =>
  ecrire(CLE_VUES, [...new Set([...lireQuestionsVues(), ...questions])].slice(-300));
export const oublierQuestionsVues = (): void => ecrire(CLE_VUES, []);
