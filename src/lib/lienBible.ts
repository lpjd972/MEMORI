// Liens vers la Bible en ligne (application gratuite « Bible » de YouVersion, bible.com), pour que
// le joueur aille lire le passage où se trouve la réponse. Memory Bible n'est pas lié à YouVersion :
// ce sont de simples liens. Version 93 = Louis Segond 1910 (LSG) sur bible.com.

const VERSION_LSG = 93;

export const BIBLE_APP = {
  nom: "Bible (YouVersion)",
  playStore: "https://play.google.com/store/apps/details?id=com.sirma.mobile.bible.android",
  appStore: "https://apps.apple.com/app/id282935706",
};

// Noms des livres en français (Louis Segond) → codes utilisés par bible.com
const LIVRES: Record<string, string> = {
  "Genèse": "GEN", "Exode": "EXO", "Lévitique": "LEV", "Nombres": "NUM", "Deutéronome": "DEU",
  "Josué": "JOS", "Juges": "JDG", "Ruth": "RUT", "1 Samuel": "1SA", "2 Samuel": "2SA",
  "1 Rois": "1KI", "2 Rois": "2KI", "1 Chroniques": "1CH", "2 Chroniques": "2CH", "Esdras": "EZR",
  "Néhémie": "NEH", "Esther": "EST", "Job": "JOB", "Psaume": "PSA", "Psaumes": "PSA", "Proverbes": "PRO",
  "Ecclésiaste": "ECC", "Ésaïe": "ISA", "Jérémie": "JER", "Ézéchiel": "EZK", "Daniel": "DAN",
  "Joël": "JOL", "Jonas": "JON", "Matthieu": "MAT", "Marc": "MRK", "Luc": "LUK", "Jean": "JHN",
  "Actes": "ACT", "Romains": "ROM", "1 Corinthiens": "1CO", "2 Corinthiens": "2CO", "Galates": "GAL",
  "Éphésiens": "EPH", "Philippiens": "PHP", "1 Thessaloniciens": "1TH", "1 Timothée": "1TI",
  "2 Timothée": "2TI", "Hébreux": "HEB", "Jacques": "JAS", "1 Pierre": "1PE", "1 Jean": "1JN",
  "Apocalypse": "REV",
};

export interface Passage {
  /** « Genèse 41 » : le chapitre entier, à relire */
  chapitre: string;
  url: string;
}

/** « Genèse 41:26 » ou « Exode 7 – 12 ; 14 » → le premier chapitre cité et son lien bible.com. */
export function passageAlire(reference: string): Passage | null {
  const premier = reference.split(/[;(]/)[0].trim();
  const m = premier.match(/^((?:[123] )?[A-Za-zÀ-ÿ]+)\s+(\d+)/);
  if (!m) return null;
  const [, livre, chapitre] = m;
  const code = LIVRES[livre];
  if (!code) return null;
  return {
    chapitre: `${livre} ${chapitre}`,
    url: `https://www.bible.com/bible/${VERSION_LSG}/${code}.${chapitre}.LSG`,
  };
}
