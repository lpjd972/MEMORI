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

// Première liste de JD (30/10/2026), 25 chants. Début de chaque extrait sur le refrain (ou un couplet) :
// temps relevés par JD le 02/11/2026 (idée d'un membre de sa famille : « tomber directement dans le champ »).
export const LOUANGES: Louange[] = [
  { youtubeId: "DxkfmLpuloI", debut: 12 }, // 1. refrain à 0:12
  { youtubeId: "LT3HwQAjgKs", debut: 61 }, // 2. refrain à 1:01
  { youtubeId: "JLT3VKp01Xc", debut: 132 }, // 3. refrain à 2:12
  { youtubeId: "_ozQfbgcbBg", debut: 95 }, // 4. refrain à 1:35
  { youtubeId: "JL9ikMmRNW8", debut: 45 }, // 5. refrain à 0:45
  { youtubeId: "KXbKHIpmhXY", debut: 17 }, // 6. refrain à 0:17
  { youtubeId: "i6YtHZEV0GU", debut: 81 }, // 7. refrain à 1:21
  { youtubeId: "kNTw0-jpUnQ", debut: 157 }, // 8. refrain à 2:37
  { youtubeId: "1ieckehNEO8", debut: 32 }, // 9. refrain à 0:32
  { youtubeId: "dn9pdpSvBm0", debut: 106 }, // 10. refrain à 1:46
  { youtubeId: "iRgevquZQfk", debut: 11 }, // 11. refrain à 0:11
  { youtubeId: "aEboHH22kSA", debut: 12 }, // 12. refrain à 0:12
  { youtubeId: "Xf8JMhOwE2A", debut: 17 }, // 13. refrain à 0:17
  { youtubeId: "2tAFUL0HfrQ", debut: 25 }, // 14. refrain à 0:25
  { youtubeId: "vKyurZv9vE8", debut: 53 }, // 15. refrain à 0:53
  { youtubeId: "SHI5fqr3tYg", debut: 29 }, // 16. refrain à 0:29
  { youtubeId: "Lo6EE-ymUUU", debut: 99 }, // 17. refrain à 1:39
  { youtubeId: "HX2LogUtToI", debut: 42 }, // 18. refrain à 0:42
  { youtubeId: "gYNCeKY5Pmw", debut: 12 }, // 19. refrain à 0:12
  { youtubeId: "KhQMHEUjFAA", debut: 15 }, // 20. refrain à 0:15
  { youtubeId: "pR2yEnMpYmE", debut: 42 }, // 21. refrain à 0:42
  { youtubeId: "fHsiA74lgyg", debut: 29 }, // 22. refrain à 0:29
  { youtubeId: "G01_AsaRIxo", debut: 2 }, // 23. refrain à 0:02
  { youtubeId: "1zh1wePLsHo", debut: 34 }, // 24. refrain à 0:34
  { youtubeId: "OjiWQVKX7WI", debut: 3 }, // 25. refrain à 0:03
];

export const DUREE_EXTRAIT = 30;

/** Le site de JD, présenté une pause louange sur deux (demande de JD du 30/10/2026) */
export const VIE_DE_LOUANGE = {
  nom: "Vie de Louange",
  url: "https://vie-de-louange.web.app",
  accroche: "Un site pour rendre gloire à Dieu : louange, témoignage et partage.",
};

/**
 * Pour les 3-6 ans, pas de vidéo YouTube : on présente l'appli gratuite « Bible App pour les enfants »
 * (YouVersion et OneHope), avec ses autres jeux. Simple lien vers son site officiel, sans partenariat.
 */
export const BIBLE_APP_ENFANTS = {
  nom: "La Bible App pour les enfants",
  url: "https://bibleappforkids.com",
  accroche: "Une appli gratuite pour découvrir les histoires de la Bible, à faire avec un parent.",
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
