import { HISTOIRES, type Histoire } from "@/lib/bible/histoires";
import { MOTS_MELES } from "@/lib/bible/motsMeles";
import { shuffleArray, type ModeAge } from "@/lib/gameData";

/** « Chérubins » → « CHERUBINS » : la grille n'a ni accents ni espaces */
export function normaliser(mot: string): string {
  return mot
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export interface MotCache {
  mot: string;
  cle: string;
  reference: string;
  /** cells from first to last letter */
  cases: [number, number][];
  /** a word from another story, placed to test attention: not in the list */
  piege: boolean;
  /** for a trap word: the story it really belongs to */
  histoire?: Histoire;
}

export interface GrilleMotsMeles {
  taille: number;
  lettres: string[][];
  mots: MotCache[];
  histoire: Histoire;
  tour: number;
}

type Direction = [number, number];
const DROITE: Direction = [0, 1];
const BAS: Direction = [1, 0];
const DIAGONALES: Direction[] = [[1, 1], [-1, 1]];
const INVERSES: Direction[] = [[0, -1], [-1, 0], [-1, -1], [1, -1]];

interface Reglage {
  taille: number;
  nbMots: number;
  pieges: number;
  directions: Direction[];
}

/** Petits : petite grille, mots de gauche à droite · Enfants : + de haut en bas · Grands : 8 directions */
export function reglageMotsMeles(level: number, mode: ModeAge): Reglage {
  const n = level - 1;
  if (mode === "petits") {
    return { taille: 6, nbMots: Math.min(3 + Math.floor(n / 4), 4), pieges: 0, directions: [DROITE] };
  }
  if (mode === "enfants") {
    return {
      taille: n < 10 ? 8 : 9,
      nbMots: Math.min(5 + Math.floor(n / 4), 8),
      pieges: n < 3 ? 0 : 1,
      directions: n < 6 ? [DROITE, BAS] : [DROITE, BAS, DIAGONALES[0]],
    };
  }
  return {
    taille: n < 8 ? 10 : 12,
    nbMots: Math.min(7 + Math.floor(n / 3), 12),
    pieges: n < 2 ? 1 : 2,
    directions: n < 4 ? [DROITE, BAS, ...DIAGONALES] : [DROITE, BAS, ...DIAGONALES, ...INVERSES],
  };
}

const ALPHABET = "ABCDEFGHIJKLMNOPRSTUVE";

function placer(grille: string[][], cle: string, directions: Direction[]): [number, number][] | null {
  const taille = grille.length;
  for (let essai = 0; essai < 200; essai++) {
    const [dl, dc] = directions[Math.floor(Math.random() * directions.length)];
    const l0 = Math.floor(Math.random() * taille);
    const c0 = Math.floor(Math.random() * taille);
    const lFin = l0 + dl * (cle.length - 1);
    const cFin = c0 + dc * (cle.length - 1);
    if (lFin < 0 || lFin >= taille || cFin < 0 || cFin >= taille) continue;
    const cases: [number, number][] = [];
    let ok = true;
    for (let i = 0; i < cle.length; i++) {
      const l = l0 + dl * i;
      const c = c0 + dc * i;
      if (grille[l][c] !== "" && grille[l][c] !== cle[i]) {
        ok = false;
        break;
      }
      cases.push([l, c]);
    }
    if (!ok) continue;
    cases.forEach(([l, c], i) => (grille[l][c] = cle[i]));
    return cases;
  }
  return null;
}

/** La grille d'un niveau : les mots de l'histoire du niveau, et des « pièges » venus d'autres histoires. */
export function creerGrille(level: number, mode: ModeAge): GrilleMotsMeles {
  const index = (level - 1) % HISTOIRES.length;
  const tour = Math.floor((level - 1) / HISTOIRES.length) + 1;
  const histoire = HISTOIRES[index];
  const reglage = reglageMotsMeles(level, mode);
  const taille = reglage.taille + (tour > 1 && mode !== "petits" ? 1 : 0);

  const propres = MOTS_MELES[histoire.id] ?? [];
  const clesPropres = new Set(propres.map(([m]) => normaliser(m)));
  const candidats = shuffleArray(propres)
    .map(([mot, reference]) => ({ mot, reference, cle: normaliser(mot) }))
    .filter((m) => m.cle.length >= 3 && m.cle.length <= taille && (mode !== "petits" || m.cle.length <= 6));
  const pieges = shuffleArray(
    HISTOIRES.filter((h) => h.id !== histoire.id).flatMap((h) =>
      (MOTS_MELES[h.id] ?? []).map(([mot, reference]) => ({ mot, reference, cle: normaliser(mot), histoire: h }))
    )
  ).filter((m) => m.cle.length >= 4 && m.cle.length <= taille && !clesPropres.has(m.cle));

  for (let essai = 0; essai < 30; essai++) {
    const grille = Array.from({ length: taille }, () => Array<string>(taille).fill(""));
    const mots: MotCache[] = [];
    // longest words first: they are the hardest to fit
    const voulus = candidats.slice(0, reglage.nbMots).sort((a, b) => b.cle.length - a.cle.length);
    let ok = true;
    for (const m of voulus) {
      const cases = placer(grille, m.cle, reglage.directions);
      if (!cases) {
        ok = false;
        break;
      }
      mots.push({ ...m, cases, piege: false });
    }
    if (!ok) continue;
    for (const p of pieges.slice(0, reglage.pieges * 3)) {
      if (mots.filter((m) => m.piege).length >= reglage.pieges) break;
      const cases = placer(grille, p.cle, reglage.directions);
      if (cases) mots.push({ ...p, cases, piege: true });
    }
    const lettres = grille.map((ligne) =>
      ligne.map((x) => x || ALPHABET[Math.floor(Math.random() * ALPHABET.length)])
    );
    return { taille, lettres, mots, histoire, tour };
  }
  throw new Error(`Grille impossible pour ${histoire.id}`);
}

/** The cells between two taps, if they form a straight line (row, column or diagonal) */
export function ligneEntre(a: [number, number], b: [number, number]): [number, number][] | null {
  const dl = Math.sign(b[0] - a[0]);
  const dc = Math.sign(b[1] - a[1]);
  const long = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
  if (Math.abs(b[0] - a[0]) !== 0 && Math.abs(b[1] - a[1]) !== 0 && Math.abs(b[0] - a[0]) !== Math.abs(b[1] - a[1])) {
    return null;
  }
  return Array.from({ length: long + 1 }, (_, i) => [a[0] + dl * i, a[1] + dc * i] as [number, number]);
}

/** Letters read along the selected cells */
export function lettresDe(grille: GrilleMotsMeles, cases: [number, number][]): string {
  return cases.map(([l, c]) => grille.lettres[l][c]).join("");
}

/**
 * The word whose LETTERS match the selection (either direction), wherever it is in the grid:
 * a word can appear twice by chance, and both copies must count.
 * Words still to find come first, then traps, then words already found.
 */
export function motLu(grille: GrilleMotsMeles, cases: [number, number][], dejaTrouves: string[]): MotCache | undefined {
  const s = lettresDe(grille, cases);
  const r = [...s].reverse().join("");
  const correspond = (m: MotCache) => m.cle === s || m.cle === r;
  return (
    grille.mots.find((m) => !m.piege && !dejaTrouves.includes(m.cle) && correspond(m)) ??
    grille.mots.find((m) => m.piege && correspond(m)) ??
    grille.mots.find((m) => correspond(m))
  );
}

/** The word (from the list or a trap) whose cells match the selection, in either direction */
export function motSelectionne(grille: GrilleMotsMeles, cases: [number, number][]): MotCache | undefined {
  const cle = cases.map(([l, c]) => `${l},${c}`).join("|");
  const inverse = [...cases].reverse().map(([l, c]) => `${l},${c}`).join("|");
  return grille.mots.find((m) => {
    const k = m.cases.map(([l, c]) => `${l},${c}`).join("|");
    return k === cle || k === inverse;
  });
}
