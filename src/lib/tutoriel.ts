// Le petit guide de l'accueil : montré à la première visite, puis seulement si la personne
// le laisse « affiché » (interrupteur sur l'accueil). Réglage gardé sur l'appareil.

const CLE = "memory-bible-guide";

/** true = the guide opens by itself when the game starts (default for a first visit) */
export function lireGuideAuto(): boolean {
  try {
    return localStorage.getItem(CLE) !== "masque";
  } catch {
    return false;
  }
}

export function ecrireGuideAuto(affiche: boolean): void {
  try {
    localStorage.setItem(CLE, affiche ? "affiche" : "masque");
  } catch {
    // stockage indisponible : le réglage n'est pas gardé
  }
}

/** First visit: the setting was never chosen */
export function premiereVisite(): boolean {
  try {
    return localStorage.getItem(CLE) === null;
  } catch {
    return false;
  }
}

export interface EtapeGuide {
  /** value of the data-tuto attribute of the element to highlight (none = centred card) */
  cible?: string;
  titre: string;
  texte: string;
}
