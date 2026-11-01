import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import type { EtapeGuide } from "@/lib/tutoriel";

interface TutorielProps {
  etapes: EtapeGuide[];
  /** Guide opens by itself at start-up (the checkbox of the last step) */
  auto: boolean;
  onAutoChange: (auto: boolean) => void;
  onFin: () => void;
}

type Rect = { top: number; left: number; width: number; height: number };
const MARGE = 6;

/** Step-by-step pop-ups that point at the buttons of the home screen */
const Tutoriel = ({ etapes, auto, onAutoChange, onFin }: TutorielProps) => {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [vue, setVue] = useState({ l: window.innerWidth, h: window.innerHeight });
  const etape = etapes[i];
  const derniere = i === etapes.length - 1;

  const mesurer = useCallback(() => {
    setVue({ l: window.innerWidth, h: window.innerHeight });
    const el = etape?.cible ? document.querySelector<HTMLElement>(`[data-tuto="${etape.cible}"]`) : null;
    if (!el) return setRect(null);
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - MARGE, left: r.left - MARGE, width: r.width + 2 * MARGE, height: r.height + 2 * MARGE });
  }, [etape]);

  useLayoutEffect(() => {
    const el = etape?.cible ? document.querySelector<HTMLElement>(`[data-tuto="${etape.cible}"]`) : null;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    mesurer();
    const t = setTimeout(mesurer, 450); // after the smooth scroll
    return () => clearTimeout(t);
  }, [etape, mesurer]);

  useEffect(() => {
    window.addEventListener("resize", mesurer);
    window.addEventListener("scroll", mesurer, true);
    return () => {
      window.removeEventListener("resize", mesurer);
      window.removeEventListener("scroll", mesurer, true);
    };
  }, [mesurer]);

  useEffect(() => {
    const touche = (e: KeyboardEvent) => e.key === "Escape" && onFin();
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [onFin]);

  if (!etape) return null;

  const largeur = Math.min(360, vue.l - 32);
  const gauche = (vue.l - largeur) / 2;
  // card under the highlighted button if there is room, otherwise above it
  const enDessous = rect ? rect.top + rect.height + 230 < vue.h || rect.top < 230 : false;
  const placeCarte: React.CSSProperties = rect
    ? enDessous
      ? { top: Math.min(rect.top + rect.height + 12, vue.h - 230), left: gauche, width: largeur }
      : { bottom: vue.h - rect.top + 12, left: gauche, width: largeur }
    : { top: "50%", left: gauche, width: largeur, transform: "translateY(-50%)" };

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Guide de Memory Bible">
      {rect ? (
        <motion.div
          className="absolute rounded-2xl ring-4 ring-amber-300 pointer-events-none"
          style={{ boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.65)" }}
          animate={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900/65" />
      )}

      <motion.div
        key={i}
        className="absolute bg-card rounded-2xl p-5 shadow-2xl"
        style={placeCarte}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground">
            Guide · {i + 1}/{etapes.length}
          </span>
          <button onClick={onFin} className="text-xs font-bold text-muted-foreground underline">
            Passer le guide
          </button>
        </div>
        <p className="text-lg font-extrabold text-foreground mt-1">{etape.titre}</p>
        <p className="text-sm text-foreground mt-1 leading-relaxed">{etape.texte}</p>

        {derniere && (
          <label className="flex items-center gap-2 mt-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) => onAutoChange(e.target.checked)}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            Afficher ce guide à chaque ouverture du jeu
          </label>
        )}

        <div className="flex gap-2 mt-4">
          {i > 0 && (
            <button onClick={() => setI(i - 1)} className="flex-1 bg-muted text-foreground font-bold py-2.5 rounded-xl">
              ← Retour
            </button>
          )}
          <button
            onClick={() => (derniere ? onFin() : setI(i + 1))}
            className="flex-[2] game-gradient text-primary-foreground font-bold py-2.5 rounded-xl"
          >
            {derniere ? "C'est parti !" : "Suivant →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Tutoriel;
