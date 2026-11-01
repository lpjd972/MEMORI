import { describe, it, expect } from "vitest";
import { HISTOIRES } from "@/lib/bible/histoires";
import { MOTS_MELES } from "@/lib/bible/motsMeles";
import { MODES_ORDER } from "@/lib/gameData";
import { creerGrille, ligneEntre, motSelectionne, normaliser, reglageMotsMeles } from "@/lib/motsMeles";
import { passageAlire } from "@/lib/lienBible";

describe("mots mêlés", () => {
  it("chaque histoire a sa liste de mots, chacun avec un passage de la Bible", () => {
    for (const h of HISTOIRES) {
      expect(MOTS_MELES[h.id]?.length ?? 0, h.id).toBeGreaterThanOrEqual(7);
      for (const [mot, ref] of MOTS_MELES[h.id]) {
        expect(normaliser(mot).length, mot).toBeGreaterThanOrEqual(2);
        expect(passageAlire(ref), `${mot} ${ref}`).not.toBeNull();
      }
    }
  });

  it("toutes les grilles se construisent, avec le bon nombre de mots bien placés", () => {
    for (const mode of MODES_ORDER) {
      for (let level = 1; level <= HISTOIRES.length * 2; level++) {
        const g = creerGrille(level, mode);
        const voulus = reglageMotsMeles(level, mode).nbMots;
        const aTrouver = g.mots.filter((m) => !m.piege);
        expect(aTrouver.length, `${mode} ${level} ${g.histoire.id}`).toBeGreaterThanOrEqual(Math.min(voulus, 7));
        expect(aTrouver.length).toBeLessThanOrEqual(voulus);
        for (const m of g.mots) {
          expect(m.cases.map(([l, c]) => g.lettres[l][c]).join("")).toBe(m.cle);
        }
        if (mode === "petits") expect(g.mots.some((m) => m.piege)).toBe(false);
      }
    }
  });

  it("reconnaît un mot sélectionné dans les deux sens, et refuse une ligne tordue", () => {
    const g = creerGrille(3, "grands");
    const m = g.mots[0];
    const debut = m.cases[0];
    const fin = m.cases[m.cases.length - 1];
    expect(motSelectionne(g, ligneEntre(debut, fin)!)?.cle).toBe(m.cle);
    expect(motSelectionne(g, ligneEntre(fin, debut)!)?.cle).toBe(m.cle);
    expect(ligneEntre([0, 0], [1, 2])).toBeNull();
  });
});

import { VERSETS, decouper } from "@/lib/bible/versets";
import { creerPuzzle } from "@/lib/versetsATrous";
import { creerLabyrinthe, avancer } from "@/lib/labyrinthe";

describe("versets à trous", () => {
  it("les versets repris des histoires ont exactement le même texte (Louis Segond 1910)", () => {
    for (const v of VERSETS) {
      const h = HISTOIRES.find((x) => x.id === v.histoire);
      expect(h, v.reference).toBeDefined();
      expect(passageAlire(v.reference), v.reference).not.toBeNull();
      if (h!.verset.reference === v.reference) {
        expect(decouper(v.texte).map((s) => s.texte).join(""), v.reference).toBe(h!.verset.texte);
      }
      expect(decouper(v.texte).filter((s) => s.trou).length, v.reference).toBeGreaterThanOrEqual(2);
    }
  });

  it("chaque puzzle a ses trous, et toutes les bonnes réponses sont dans la banque de mots", () => {
    for (const mode of ["enfants", "grands"] as const) {
      for (let level = 1; level <= VERSETS.length * 2; level++) {
        const p = creerPuzzle(level, mode);
        expect(p.reponses.length).toBeGreaterThanOrEqual(1);
        for (const r of p.reponses) expect(p.banque).toContain(r);
        const texte = p.morceaux.map((m) => m.texte).join("");
        expect(texte).toBe(decouper(p.verset.texte).map((s) => s.texte).join(""));
      }
    }
  });
});

describe("labyrinthe", () => {
  it("il existe toujours un chemin du départ jusqu'à Jésus", () => {
    for (let taille = 4; taille <= 8; taille++) {
      const lab = creerLabyrinthe(taille);
      const vu = new Set(["0,0"]);
      const file: [number, number][] = [[0, 0]];
      while (file.length) {
        const pos = file.shift()!;
        for (const sens of ["haut", "bas", "gauche", "droite"] as const) {
          const n = avancer(lab, pos, sens);
          const k = n.join(",");
          if (!vu.has(k)) {
            vu.add(k);
            file.push(n);
          }
        }
      }
      expect(vu.has(`${taille - 1},${taille - 1}`)).toBe(true);
      expect(vu.size).toBe(taille * taille);
    }
  });
});
