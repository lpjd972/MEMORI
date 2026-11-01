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
