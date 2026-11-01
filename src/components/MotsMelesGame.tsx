import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import EnteteJeu from "./EnteteJeu";
import { MODES, type ModeAge } from "@/lib/gameData";
import { creerGrille, ligneEntre, motSelectionne, type MotCache } from "@/lib/motsMeles";
import { ecrireNiveauJeu, lireNiveauJeu, PRIX_INDICE } from "@/lib/jeux";
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

type Message = { type: "trouve" | "piege" | "rate"; mot?: MotCache } | null;

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
  const [trouves, setTrouves] = useState<string[]>([]);
  const [depart, setDepart] = useState<[number, number] | null>(null);
  const [indices, setIndices] = useState<string[]>([]);
  const [message, setMessage] = useState<Message>(null);
  const fini = trouves.length === aTrouver.length;

  const couleurDe = (l: number, c: number): string | null => {
    for (const [i, m] of aTrouver.entries()) {
      if (trouves.includes(m.cle) && m.cases.some(([x, y]) => x === l && y === c)) return COULEURS[i % COULEURS.length];
    }
    return null;
  };

  const toucher = (l: number, c: number) => {
    if (fini) return;
    if (!depart) {
      setDepart([l, c]);
      return;
    }
    const cases = ligneEntre(depart, [l, c]);
    setDepart(null);
    if (!cases || cases.length < 2) return;
    const mot = motSelectionne(grille, cases);
    if (mot && !mot.piege && !trouves.includes(mot.cle)) {
      const nouveaux = [...trouves, mot.cle];
      setTrouves(nouveaux);
      setMessage({ type: "trouve", mot });
      if (nouveaux.length === aTrouver.length) {
        onEarnStars(GAIN[mode]);
        ecrireNiveauJeu("mots-meles", mode, niveau + 1);
      }
    } else if (mot?.piege) {
      setMessage({ type: "piege", mot });
    } else {
      setMessage({ type: "rate" });
    }
  };

  const acheterIndice = () => {
    const restant = aTrouver.find((m) => !trouves.includes(m.cle) && !indices.includes(m.cle));
    if (!restant || score < PRIX_INDICE) return;
    onSpendStars(PRIX_INDICE);
    setIndices((x) => [...x, restant.cle]);
  };

  const estIndice = (l: number, c: number) =>
    aTrouver.some((m) => indices.includes(m.cle) && !trouves.includes(m.cle) && m.cases[0][0] === l && m.cases[0][1] === c);

  const suivant = () => {
    setNiveau((n) => n + 1);
    setCommence(false);
    setTrouves([]);
    setIndices([]);
    setMessage(null);
    setDepart(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <EnteteJeu titre={`🔤 Mots mêlés · niveau ${niveau}`} score={score} onClose={onClose} />
      <main className="flex-1 flex flex-col items-center p-4 gap-4 max-w-md mx-auto w-full">
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
            <p className="text-xs text-muted-foreground mt-2">Touche la première lettre d'un mot, puis la dernière.</p>
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

            {message?.type === "trouve" && message.mot && (
              <p className="text-sm text-foreground bg-secondary/15 rounded-xl px-3 py-2 w-full">
                ✅ <strong>{message.mot.mot}</strong> — <LienPassage reference={message.mot.reference} />
              </p>
            )}
            {message?.type === "piege" && message.mot && (
              <div className="text-sm text-foreground bg-accent/10 border border-accent/30 rounded-xl px-3 py-2 w-full">
                ⚠️ <strong>{message.mot.mot}</strong> n'est pas dans l'histoire de {grille.histoire.titre}. On le trouve dans{" "}
                <strong>{message.mot.histoire?.titre}</strong> : <LienPassage reference={message.mot.reference} />. Va le lire !
              </div>
            )}
            {message?.type === "rate" && (
              <p className="text-sm text-muted-foreground w-full">Ce n'est pas un mot de la liste. Essaie encore !</p>
            )}

            <div className="flex flex-wrap gap-2 w-full">
              {aTrouver.map((m, i) => (
                <span
                  key={m.cle}
                  className={`text-sm font-bold px-2 py-1 rounded-lg ${
                    trouves.includes(m.cle) ? `${COULEURS[i % COULEURS.length]} text-slate-900 line-through` : "bg-muted text-foreground"
                  }`}
                >
                  {m.mot}
                </span>
              ))}
            </div>
            {!fini ? (
              <button
                onClick={acheterIndice}
                disabled={score < PRIX_INDICE}
                className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg disabled:opacity-40"
              >
                💡 Montrer la première lettre d'un mot ({PRIX_INDICE} ⭐)
              </button>
            ) : (
              <motion.div className="bg-card rounded-2xl p-5 shadow-md w-full" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <p className="text-xl font-extrabold text-foreground text-center">🎉 Grille terminée ! +{GAIN[mode]} ⭐</p>
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
                <button onClick={suivant} className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl mt-4">
                  Grille suivante →
                </button>
              </motion.div>
            )}
            <p className="text-[11px] text-muted-foreground">{MODES[mode].emoji} {MODES[mode].label}</p>
          </>
        )}
      </main>
    </div>
  );
};

export default MotsMelesGame;
