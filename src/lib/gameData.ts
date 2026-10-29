import { HISTOIRES, type Histoire } from "@/lib/bible/histoires";
import { QUESTIONS, type NiveauQuestion, type QuestionBible } from "@/lib/bible/questions";

/** Tranche d'âge choisie sur l'écran d'accueil : elle règle les cartes, la taille du plateau et les questions. */
export type ModeAge = "petits" | "enfants" | "grands";

export const MODES: Record<ModeAge, { emoji: string; label: string; ages: string; description: string }> = {
  petits: { emoji: "🐑", label: "Petits", ages: "3 – 6 ans", description: "Grandes images, petits plateaux, questions avec images" },
  enfants: { emoji: "🧒", label: "Enfants", ages: "7 – 12 ans", description: "Images et mots, questions sur les histoires" },
  grands: { emoji: "📖", label: "Ados & adultes", ages: "13 – 99 ans", description: "Des mots seulement, plateaux plus grands, questions pointues" },
};

export const MODES_ORDER: ModeAge[] = ["petits", "enfants", "grands"];

export interface GameCard {
  id: number;
  /** Les deux cartes d'une paire ont la même clé */
  key: string;
  emoji: string;
  mot: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface LevelConfig {
  level: number;
  pairs: number;
  columns: number;
  livesLostPerError: number;
  histoire: Histoire;
  /** 1 au premier passage de la Genèse à l'Apocalypse, 2 au suivant, etc. */
  tour: number;
  label: string;
}

const MAX_PAIRS: Record<ModeAge, number> = { petits: 6, enfants: 12, grands: 15 };

function pairsFor(level: number, mode: ModeAge): number {
  const n = level - 1;
  const raw =
    mode === "petits" ? 2 + Math.floor(n / 2) : mode === "enfants" ? 3 + Math.floor(n / 2) : 4 + Math.floor(n * 0.6);
  return Math.min(raw, MAX_PAIRS[mode]);
}

function columnsFor(totalCards: number): number {
  if (totalCards <= 4) return 2;
  if (totalCards <= 6) return 3;
  if (totalCards <= 20) return 4;
  if (totalCards <= 30) return 5;
  return 6;
}

function livesLostFor(level: number, mode: ModeAge): number {
  if (mode === "petits") return 1;
  if (mode === "enfants") return level > HISTOIRES.length ? 2 : 1;
  return Math.min(1 + Math.floor(level / 10), 3);
}

/** Configuration de n'importe quel niveau (niveaux infinis : après l'Apocalypse, on repart de la Genèse en plus difficile). */
export function getLevelConfig(level: number, mode: ModeAge): LevelConfig {
  const index = (level - 1) % HISTOIRES.length;
  const tour = Math.floor((level - 1) / HISTOIRES.length) + 1;
  const histoire = HISTOIRES[index];
  const pairs = pairsFor(level, mode);
  return {
    level,
    pairs,
    columns: columnsFor(pairs * 2),
    livesLostPerError: livesLostFor(level, mode),
    histoire,
    tour,
    label: `${histoire.emoji} ${histoire.titre}`,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Les cartes du niveau : d'abord celles de l'histoire, puis, si le plateau est plus grand, des cartes d'autres histoires. */
export function createCards(level: number, mode: ModeAge): GameCard[] {
  const { pairs, histoire } = getLevelConfig(level, mode);
  const own = shuffleArray(histoire.cartes);
  const others = shuffleArray(HISTOIRES.filter((h) => h.id !== histoire.id).flatMap((h) => h.cartes));
  const chosen = [...own, ...others].slice(0, pairs);
  const cards: GameCard[] = [];
  chosen.forEach((carte, index) => {
    for (let k = 0; k < 2; k++) {
      cards.push({ id: index * 2 + k, key: carte.mot, emoji: carte.emoji, mot: carte.mot, isFlipped: false, isMatched: false });
    }
  });
  return shuffleArray(cards);
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  reference: string;
}

function niveauxFor(mode: ModeAge, tour: number): NiveauQuestion[] {
  if (mode === "petits") return [1];
  if (mode === "enfants") return tour === 1 ? [1, 2] : [2];
  return tour === 1 ? [2, 3] : [3];
}

function toQuiz(q: QuestionBible, mode: ModeAge): QuizQuestion {
  const faux = mode === "petits" ? q.faux.slice(0, 2) : q.faux;
  const options = shuffleArray([q.reponse, ...faux]);
  const histoire = HISTOIRES.find((h) => h.id === q.histoire);
  return {
    question: q.question,
    options,
    correctIndex: options.indexOf(q.reponse),
    category: histoire ? `${histoire.emoji} ${histoire.titre}` : "Bible",
    reference: q.reference,
  };
}

/** Une question sur l'histoire du niveau, adaptée à l'âge. `exclude` évite de reposer une question déjà vue. */
export function pickQuestion(level: number, mode: ModeAge, exclude: string[] = []): QuizQuestion {
  const { histoire, tour } = getLevelConfig(level, mode);
  const niveaux = niveauxFor(mode, tour);
  const pool = QUESTIONS.filter((q) => q.histoire === histoire.id && niveaux.includes(q.niveau));
  const fresh = pool.filter((q) => !exclude.includes(q.question));
  return toQuiz(shuffleArray(fresh.length > 0 ? fresh : pool)[0], mode);
}

/** Questions bonus (Défi de la Parole) : sur les histoires déjà rencontrées. */
export function pickBonusQuestions(level: number, mode: ModeAge, count: number): QuizQuestion[] {
  const { tour } = getLevelConfig(level, mode);
  const reached = tour > 1 ? HISTOIRES.length : ((level - 1) % HISTOIRES.length) + 1;
  const ids = HISTOIRES.slice(0, reached).map((h) => h.id);
  const niveaux = niveauxFor(mode, tour);
  const pool = QUESTIONS.filter((q) => ids.includes(q.histoire) && niveaux.includes(q.niveau));
  return shuffleArray(pool).slice(0, count).map((q) => toQuiz(q, mode));
}

export const STATS = { histoires: HISTOIRES.length, questions: QUESTIONS.length };
