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
  titre: string;
  chaine: string;
  youtubeId: string;
  debut?: number;
}

export const LOUANGES: Louange[] = [
  // { titre: "Comment ne pas te louer", chaine: "Nom de la chaîne", youtubeId: "XXXXXXXXXXX", debut: 0 },
];

export const DUREE_EXTRAIT = 30;

/** Vies gagnées après 30 secondes de méditation d'un psaume (pas pour un chant YouTube : règle de YouTube). */
export const VIES_PAUSE_PSAUME = 9;
