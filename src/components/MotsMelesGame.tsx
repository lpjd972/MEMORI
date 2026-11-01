import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EnteteJeu from "./EnteteJeu";
import DemoMotsMeles from "./DemoMotsMeles";
import VideoTuto from "./VideoTuto";
import { MODES, type ModeAge } from "@/lib/gameData";
import { creerGrille, ligneEntre, motLu, type MotCache } from "@/lib/motsMeles";
import { ecrireNiveauJeu, lireNiveauJeu, PRIX_INDICE, VIDEO_MOTS_MELES } from "@/lib/jeux";
import { passageAlire } from "@/lib/lienBible";

interface MotsMelesGameProps {
  mode: ModeAge;
  score: number;
  onSpendStars: (n: number) => void;
  onEarnStars: (n: number) => void;
  onClose: () => void;
}

const COULEURS = ["bg-sky-300", "bg-amber-300", "bg-emerald-300", "bg-pink-300", "bg-violet-300", "bg-orange-300", "bg-lime-300", "bg-cyan-300"];
const GAIN: Record<ModeAge, number> = { petits: 10, enfants: 15, grands: 20 };

type Message =
  | { type: "trouve" | "piege" | "deja"; mot: MotCache }
  | { type: "rate" }
  | { type: "reste"; restants: number }
  | { type: "tout" }
  | null;

type Case = [number, number];

const LienPassage = ({ reference }: { reference: string }) => {
  const p = passageAlire(reference);
  return p ? (
    <a href={p.url} target="_blank" rel="noreferrer" className="underline font-bold text-primary">
      {reference}
    </a>
  ) : (
    <span className="font-bold">{reference}</span>
  );
};

/** Word search on the story of the level: find its words; trap words from other stories teach where they come from */
const MotsMelesGame = ({ mode, score, onSpendStars, onEarnStars, onClose }: MotsMelesGameProps) => {
  const [niveau, setNiveau] = useState(() => lireNiveauJeu("mots-meles", mode));
  const grille = useMemo(() => creerGrille(niveau, mode), [niveau, mode]);
  const aTrouver = grille.mots.filter((m) => !m.piege);
  const [commence, setCommence] = useState(false);
  /** found words: key → the cells the player actually selected (a word may appear twice in the grid) */
  const [trouves, setTrouves] = useState<Record<string, Case[]>>({});
  const [depart, setDepart] = useState<Case | null>(null);
  const [indices, setIndices] = useState<string[]>([]);
  const [message, setMessage] = useState<Message>(null);
  const [demo, setDemo] = useState(false);
  const [valide, setValide] = useState(false);
  const clesTrouvees = Object.keys(trouves);
  const fini = aTrouver.every((m) => trouves[m.cle]);

  const couleurDe = (l: number, c: number): string | null => {
    for (const [i, m] of aTrouver.entries()) {
      if (trouves[m.cle]?.some(([x, y]) => x === l && y === c)) return COULEURS[i % COULEURS.length];
    }
    return null;
  };

  const toucher = (l: number, c: number) => {
    if (valide) return;
    if (!depart) {
      setDepart([l, c]);
      return;
    }
    const cases = ligneEntre(depart, [l, c]);
    setDepart(null);
    if (!cases || cases.length < 2) return;
    const mot = motLu(grille, cases, clesTrouvees);
    if (!mot) {
      setMessage({ type: "rate" });
    } else if (mot.piege) {
      setMessage({ type: "piege", mot });
    } else if (trouves[mot.cle]) {
      setMessage({ type: "deja", mot });
    } else {
      const nouveaux = { ...trouves, [mot.cle]: cases };
      setTrouves(nouveaux);
      const tout = aTrouver.every((m) => nouveaux[m.cle]);
      setMessage(tout ? { type: "tout" } : { type: "trouve", mot });
    }
  };

  /** "Vérifier ma grille": says how many words are left, or validates the level */
  const verifier = () => {
    if (!fini) {
      setMessage({ type: "reste", restants: aTrouver.filter((m) => !trouves[m.cle]).length });
      return;
    }
    if (valide) return;
    setValide(true);
    onEarnStars(GAIN[mode]);
    ecrireNiveauJeu("mots-meles", mode, niveau + 1);
  };

  const acheterIndice = () => {
    const restant = aTrouver.find((m) => !trouves[m.cle] && !indices.includes(m.cle));
    if (!restant || score < PRIX_INDICE) return;
    onSpendStars(PRIX_INDICE);
    setIndices((x) => [...x, restant.cle]);
  };

  const estIndice = (l: number, c: number) =>
    aTrouver.some((m) => indices.includes(m.cle) && !trouves[m.cle] && m.cases[0][0] === l && m.cases[0][1] === c);

  const suivant = () => {
    setNiveau((n) => n + 1);
    setCommence(false);
    setTrouves({});
    setIndices([]);
    setMessage(null);
    setDepart(null);
    setDemo(false);
    setValide(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <EnteteJeu titre={`🔤 Mots mêlés · niveau ${niveau}`} score={score} onClose={onClose} />
      <main className="flex-1 flex flex-col items-center p-4 gap-4 max-w-md mx-auto w-full pb-28">
        {!commence ? (
          <motion.div className="bg-card rounded-2xl p-6 shadow-md w-full mt-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl text-center mb-2">{grille.histoire.emoji}</div>
            <h2 className="text-xl font-extrabold text-foreground text-center">{grille.histoire.titre}</h2>
            <p className="text-xs text-primary font-bold text-center mb-3">📖 {grille.histoire.reference}</p>
            <p className="text-foreground">{grille.histoire.resume}</p>
            <p className="text-sm text-muted-foreground mt-3">
              Retrouve dans la grille les <strong>{aTrouver.length} mots</strong> de cette histoire.
              {grille.mots.some((m) => m.piege) && " Attention : des mots d'autres histoires s'y cachent aussi !"}
            </p>
            <div className="mt-4 bg-amber-100 border-2 border-amber-400 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold text-slate-900 leading-snug">
                👆 Touche la <span className="underline">première</span> lettre d'un mot, puis sa{" "}
                <span className="underline">dernière</span> lettre.
              </p>
              <p className="text-sm font-bold text-slate-800 mt-1">Quand tous les mots sont barrés, touche « Vérifier ma grille ».</p>
            </div>
            <div className="mt-3">
              <DemoMotsMeles />
            </div>
            <div className="mt-3">
              <VideoTuto youtubeId={VIDEO_MOTS_MELES} />
            </div>
            <button onClick={() => setCommence(true)} className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl mt-5">
              Commencer
            </button>
          </motion.div>
        ) : (
          <>
            <div
              className="grid gap-1 w-full select-none"
              style={{ gridTemplateColumns: `repeat(${grille.taille}, minmax(0, 1fr))` }}
            >
              {grille.lettres.map((ligne, l) =>
                ligne.map((lettre, c) => {
                  const couleur = couleurDe(l, c);
                  const choisi = depart && depart[0] === l && depart[1] === c;
                  return (
                    <button
                      key={`${l}-${c}`}
                      onClick={() => toucher(l, c)}
                      className={`aspect-square rounded-md font-extrabold flex items-center justify-center ${
                        grille.taille > 10 ? "text-xs" : grille.taille > 8 ? "text-sm" : "text-base sm:text-lg"
                      } ${choisi ? "bg-primary text-primary-foreground" : couleur ? `${couleur} text-slate-900` : estIndice(l, c) ? "bg-yellow-200 text-slate-900 ring-2 ring-yellow-500" : "bg-card text-foreground"}`}
                    >
                      {lettre}
                    </button>
                  );
                })
              )}
            </div>

            {message?.type === "trouve" && (
              <p className="text-sm text-foreground bg-secondary/15 rounded-xl px-3 py-2 w-full">
                ✅ <strong>{message.mot.mot}</strong> — <LienPassage reference={message.mot.reference} />
              </p>
            )}
            {message?.type === "tout" && (
              <p className="text-sm font-bold text-foreground bg-emerald-100 border border-emerald-400 rounded-xl px-3 py-2 w-full">
                🎉 Tu as trouvé tous les mots ! Touche « ✅ Vérifier ma grille » en bas pour passer au niveau suivant.
              </p>
            )}
            {message?.type === "deja" && (
              <p className="text-sm text-muted-foreground w-full">
                <strong>{message.mot.mot}</strong> est déjà trouvé. Cherche un autre mot de la liste !
              </p>
            )}
            {message?.type === "piege" && (
              <div className="text-sm text-foreground bg-accent/10 border border-accent/30 rounded-xl px-3 py-2 w-full">
                ⚠️ <strong>{message.mot.mot}</strong> n'est pas dans l'histoire de {grille.histoire.titre}. On le trouve dans{" "}
                <strong>{message.mot.histoire?.titre}</strong> : <LienPassage reference={message.mot.reference} />. Va le lire !
              </div>
            )}
            {message?.type === "rate" && (
              <p className="text-sm text-muted-foreground w-full">Ce n'est pas un mot de la liste. Essaie encore !</p>
            )}
            {message?.type === "reste" && (
              <p className="text-sm text-foreground bg-amber-100 border border-amber-400 rounded-xl px-3 py-2 w-full">
                Pas encore : il te reste <strong>{message.restants} mot{message.restants > 1 ? "s" : ""}</strong> à trouver.
                Les mots barrés dans la liste sont déjà trouvés.
              </p>
            )}

            <div className="flex flex-wrap gap-2 w-full">
              {aTrouver.map((m, i) => (
                <span
                  key={m.cle}
                  className={`text-sm font-bold px-2 py-1 rounded-lg ${
                    trouves[m.cle] ? `${COULEURS[i % COULEURS.length]} text-slate-900 line-through` : "bg-muted text-foreground"
                  }`}
                >
                  {m.mot}
                </span>
              ))}
            </div>
            <p className="text-xs font-bold text-muted-foreground w-full -mt-2">
              {clesTrouvees.filter((k) => aTrouver.some((m) => m.cle === k)).length} / {aTrouver.length} mots trouvés
            </p>

            {!fini && (
              <button
                onClick={() => setDemo((d) => !d)}
                className={`w-full text-sm font-extrabold px-4 py-3 rounded-xl border-2 ${
                  depart ? "bg-primary text-primary-foreground border-primary" : "bg-amber-100 text-slate-900 border-amber-400"
                }`}
                aria-expanded={demo}
              >
                {depart
                  ? "👉 Maintenant, touche la dernière lettre du mot"
                  : "👆 Touche la première lettre d'un mot, puis la dernière lettre pour le trouver"}
                <span className="block text-[11px] font-semibold opacity-80 mt-0.5">
                  {demo ? "Cacher l'exemple" : "Touche ici pour voir un exemple"}
                </span>
              </button>
            )}
            {!fini && demo && (
              <>
                <DemoMotsMeles />
                <VideoTuto youtubeId={VIDEO_MOTS_MELES} />
              </>
            )}
            {!fini && (
              <button
                onClick={acheterIndice}
                disabled={score < PRIX_INDICE}
                className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg disabled:opacity-40"
              >
                💡 Montrer la première lettre d'un mot ({PRIX_INDICE} ⭐)
              </button>
            )}
            <p className="text-[11px] text-muted-foreground">{MODES[mode].emoji} {MODES[mode].label}</p>

            {/* always within reach at the bottom of the screen */}
            {!valide && (
              <div className="fixed bottom-0 inset-x-0 z-20 p-3 bg-background/95 backdrop-blur-sm border-t border-border">
                <motion.button
                  onClick={verifier}
                  className={`w-full max-w-md mx-auto block font-extrabold py-3.5 rounded-xl text-lg shadow-lg ${
                    fini ? "bg-emerald-600 text-white" : "game-gradient text-primary-foreground"
                  }`}
                  animate={fini ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={fini ? { repeat: Infinity, duration: 1.2 } : undefined}
                >
                  ✅ Vérifier ma grille
                </motion.button>
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {valide && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card rounded-2xl p-5 shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              role="dialog"
              aria-label="Grille validée"
            >
              <p className="text-2xl font-extrabold text-foreground text-center">✅ Grille validée !</p>
              <p className="text-center text-foreground mt-1">
                Niveau {niveau} réussi : tous les mots sont trouvés. <strong>+{GAIN[mode]} ⭐</strong>
              </p>
              <p className="text-foreground italic mt-3">« {grille.histoire.verset.texte} »</p>
              <p className="text-xs text-muted-foreground">{grille.histoire.verset.reference} — Louis Segond 1910</p>
              <p className="text-sm font-bold text-foreground mt-3">Où lire chaque mot :</p>
              <ul className="text-sm text-foreground mt-1 space-y-0.5">
                {aTrouver.map((m) => (
                  <li key={m.cle}>
                    {m.mot} — <LienPassage reference={m.reference} />
                  </li>
                ))}
              </ul>
              <button onClick={suivant} className="w-full game-gradient text-primary-foreground font-extrabold py-3.5 rounded-xl mt-4 text-lg">
                Passer au niveau {niveau + 1} →
              </button>
              <button onClick={onClose} className="w-full text-sm font-bold text-muted-foreground mt-2 py-2">
                Retour au menu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MotsMelesGame;
