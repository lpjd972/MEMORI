interface EnteteJeuProps {
  titre: string;
  score: number;
  onClose: () => void;
}

/** Shared header of the extra games: back button, title, stars */
const EnteteJeu = ({ titre, score, onClose }: EnteteJeuProps) => (
  <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
    <button onClick={onClose} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
      ← Menu
    </button>
    <h1 className="text-base font-extrabold text-foreground">{titre}</h1>
    <span className="text-sm font-bold text-game-gold">⭐ {score}</span>
  </header>
);

export default EnteteJeu;
