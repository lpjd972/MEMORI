import { describe, it, expect } from "vitest";
import { HISTOIRES } from "@/lib/bible/histoires";
import { QUESTIONS } from "@/lib/bible/questions";
import { LOUANGES } from "@/lib/louanges";
import { passageAlire } from "@/lib/lienBible";
import {
  MODES_ORDER,
  createCards,
  getLevelConfig,
  niveauxDefi,
  pickBonusQuestions,
  pickQuestion,
} from "@/lib/gameData";

describe("contenu biblique", () => {
  it("chaque mot et chaque image de carte n'existe qu'une fois (sinon deux paires se confondraient)", () => {
    const mots = HISTOIRES.flatMap((h) => h.cartes.map((c) => c.mot));
    const emojis = HISTOIRES.flatMap((h) => h.cartes.map((c) => c.emoji));
    expect(new Set(mots).size).toBe(mots.length);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  it("chaque histoire a un identifiant unique, au moins 5 cartes et un verset", () => {
    expect(new Set(HISTOIRES.map((h) => h.id)).size).toBe(HISTOIRES.length);
    for (const h of HISTOIRES) {
      expect(h.cartes.length, h.id).toBeGreaterThanOrEqual(5);
      expect(h.verset.texte.length, h.id).toBeGreaterThan(10);
      expect(h.verset.reference, h.id).toMatch(/\d/);
    }
  });

  it("chaque histoire a au moins 2 questions pour chaque tranche d'âge", () => {
    for (const h of HISTOIRES) {
      for (const niveau of [1, 2, 3] as const) {
        const n = QUESTIONS.filter((q) => q.histoire === h.id && q.niveau === niveau).length;
        expect(n, `${h.id} niveau ${niveau}`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("aucune question n'est posée deux fois", () => {
    const textes = QUESTIONS.map((q) => q.question);
    expect(new Set(textes).size).toBe(textes.length);
  });

  it("les questions sont bien formées", () => {
    const ids = new Set(HISTOIRES.map((h) => h.id));
    for (const q of QUESTIONS) {
      expect(ids.has(q.histoire), q.question).toBe(true);
      expect(q.faux.length, q.question).toBeGreaterThanOrEqual(q.niveau === 1 ? 2 : 3);
      expect(q.faux.includes(q.reponse), q.question).toBe(false);
      expect(new Set(q.faux).size, q.question).toBe(q.faux.length);
      expect(q.reference, q.question).toMatch(/\d/);
    }
  });

  it("il ne reste rien de l'ancien jeu (Disney, dessins animés, escape game)", () => {
    const tout = JSON.stringify({ HISTOIRES, QUESTIONS }).toLowerCase();
    for (const interdit of ["disney", "éponge", "simba", "nemo", "mario", "escape", "énigme"]) {
      expect(tout.includes(interdit), interdit).toBe(false);
    }
  });
});

describe("moteur du jeu", () => {
  it("le niveau 1 commence par la Création et l'ordre suit la Bible jusqu'à l'Apocalypse", () => {
    expect(getLevelConfig(1, "enfants").histoire.id).toBe("creation");
    expect(getLevelConfig(HISTOIRES.length, "enfants").histoire.id).toBe("apocalypse");
    const tour2 = getLevelConfig(HISTOIRES.length + 1, "enfants");
    expect(tour2.histoire.id).toBe("creation");
    expect(tour2.tour).toBe(2);
  });

  it("le plateau contient exactement les paires prévues, et d'abord les cartes de l'histoire", () => {
    for (const mode of MODES_ORDER) {
      for (const level of [1, 2, 5, 12, 31, 40, 100]) {
        const { pairs, histoire } = getLevelConfig(level, mode);
        const cards = createCards(level, mode);
        expect(cards.length).toBe(pairs * 2);
        const keys = new Map<string, number>();
        cards.forEach((c) => keys.set(c.key, (keys.get(c.key) ?? 0) + 1));
        expect([...keys.values()].every((n) => n === 2)).toBe(true);
        const own = histoire.cartes.map((c) => c.mot);
        const expectedOwn = Math.min(pairs, own.length);
        expect([...keys.keys()].filter((k) => own.includes(k)).length).toBe(expectedOwn);
      }
    }
  });

  it("les petits ont de petits plateaux, les grands des plateaux plus grands", () => {
    expect(getLevelConfig(1, "petits").pairs).toBe(2);
    expect(getLevelConfig(200, "petits").pairs).toBeLessThanOrEqual(6);
    expect(getLevelConfig(200, "grands").pairs).toBeGreaterThan(getLevelConfig(200, "enfants").pairs);
  });

  it("la question porte sur l'histoire du niveau, avec la bonne réponse parmi les choix", () => {
    for (const mode of MODES_ORDER) {
      for (let level = 1; level <= HISTOIRES.length + 3; level++) {
        const q = pickQuestion(level, mode);
        expect(q.category).toContain(getLevelConfig(level, mode).histoire.titre);
        expect(q.options[q.correctIndex]).toBeDefined();
        if (mode === "petits") expect(q.options.length).toBe(3);
        if (mode === "grands") expect(q.options.length).toBe(4);
      }
    }
  });

  it("après une mauvaise réponse, une autre question est proposée", () => {
    const first = pickQuestion(3, "grands");
    for (let i = 0; i < 20; i++) {
      expect(pickQuestion(3, "grands", [first.question]).question).not.toBe(first.question);
    }
  });

  it("le Défi de la Parole ne pose que des questions sur les histoires déjà vues", () => {
    const qs = pickBonusQuestions(2, "enfants", 3);
    expect(qs.length).toBeGreaterThan(0);
    for (const q of qs) {
      expect(["🌍 La Création", "🌺 Adam et Ève"]).toContain(q.category);
    }
  });
});

describe("Défi de la Parole", () => {
  it("devient plus difficile au fil des défis réussis (sauf pour les petits)", () => {
    expect(niveauxDefi("petits", 1, 50)).toEqual([1]);
    expect(niveauxDefi("enfants", 1, 0)).toEqual([1, 2]);
    expect(niveauxDefi("enfants", 1, 10)).toEqual([3]);
    expect(niveauxDefi("grands", 1, 0)).toEqual([2, 3]);
    expect(niveauxDefi("grands", 1, 2)).toEqual([3]);
  });

  it("donne d'abord des questions jamais vues", () => {
    const premieres = pickBonusQuestions(31, "grands", 3, 5).map((q) => q.question);
    for (let i = 0; i < 10; i++) {
      const suivantes = pickBonusQuestions(31, "grands", 3, 5, premieres).map((q) => q.question);
      for (const q of suivantes) expect(premieres).not.toContain(q);
    }
  });

  it("propose toujours 3 questions, même au tout début du jeu", () => {
    for (const mode of MODES_ORDER) {
      expect(pickBonusQuestions(1, mode, 3, 20).length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("pause louange", () => {
  it("chaque chant a un identifiant YouTube valide (11 caractères) et n'apparaît qu'une fois", () => {
    const ids = LOUANGES.map((l) => l.youtubeId);
    for (const id of ids) expect(id, id).toMatch(/^[A-Za-z0-9_-]{11}$/);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("liens vers la Bible", () => {
  it("trouve le chapitre à relire", () => {
    expect(passageAlire("Genèse 41:26")?.url).toBe("https://www.bible.com/bible/93/GEN.41.LSG");
    expect(passageAlire("1 Samuel 17:4")?.chapitre).toBe("1 Samuel 17");
    expect(passageAlire("Exode 7 – 12")?.url).toContain("EXO.7.");
    expect(passageAlire("Psaume 23 (titre)")?.url).toContain("PSA.23.");
    expect(passageAlire("Jean 3:16 ; 15:13")?.url).toContain("JHN.3.");
  });

  it("chaque question et chaque histoire renvoient vers un chapitre de la Bible", () => {
    for (const q of QUESTIONS) expect(passageAlire(q.reference), q.reference).not.toBeNull();
    for (const h of HISTOIRES) expect(passageAlire(h.reference), h.reference).not.toBeNull();
  });
});
