// Card emoji symbols for the memory game
export const CARD_SYMBOLS = [
  "🧠", "🎯", "⭐", "🔥", "💎", "🎨", "🎵", "🌈",
  "🦁", "🐬", "🦋", "🌻", "🍎", "⚡", "🎭", "🏆",
  "🌙", "🎪", "🧩", "🎲", "🦄", "🌊", "🍀", "🎸",
  "🐝", "🌺", "🎈", "🔮", "🦅", "🍕", "🎃", "❄️",
];

export interface GameCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface LevelConfig {
  level: number;
  pairs: number;
  columns: number;
  livesLostPerError: number;
  label: string;
  hasEnigma: boolean;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Échauffement", 2: "Facile", 3: "Débutant", 4: "Intermédiaire",
  5: "Avancé", 10: "Expert", 20: "Maître", 50: "Légende",
  100: "Ultime", 150: "Fort Boyard", 200: "Mythique",
};

/** Generates config for ANY level (infinite system) */
export function getLevelConfig(level: number): LevelConfig {
  // Pairs scale: starts at 2, grows slowly, caps at 32 (limited by CARD_SYMBOLS)
  const pairs = Math.min(2 + Math.floor(level * 0.8), CARD_SYMBOLS.length);
  // Columns: auto-fit based on pairs count
  const totalCards = pairs * 2;
  const columns = totalCards <= 4 ? 2 : totalCards <= 9 ? 3 : totalCards <= 16 ? 4 : totalCards <= 25 ? 5 : 6;
  // Lives lost per error scales slowly: 1 until lv10, 2 until lv25, 3 beyond
  const livesLostPerError = Math.min(1 + Math.floor(level / 10), 3);
  // Enigmas start at level 5+
  const hasEnigma = level >= 5;
  // Find label
  let label = `Niveau ${level}`;
  const thresholds = Object.keys(LEVEL_LABELS).map(Number).sort((a, b) => b - a);
  for (const t of thresholds) {
    if (level >= t) { label = LEVEL_LABELS[t]; break; }
  }
  return { level, pairs, columns, livesLostPerError, label, hasEnigma };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Culture générale
  { question: "Quelle est la capitale de la France ?", options: ["Lyon", "Paris", "Marseille", "Toulouse"], correctIndex: 1, category: "Culture générale" },
  { question: "Combien de continents y a-t-il ?", options: ["5", "6", "7", "8"], correctIndex: 2, category: "Culture générale" },
  { question: "Qui a peint La Joconde ?", options: ["Van Gogh", "Picasso", "De Vinci", "Monet"], correctIndex: 2, category: "Culture générale" },
  { question: "Quel est le plus grand océan ?", options: ["Atlantique", "Indien", "Arctique", "Pacifique"], correctIndex: 3, category: "Culture générale" },
  { question: "Quel animal est le roi de la savane ?", options: ["Éléphant", "Lion", "Girafe", "Guépard"], correctIndex: 1, category: "Culture générale" },
  { question: "Combien de jours dans une année ?", options: ["360", "365", "370", "355"], correctIndex: 1, category: "Culture générale" },
  { question: "Quelle planète est la plus proche du Soleil ?", options: ["Vénus", "Mars", "Mercure", "Jupiter"], correctIndex: 2, category: "Culture générale" },
  { question: "Quel est le plus long fleuve du monde ?", options: ["Nil", "Amazone", "Mississippi", "Yangtsé"], correctIndex: 1, category: "Culture générale" },
  { question: "Combien y a-t-il de lettres dans l'alphabet ?", options: ["24", "25", "26", "27"], correctIndex: 2, category: "Culture générale" },
  { question: "Quel est le plus grand pays du monde ?", options: ["Chine", "USA", "Russie", "Canada"], correctIndex: 2, category: "Culture générale" },
  { question: "Quelle est la monnaie du Japon ?", options: ["Yuan", "Won", "Yen", "Ringgit"], correctIndex: 2, category: "Culture générale" },
  { question: "Combien d'os un adulte a-t-il ?", options: ["186", "206", "226", "256"], correctIndex: 1, category: "Culture générale" },

  // Musique
  { question: "Quel instrument a 88 touches ?", options: ["Guitare", "Violon", "Piano", "Harpe"], correctIndex: 2, category: "Musique" },
  { question: "Qui chante 'Thriller' ?", options: ["Prince", "Michael Jackson", "Elvis", "Stevie Wonder"], correctIndex: 1, category: "Musique" },
  { question: "Combien de cordes a une guitare classique ?", options: ["4", "5", "6", "8"], correctIndex: 2, category: "Musique" },
  { question: "Qui a composé la 9e symphonie ?", options: ["Mozart", "Beethoven", "Bach", "Vivaldi"], correctIndex: 1, category: "Musique" },
  { question: "Quel genre musical est né à la Jamaïque ?", options: ["Samba", "Reggae", "Blues", "Jazz"], correctIndex: 1, category: "Musique" },

  // Disney
  { question: "Dans quel Disney trouve-t-on Simba ?", options: ["Bambi", "Le Roi Lion", "Aladdin", "Tarzan"], correctIndex: 1, category: "Disney" },
  { question: "Quelle princesse a des cheveux très longs ?", options: ["Cendrillon", "Raiponce", "Ariel", "Belle"], correctIndex: 1, category: "Disney" },
  { question: "Quel est le nom du poisson-clown de Nemo ?", options: ["Marin", "Gill", "Nemo", "Jacques"], correctIndex: 0, category: "Disney" },
  { question: "Qui est le méchant dans Le Roi Lion ?", options: ["Zazu", "Scar", "Rafiki", "Mufasa"], correctIndex: 1, category: "Disney" },
  { question: "Quel Disney se passe à Hawaii ?", options: ["Moana", "Lilo & Stitch", "Vaiana", "Pocahontas"], correctIndex: 1, category: "Disney" },
  { question: "Comment s'appelle le bonhomme de neige dans La Reine des Neiges ?", options: ["Sven", "Kristoff", "Olaf", "Hans"], correctIndex: 2, category: "Disney" },

  // Sport
  { question: "Quel sport utilise un volant ?", options: ["Tennis", "Badminton", "Squash", "Ping-pong"], correctIndex: 1, category: "Sport" },
  { question: "Combien de joueurs dans une équipe de foot ?", options: ["9", "10", "11", "12"], correctIndex: 2, category: "Sport" },
  { question: "Quel sport se joue sur glace avec un palet ?", options: ["Curling", "Hockey", "Patinage", "Bobsleigh"], correctIndex: 1, category: "Sport" },
  { question: "Combien de sets faut-il gagner au tennis (hommes, Grand Chelem) ?", options: ["2", "3", "4", "5"], correctIndex: 1, category: "Sport" },
  { question: "Dans quel pays les JO de 2024 ont-ils eu lieu ?", options: ["Japon", "USA", "France", "Brésil"], correctIndex: 2, category: "Sport" },
  { question: "Quel sport a été inventé par James Naismith ?", options: ["Volleyball", "Basketball", "Handball", "Baseball"], correctIndex: 1, category: "Sport" },

  // Alimentation
  { question: "Quel fruit est jaune et courbé ?", options: ["Pomme", "Banane", "Orange", "Fraise"], correctIndex: 1, category: "Alimentation" },
  { question: "Quelle vitamine trouve-t-on dans les oranges ?", options: ["A", "B", "C", "D"], correctIndex: 2, category: "Alimentation" },
  { question: "Quel aliment est la base du guacamole ?", options: ["Tomate", "Avocat", "Oignon", "Citron"], correctIndex: 1, category: "Alimentation" },
  { question: "Quel pays est célèbre pour les sushis ?", options: ["Chine", "Corée", "Japon", "Thaïlande"], correctIndex: 2, category: "Alimentation" },
  { question: "Combien de litres d'eau faut-il boire par jour (adulte) ?", options: ["0.5L", "1L", "1.5L", "3L"], correctIndex: 2, category: "Alimentation" },

  // Sciences
  { question: "Quel gaz respirons-nous ?", options: ["Azote", "CO2", "Oxygène", "Hélium"], correctIndex: 2, category: "Sciences" },
  { question: "Combien de planètes dans le système solaire ?", options: ["7", "8", "9", "10"], correctIndex: 1, category: "Sciences" },
  { question: "Quelle est la formule chimique de l'eau ?", options: ["H2O", "CO2", "O2", "NaCl"], correctIndex: 0, category: "Sciences" },
  { question: "Quel scientifique a découvert la gravité ?", options: ["Einstein", "Newton", "Galilée", "Tesla"], correctIndex: 1, category: "Sciences" },
  { question: "À quelle température l'eau bout-elle ?", options: ["90°C", "100°C", "110°C", "120°C"], correctIndex: 1, category: "Sciences" },

  // Cartoons
  { question: "Quel personnage vit dans un ananas ?", options: ["Patrick", "Bob l'Éponge", "Plankton", "Sandy"], correctIndex: 1, category: "Cartoons" },
  { question: "Comment s'appelle le chat de Gargamel ?", options: ["Félix", "Azraël", "Tom", "Garfield"], correctIndex: 1, category: "Cartoons" },
  { question: "Quel est le nom du plombier moustachu de Nintendo ?", options: ["Luigi", "Wario", "Mario", "Toad"], correctIndex: 2, category: "Cartoons" },
  { question: "Qui est l'ennemi juré de Bugs Bunny ?", options: ["Daffy", "Elmer", "Sam", "Titi"], correctIndex: 1, category: "Cartoons" },

  // Géographie
  { question: "Quelle est la capitale de l'Australie ?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correctIndex: 2, category: "Géographie" },
  { question: "Quel pays a la forme d'une botte ?", options: ["Grèce", "Espagne", "Italie", "Portugal"], correctIndex: 2, category: "Géographie" },
  { question: "Quel est le plus petit pays du monde ?", options: ["Monaco", "Vatican", "Malte", "Liechtenstein"], correctIndex: 1, category: "Géographie" },
  { question: "Sur quel continent se trouve l'Égypte ?", options: ["Asie", "Europe", "Afrique", "Amérique"], correctIndex: 2, category: "Géographie" },
  { question: "Quel est le plus haut sommet du monde ?", options: ["K2", "Mont Blanc", "Kilimandjaro", "Everest"], correctIndex: 3, category: "Géographie" },

  // Histoire
  { question: "En quelle année Christophe Colomb a-t-il découvert l'Amérique ?", options: ["1392", "1442", "1492", "1592"], correctIndex: 2, category: "Histoire" },
  { question: "Qui était le premier président des États-Unis ?", options: ["Lincoln", "Washington", "Jefferson", "Adams"], correctIndex: 1, category: "Histoire" },
  { question: "En quelle année la Révolution française a-t-elle commencé ?", options: ["1689", "1789", "1889", "1799"], correctIndex: 1, category: "Histoire" },
  { question: "Quel monument est à Rome et date de l'Antiquité ?", options: ["Tour Eiffel", "Parthénon", "Colisée", "Big Ben"], correctIndex: 2, category: "Histoire" },
];

// Enigma / Escape game challenges
export interface EnigmaChallenge {
  type: "riddle" | "sequence" | "wordPuzzle";
  question: string;
  answers: string[]; // Acceptable answers
  hint: string;
  difficulty: number; // 1-5
  sequence?: (number | string)[];
  scrambled?: string;
}

export const ENIGMA_CHALLENGES: EnigmaChallenge[] = [
  // Riddles
  {
    type: "riddle",
    question: "Je suis toujours devant toi mais je ne peux jamais être vu. Qui suis-je ?",
    answers: ["le futur", "l'avenir", "futur", "avenir"],
    hint: "Pense au temps...",
    difficulty: 1,
  },
  {
    type: "riddle",
    question: "Plus je sèche, plus je suis mouillée. Qui suis-je ?",
    answers: ["une serviette", "serviette", "la serviette"],
    hint: "Tu l'utilises après la douche.",
    difficulty: 1,
  },
  {
    type: "riddle",
    question: "J'ai des villes mais pas de maisons, des forêts mais pas d'arbres, de l'eau mais pas de poissons. Qui suis-je ?",
    answers: ["une carte", "carte", "la carte", "une carte géographique"],
    hint: "On me consulte pour voyager.",
    difficulty: 2,
  },
  {
    type: "riddle",
    question: "On me prend avant de partir et on me retrouve en arrivant. Qui suis-je ?",
    answers: ["une photo", "photo", "la photo"],
    hint: "📸 Clic !",
    difficulty: 2,
  },
  {
    type: "riddle",
    question: "Je peux voler sans ailes. Je peux pleurer sans yeux. Partout où je vais, l'obscurité suit. Qui suis-je ?",
    answers: ["un nuage", "nuage", "le nuage"],
    hint: "Regarde le ciel quand il pleut.",
    difficulty: 3,
  },
  {
    type: "riddle",
    question: "Je commence la nuit et je finis le matin. Qui suis-je ?",
    answers: ["la lettre n", "n", "lettre n"],
    hint: "Ce n'est pas une question de temps mais de lettres...",
    difficulty: 3,
  },

  // Sequences
  {
    type: "sequence",
    question: "Trouve le nombre suivant dans cette suite :",
    sequence: [2, 4, 8, 16],
    answers: ["32"],
    hint: "Chaque nombre est multiplié par...",
    difficulty: 1,
  },
  {
    type: "sequence",
    question: "Quel est le nombre suivant ?",
    sequence: [1, 1, 2, 3, 5, 8],
    answers: ["13"],
    hint: "Additionne les deux derniers nombres.",
    difficulty: 2,
  },
  {
    type: "sequence",
    question: "Continue la suite :",
    sequence: [3, 6, 11, 18, 27],
    answers: ["38"],
    hint: "Les écarts augmentent : +3, +5, +7, +9...",
    difficulty: 3,
  },
  {
    type: "sequence",
    question: "Quel nombre vient après ?",
    sequence: [1, 4, 9, 16, 25],
    answers: ["36"],
    hint: "Ce sont des carrés parfaits.",
    difficulty: 2,
  },
  {
    type: "sequence",
    question: "Complète la suite :",
    sequence: [0, 1, 3, 6, 10, 15],
    answers: ["21"],
    hint: "Ce sont les nombres triangulaires (+1, +2, +3, +4...).",
    difficulty: 3,
  },

  // Word puzzles
  {
    type: "wordPuzzle",
    question: "Remets les lettres dans le bon ordre pour trouver un animal :",
    scrambled: "NIHCE",
    answers: ["chien", "CHIEN"],
    hint: "Le meilleur ami de l'homme.",
    difficulty: 1,
  },
  {
    type: "wordPuzzle",
    question: "Déchiffre ce mot — c'est un pays :",
    scrambled: "NCFAER",
    answers: ["france", "FRANCE"],
    hint: "🇫🇷",
    difficulty: 1,
  },
  {
    type: "wordPuzzle",
    question: "Quel fruit se cache ici ?",
    scrambled: "SAIREF",
    answers: ["fraise", "FRAISE"],
    hint: "Un fruit rouge des bois.",
    difficulty: 2,
  },
  {
    type: "wordPuzzle",
    question: "Retrouve le mot — c'est un instrument de musique :",
    scrambled: "OAINP",
    answers: ["piano", "PIANO"],
    hint: "Il a 88 touches.",
    difficulty: 2,
  },
  {
    type: "wordPuzzle",
    question: "Mot mystère — c'est un élément naturel :",
    scrambled: "AELVONC",
    answers: ["volcan", "VOLCAN"],
    hint: "🌋 Il crache du feu.",
    difficulty: 3,
  },
  {
    type: "wordPuzzle",
    question: "Déchiffre ce mot — c'est un sport :",
    scrambled: "BLAOFTOL",
    answers: ["football", "FOOTBALL"],
    hint: "⚽ Le sport le plus populaire au monde.",
    difficulty: 2,
  },
];

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createCards(pairs: number): GameCard[] {
  const symbols = shuffleArray(CARD_SYMBOLS).slice(0, pairs);
  const cards: GameCard[] = [];
  symbols.forEach((symbol, index) => {
    cards.push({ id: index * 2, symbol, isFlipped: false, isMatched: false });
    cards.push({ id: index * 2 + 1, symbol, isFlipped: false, isMatched: false });
  });
  return shuffleArray(cards);
}
