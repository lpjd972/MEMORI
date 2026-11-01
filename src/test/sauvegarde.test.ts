import { beforeEach, describe, expect, it } from "vitest";
import { fusionnerJeux, lireJeuxLocaux } from "@/lib/sauvegardeJeux";
import { ecrireNiveauJeu, lireNiveauJeu } from "@/lib/jeux";
import { lirePalier, lireQuestionsVues, noterQuestionsVues } from "@/lib/defi";

describe("niveaux des autres jeux gardés avec le compte", () => {
  beforeEach(() => localStorage.clear());

  it("un nouvel appareil retrouve les niveaux du compte", () => {
    fusionnerJeux("grands", { "mots-meles": 7, versets: 4, "defi-palier": 2, "defi-vues": ["q1", "q2"] });
    expect(lireNiveauJeu("mots-meles", "grands")).toBe(7);
    expect(lireNiveauJeu("versets", "grands")).toBe(4);
    expect(lirePalier("grands")).toBe(2);
    expect(lireQuestionsVues("grands")).toEqual(["q1", "q2"]);
    // the other categories are not touched
    expect(lireNiveauJeu("mots-meles", "enfants")).toBe(1);
  });

  it("garde le plus avancé : l'appareil n'est jamais ramené en arrière", () => {
    ecrireNiveauJeu("mots-meles", "enfants", 9);
    noterQuestionsVues("enfants", ["a"]);
    fusionnerJeux("enfants", { "mots-meles": 3, labyrinthe: 5, "defi-vues": ["b"] });
    expect(lireNiveauJeu("mots-meles", "enfants")).toBe(9);
    expect(lireNiveauJeu("labyrinthe", "enfants")).toBe(5);
    expect(lireQuestionsVues("enfants").sort()).toEqual(["a", "b"]);
  });

  it("ignore une copie abîmée et envoie ce que l'appareil sait", () => {
    fusionnerJeux("petits", null);
    fusionnerJeux("petits", { "mots-meles": "beaucoup", versets: -2 });
    expect(lireNiveauJeu("mots-meles", "petits")).toBe(1);
    ecrireNiveauJeu("labyrinthe", "petits", 6);
    expect(lireJeuxLocaux("petits")).toMatchObject({ labyrinthe: 6, "mots-meles": 1, versets: 1, "defi-palier": 0 });
  });
});
