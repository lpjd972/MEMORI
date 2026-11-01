import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { avancer, creerLabyrinthe, tailleLabyrinthe, type Sens } from "@/lib/labyrinthe";
import { ecrireNiveauJeu, lireNiveauJeu } from "@/lib/jeux";
import { VIES_PAUSE_PSAUME } from "@/lib/louanges";

interface LabyrintheProps {
  onEarnLives: (amount: number) => void;
  onClose: () => void;
}

const DUREE = 30;

/**
 * For the little ones, instead of a YouTube break: guide the child to Jesus through a maze.
 * After 30 seconds the lives are given; the child may keep going as long as they like.
 */
const Labyrinthe = ({ onEarnLives, onClose }: LabyrintheProps) => {
  const [niveau, setNiveau] = useState(() => lireNiveauJeu("labyrinthe", "petits"));
  const taille = tailleLabyrinthe(niveau);
  const cases = useMemo(() => creerLabyrinthe(taille), [taille, niveau]); // eslint-disable-line react-hooks/exhaustive-deps
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [secondes, setSecondes] = useState(DUREE);
  const recompense = useRef(false);
  const arrive = pos[0] === taille - 1 && pos[1] === taille - 1;

  useEffect(() => {
    if (secondes <= 0) {
      if (!recompense.current) {
        recompense.current = true;
        onEarnLives(VIES_PAUSE_PSAUME);
      }
      return;
    }
    const t = setTimeout(() => setSecondes((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondes, onEarnLives]);

  const bouger = useCallback(
    (sens: Sens) => {
      if (arrive) return;
      setPos((p) => avancer(cases, p, sens));
    },
    [cases, arrive]
  );

  useEffect(() => {
    const touche = (e: KeyboardEvent) => {
      const sens = ({ ArrowUp: "haut", ArrowDown: "bas", ArrowLeft: "gauche", ArrowRight: "droite" } as const)[
        e.key as "ArrowUp"
      ];
      if (sens) bouger(sens);
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [bouger]);

  useEffect(() => {
    if (arrive) ecrireNiveauJeu("labyrinthe", "petits", niveau + 1);
  }, [arrive, niveau]);

  /** Tapping a cell next to the child moves there (if no wall) */
  const toucher = (l: number, c: number) => {
    const [pl, pc] = pos;
    if (l === pl - 1 && c === pc) bouger("haut");
    else if (l === pl + 1 && c === pc) bouger("bas");
    else if (l === pl && c === pc - 1) bouger("gauche");
    else if (l === pl && c === pc + 1) bouger("droite");
  };

  const suivant = () => {
    setNiveau((n) => n + 1);
    setPos([0, 0]);
  };

  const mur = "border-slate-700 dark:border-slate-200";
  return (
    <motion.div className="fixed inset-0 z-50 flex flex-col bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">🧩 Rejoins Jésus</span>
        <button onClick={onClose} className="text-xs bg-muted px-3 py-1 rounded-full font-bold">
          Fermer ✕
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-center text-sm text-foreground max-w-xs">
          « Laissez venir à moi les petits enfants » <span className="text-muted-foreground">— Matthieu 19:14</span>
        </p>
        <div className="grid w-full max-w-xs aspect-square" style={{ gridTemplateColumns: `repeat(${taille}, minmax(0, 1fr))` }}>
          {cases.map((ligne, l) =>
            ligne.map((cs, c) => {
              const ici = pos[0] === l && pos[1] === c;
              const but = l === taille - 1 && c === taille - 1;
              return (
                <button
                  key={`${l}-${c}`}
                  onClick={() => toucher(l, c)}
                  aria-label={ici ? "L'enfant" : but ? "Jésus" : "case"}
                  className={`aspect-square flex items-center justify-center bg-card ${mur} ${
                    cs.haut ? "border-t-4" : ""
                  } ${cs.bas ? "border-b-4" : ""} ${cs.gauche ? "border-l-4" : ""} ${cs.droite ? "border-r-4" : ""} ${
                    but ? "bg-amber-100" : ""
                  }`}
                >
                  <span className={taille > 6 ? "text-lg" : "text-2xl"}>{ici ? "🧒" : but ? "✝️" : ""}</span>
                </button>
              );
            })
          )}
        </div>
        <p className="text-xs text-muted-foreground -mt-2">✝️ = Jésus · touche une case à côté ou les flèches</p>

        {arrive ? (
          <div className="text-center">
            <p className="text-2xl font-extrabold text-foreground">🎉 Tu as rejoint Jésus !</p>
            <p className="text-sm text-muted-foreground">Jésus aime les enfants.</p>
            <button onClick={suivant} className="mt-3 game-gradient text-primary-foreground font-bold px-6 py-3 rounded-xl">
              Labyrinthe suivant →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 w-44">
            <span />
            <button onClick={() => bouger("haut")} className="bg-primary text-primary-foreground rounded-xl py-3 text-xl" aria-label="Haut">⬆️</button>
            <span />
            <button onClick={() => bouger("gauche")} className="bg-primary text-primary-foreground rounded-xl py-3 text-xl" aria-label="Gauche">⬅️</button>
            <button onClick={() => bouger("bas")} className="bg-primary text-primary-foreground rounded-xl py-3 text-xl" aria-label="Bas">⬇️</button>
            <button onClick={() => bouger("droite")} className="bg-primary text-primary-foreground rounded-xl py-3 text-xl" aria-label="Droite">➡️</button>
          </div>
        )}
        <p className="text-sm font-bold text-foreground">
          {secondes > 0 ? `Encore ${secondes} s · +${VIES_PAUSE_PSAUME} ❤️ à la fin` : `+${VIES_PAUSE_PSAUME} ❤️ gagnés !`}
        </p>
      </div>
    </motion.div>
  );
};

export default Labyrinthe;
