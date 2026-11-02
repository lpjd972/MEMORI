// Le labyrinthe des petits : rejoindre Jésus (« Laissez venir à moi les petits enfants »).
// Chaque case garde ses murs ; le labyrinthe est « parfait » : un seul chemin mène à l'arrivée.

export interface Case {
  haut: boolean;
  droite: boolean;
  bas: boolean;
  gauche: boolean;
}

export function tailleLabyrinthe(niveau: number): number {
  return Math.min(4 + Math.floor((niveau - 1) / 2), 8);
}

export function creerLabyrinthe(taille: number): Case[][] {
  const cases: Case[][] = Array.from({ length: taille }, () =>
    Array.from({ length: taille }, () => ({ haut: true, droite: true, bas: true, gauche: true }))
  );
  const vu = Array.from({ length: taille }, () => Array<boolean>(taille).fill(false));
  const pile: [number, number][] = [[0, 0]];
  vu[0][0] = true;
  while (pile.length) {
    const [l, c] = pile[pile.length - 1];
    const voisins = (
      [
        [l - 1, c, "haut", "bas"],
        [l + 1, c, "bas", "haut"],
        [l, c - 1, "gauche", "droite"],
        [l, c + 1, "droite", "gauche"],
      ] as const
    ).filter(([vl, vc]) => vl >= 0 && vl < taille && vc >= 0 && vc < taille && !vu[vl][vc]);
    if (!voisins.length) {
      pile.pop();
      continue;
    }
    const [vl, vc, mur, murOppose] = voisins[Math.floor(Math.random() * voisins.length)];
    cases[l][c][mur] = false;
    cases[vl][vc][murOppose] = false;
    vu[vl][vc] = true;
    pile.push([vl, vc]);
  }
  return cases;
}

export type Sens = "haut" | "bas" | "gauche" | "droite";

/** Next position if the move is allowed (no wall), otherwise the same position */
export function avancer(cases: Case[][], [l, c]: [number, number], sens: Sens): [number, number] {
  if (cases[l][c][sens]) return [l, c];
  if (sens === "haut") return [l - 1, c];
  if (sens === "bas") return [l + 1, c];
  if (sens === "gauche") return [l, c - 1];
  return [l, c + 1];
}

export type Position = [number, number];
const memeCase = (a: Position, b: Position) => a[0] === b[0] && a[1] === b[1];

/**
 * The child drags a finger through the maze: the trail follows the finger one cell at a time, only
 * where there is no wall. Going back over the trail rubs it out. Returns the new trail (start → head).
 */
export function suivreDoigt(cases: Case[][], chemin: Position[], cible: Position): Position[] {
  let trace = chemin;
  const taille = cases.length;
  if (cible[0] < 0 || cible[1] < 0 || cible[0] >= taille || cible[1] >= taille) return trace;
  for (let pas = 0; pas < taille * taille; pas++) {
    const tete = trace[trace.length - 1];
    if (memeCase(tete, cible)) break;
    // the finger is back on the trail: the trail is shortened to that cell
    const deja = trace.findIndex((p) => memeCase(p, cible));
    if (deja >= 0) return trace.slice(0, deja + 1);
    const dl = Math.sign(cible[0] - tete[0]);
    const dc = Math.sign(cible[1] - tete[1]);
    const vertical: Sens | null = dl < 0 ? "haut" : dl > 0 ? "bas" : null;
    const horizontal: Sens | null = dc < 0 ? "gauche" : dc > 0 ? "droite" : null;
    const essais = (
      Math.abs(cible[0] - tete[0]) >= Math.abs(cible[1] - tete[1]) ? [vertical, horizontal] : [horizontal, vertical]
    ).filter((s): s is Sens => s !== null);
    let bouge = false;
    for (const sens of essais) {
      const suivante = avancer(cases, tete, sens);
      if (memeCase(suivante, tete)) continue;
      trace = trace.length > 1 && memeCase(suivante, trace[trace.length - 2]) ? trace.slice(0, -1) : [...trace, suivante];
      bouge = true;
      break;
    }
    if (!bouge) break; // a wall is in the way: the trail waits for the finger
  }
  return trace;
}
