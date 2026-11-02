import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { motion } from "framer-motion";
import {
  avancer,
  creerLabyrinthe,
  suivreDoigt,
  tailleLabyrinthe,
  type Position,
  type Sens,
} from "@/lib/labyrinthe";
import { ecrireNiveauJeu, lireNiveauJeu } from "@/lib/jeux";
import { VIES_PAUSE_PSAUME } from "@/lib/louanges";

interface LabyrintheProps {
  onEarnLives: (amount: number) => void;
  onClose: () => void;
}

const DUREE = 30;
const DEPART: Position = [0, 0];

/**
 * For the little ones, instead of a YouTube break: the child puts a finger on the little character and
 * draws the way to Jesus; a line follows the finger along the paths. After 30 seconds the lives are given;
 * the child may keep going as long as they like.
 */
const Labyrinthe = ({ onEarnLives, onClose }: LabyrintheProps) => {
  const [niveau, setNiveau] = useState(() =>
    lireNiveauJeu("labyrinthe", "petits"),
  );
  const taille = tailleLabyrinthe(niveau);
  const cases = useMemo(() => creerLabyrinthe(taille), [taille, niveau]); // eslint-disable-line react-hooks/exhaustive-deps
  const [chemin, setChemin] = useState<Position[]>([DEPART]);
  const [trace, setTrace] = useState(false);
  const [secondes, setSecondes] = useState(DUREE);
  const recompense = useRef(false);
  const grilleRef = useRef<HTMLDivElement>(null);
  const pos = chemin[chemin.length - 1];
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

  useEffect(() => {
    if (arrive) {
      ecrireNiveauJeu("labyrinthe", "petits", niveau + 1);
      setTrace(false);
    }
  }, [arrive, niveau]);

  /** Cell under the finger */
  const caseSous = (e: PointerEvent<HTMLDivElement>): Position | null => {
    const r = grilleRef.current?.getBoundingClientRect();
    if (!r) return null;
    const l = Math.floor(((e.clientY - r.top) / r.height) * taille);
    const c = Math.floor(((e.clientX - r.left) / r.width) * taille);
    return l >= 0 && c >= 0 && l < taille && c < taille ? [l, c] : null;
  };

  const poser = (e: PointerEvent<HTMLDivElement>) => {
    if (arrive) return;
    const ici = caseSous(e);
    if (!ici) return;
    // start from the child (or from anywhere on the line already drawn)
    const surLeTrait = chemin.findIndex(
      (p) => p[0] === ici[0] && p[1] === ici[1],
    );
    if (surLeTrait < 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setChemin((ch) => ch.slice(0, surLeTrait + 1));
    setTrace(true);
  };

  const glisser = (e: PointerEvent<HTMLDivElement>) => {
    if (!trace || arrive) return;
    const ici = caseSous(e);
    if (ici) setChemin((ch) => suivreDoigt(cases, ch, ici));
  };

  const lever = () => setTrace(false);

  // arrow keys still work on a computer
  const bouger = useCallback(
    (sens: Sens) => {
      if (arrive) return;
      setChemin((ch) =>
        suivreDoigt(cases, ch, avancer(cases, ch[ch.length - 1], sens)),
      );
    },
    [cases, arrive],
  );
  useEffect(() => {
    const touche = (e: KeyboardEvent) => {
      const sens = (
        {
          ArrowUp: "haut",
          ArrowDown: "bas",
          ArrowLeft: "gauche",
          ArrowRight: "droite",
        } as const
      )[e.key as "ArrowUp"];
      if (sens) bouger(sens);
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [bouger]);

  const suivant = () => {
    setNiveau((n) => n + 1);
    setChemin([DEPART]);
  };

  const recommencer = () => setChemin([DEPART]);

  const mur = "border-slate-700 dark:border-slate-200";
  const points = chemin.map(([l, c]) => `${c + 0.5},${l + 0.5}`).join(" ");
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
          🧩 Rejoins Jésus
        </span>
        <button
          onClick={onClose}
          className="text-xs bg-muted px-3 py-1 rounded-full font-bold"
        >
          Fermer ✕
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-center text-sm text-foreground max-w-xs">
          « Laissez venir à moi les petits enfants »{" "}
          <span className="text-muted-foreground">— Matthieu 19:14</span>
        </p>
        {!arrive && (
          <p className="text-center text-base font-extrabold text-slate-900 bg-amber-100 border-2 border-amber-400 rounded-xl px-3 py-2 max-w-xs">
            👆 Pose ton doigt sur 🧒 et trace le chemin jusqu'à Jésus ✝️
          </p>
        )}
        <div
          ref={grilleRef}
          className="relative grid w-full max-w-xs aspect-square select-none"
          style={{
            gridTemplateColumns: `repeat(${taille}, minmax(0, 1fr))`,
            touchAction: "none",
          }}
          onPointerDown={poser}
          onPointerMove={glisser}
          onPointerUp={lever}
          onPointerCancel={lever}
          aria-label="Labyrinthe : trace le chemin avec ton doigt"
        >
          {cases.map((ligne, l) =>
            ligne.map((cs, c) => {
              const ici = pos[0] === l && pos[1] === c;
              const but = l === taille - 1 && c === taille - 1;
              return (
                <div
                  key={`${l}-${c}`}
                  aria-label={ici ? "L'enfant" : but ? "Jésus" : undefined}
                  className={`aspect-square flex items-center justify-center bg-card ${mur} ${cs.haut ? "border-t-4" : ""} ${
                    cs.bas ? "border-b-4" : ""
                  } ${cs.gauche ? "border-l-4" : ""} ${cs.droite ? "border-r-4" : ""} ${but ? "bg-amber-100" : ""}`}
                />
              );
            }),
          )}
          {/* the line drawn by the finger */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${taille} ${taille}`}
          >
            <polyline
              points={points}
              fill="none"
              stroke={arrive ? "#10b981" : "#f59e0b"}
              strokeWidth={0.28}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
          </svg>
          {/* Jesus and the child, above the line */}
          <span
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              width: `${100 / taille}%`,
              height: `${100 / taille}%`,
              left: `${((taille - 1) * 100) / taille}%`,
              top: `${((taille - 1) * 100) / taille}%`,
            }}
          >
            {arrive ? (
              <span
                className={`${taille > 6 ? "text-xs" : "text-base"} whitespace-nowrap`}
              >
                🧒✝️
              </span>
            ) : (
              <span className={taille > 6 ? "text-lg" : "text-2xl"}>✝️</span>
            )}
          </span>
          {!arrive && (
            <motion.span
              className="absolute flex items-center justify-center pointer-events-none"
              style={{ width: `${100 / taille}%`, height: `${100 / taille}%` }}
              animate={{
                left: `${(pos[1] * 100) / taille}%`,
                top: `${(pos[0] * 100) / taille}%`,
                scale: chemin.length === 1 && !trace ? [1, 1.2, 1] : 1,
              }}
              transition={
                chemin.length === 1 && !trace
                  ? {
                      scale: { repeat: Infinity, duration: 1 },
                      default: { duration: 0.1 },
                    }
                  : { duration: 0.1 }
              }
            >
              <span className={taille > 6 ? "text-xl" : "text-3xl"}>🧒</span>
            </motion.span>
          )}
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          ✝️ = Jésus · le trait suit ton doigt dans les allées
        </p>

        {arrive ? (
          <div className="text-center">
            <p className="text-2xl font-extrabold text-foreground">
              🎉 Tu as rejoint Jésus !
            </p>
            <p className="text-sm text-muted-foreground">
              Jésus aime les enfants.
            </p>
            <button
              onClick={suivant}
              className="mt-3 game-gradient text-primary-foreground font-bold px-6 py-3 rounded-xl"
            >
              Labyrinthe suivant →
            </button>
          </div>
        ) : (
          // always takes its place, even hidden: the maze must not move under the child's finger
          <button
            onClick={recommencer}
            className={`text-sm font-bold bg-muted text-foreground px-4 py-2 rounded-xl ${chemin.length > 1 ? "" : "invisible"}`}
            tabIndex={chemin.length > 1 ? 0 : -1}
            aria-hidden={chemin.length <= 1}
          >
            ↩️ Effacer le trait et recommencer
          </button>
        )}
        <p className="text-sm font-bold text-foreground">
          {secondes > 0
            ? `Encore ${secondes} s · +${VIES_PAUSE_PSAUME} ❤️ à la fin`
            : `+${VIES_PAUSE_PSAUME} ❤️ gagnés !`}
        </p>
      </div>
    </motion.div>
  );
};

export default Labyrinthe;
