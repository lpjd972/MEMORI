// Les chants de la « Pause louange » (30 secondes d'un chant sur YouTube, puis le chant s'arrête).
// Le but : faire découvrir des chaînes de louange. On ne gagne pas d'argent avec.
//
// ⚠ Règle de YouTube : il est interdit de donner une récompense (vies, points…) en échange du
// visionnage d'une vidéo. Le psaume médité 30 secondes rapporte des vies ; le chant YouTube, lui,
// reste libre et sans récompense. Voir docs/2026-10-29_CHECK-UP-et-REFONTE.md.
//
// Pour ajouter un chant : ouvrir la vidéo sur YouTube, copier l'identifiant après « v= » dans
// l'adresse (par exemple https://www.youtube.com/watch?v=XXXXXXXXXXX → "XXXXXXXXXXX"), puis ajouter
// une ligne ci-dessous. `debut` = la seconde où commence l'extrait (0 = début de la vidéo).
// L'idéal est de prévenir la chaîne (ou de lui demander son accord) avant de l'ajouter.

export interface Louange {
  /** Facultatif : sans titre, le lecteur YouTube affiche lui-même le titre et la chaîne */
  titre?: string;
  chaine?: string;
  youtubeId: string;
  debut?: number;
}

// Première liste de JD (30/10/2026), 25 chants.
export const LOUANGES: Louange[] = [
  { youtubeId: "DxkfmLpuloI" },
  { youtubeId: "LT3HwQAjgKs" },
  { youtubeId: "JLT3VKp01Xc" },
  { youtubeId: "_ozQfbgcbBg" },
  { youtubeId: "JL9ikMmRNW8" },
  { youtubeId: "KXbKHIpmhXY" },
  { youtubeId: "i6YtHZEV0GU" },
  { youtubeId: "kNTw0-jpUnQ" },
  { youtubeId: "1ieckehNEO8" },
  { youtubeId: "dn9pdpSvBm0" },
  { youtubeId: "iRgevquZQfk" },
  { youtubeId: "aEboHH22kSA" },
  { youtubeId: "Xf8JMhOwE2A" },
  { youtubeId: "2tAFUL0HfrQ" },
  { youtubeId: "vKyurZv9vE8" },
  { youtubeId: "SHI5fqr3tYg" },
  { youtubeId: "Lo6EE-ymUUU" },
  { youtubeId: "HX2LogUtToI" },
  { youtubeId: "gYNCeKY5Pmw" },
  { youtubeId: "KhQMHEUjFAA" },
  { youtubeId: "pR2yEnMpYmE" },
  { youtubeId: "fHsiA74lgyg" },
  { youtubeId: "G01_AsaRIxo" },
  { youtubeId: "1zh1wePLsHo" },
  { youtubeId: "OjiWQVKX7WI" },
];

export const DUREE_EXTRAIT = 30;

/** Le site de JD, présenté une pause louange sur deux (demande de JD du 30/10/2026) */
export const VIE_DE_LOUANGE = {
  nom: "Vie de Louange",
  url: "https://vie-de-louange.web.app",
  accroche: "Un site pour rendre gloire à Dieu : louange, témoignage et partage.",
};

const CLE_COMPTEUR = "memory-bible-pauses-louange";

/** Une pause louange sur deux présente le site Vie de Louange au lieu d'un chant YouTube. */
export function prochainePauseEstVieDeLouange(): boolean {
  try {
    const n = Number(localStorage.getItem(CLE_COMPTEUR) ?? "0") + 1;
    localStorage.setItem(CLE_COMPTEUR, String(n));
    return n % 2 === 0;
  } catch {
    return Math.random() < 0.5;
  }
}

/** Vies gagnées après 30 secondes de méditation d'un psaume (pas pour un chant YouTube : règle de YouTube). */
export const VIES_PAUSE_PSAUME = 9;
