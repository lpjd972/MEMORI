import { VERSETS, decouper, type VersetATrous } from "@/lib/bible/versets";
import { shuffleArray, type ModeAge } from "@/lib/gameData";

export interface PuzzleVerset {
  verset: VersetATrous;
  /** text pieces; `trou` is the index of the blank (0, 1, 2…) or -1 for plain text */
  morceaux: { texte: string; trou: number }[];
  /** the right word for each blank, in order */
  reponses: string[];
  /** words to choose from: the right ones plus traps, shuffled */
  banque: string[];
  tour: number;
}

/** Enfants : 1 trou puis 2 · Ados & adultes : de 2 trous jusqu'à tous, avec plus de mots-pièges */
export function reglageVersets(level: number, mode: ModeAge) {
  const n = level - 1;
  if (mode === "enfants") return { trous: n < 15 ? 1 : 2, pieges: 2 };
  return { trous: 2 + Math.floor(n / 8), pieges: Math.min(3 + Math.floor(n / 10), 6) };
}

export function creerPuzzle(level: number, mode: ModeAge): PuzzleVerset {
  const index = (level - 1) % VERSETS.length;
  const tour = Math.floor((level - 1) / VERSETS.length) + 1;
  const verset = VERSETS[index];
  const segments = decouper(verset.texte);
  const possibles = segments.map((s, i) => (s.trou ? i : -1)).filter((i) => i >= 0);
  const reglage = reglageVersets(level, mode);
  const nbTrous = Math.min(reglage.trous + (tour > 1 ? 1 : 0), possibles.length);
  const choisis = new Set(shuffleArray(possibles).slice(0, nbTrous));

  const reponses: string[] = [];
  const morceaux: PuzzleVerset["morceaux"] = [];
  segments.forEach((s, i) => {
    if (choisis.has(i)) {
      morceaux.push({ texte: s.texte, trou: reponses.length });
      reponses.push(s.texte);
    } else {
      const precedent = morceaux[morceaux.length - 1];
      if (precedent && precedent.trou === -1) precedent.texte += s.texte;
      else morceaux.push({ texte: s.texte, trou: -1 });
    }
  });

  const minuscules = new Set(reponses.map((r) => r.toLowerCase()));
  const pieges = shuffleArray(
    [...new Set(VERSETS.flatMap((v) => decouper(v.texte).filter((s) => s.trou).map((s) => s.texte)))]
  ).filter((m) => !minuscules.has(m.toLowerCase()));
  const banque = shuffleArray([...reponses, ...pieges.slice(0, reglage.pieges)]);
  return { verset, morceaux, reponses, banque, tour };
}
