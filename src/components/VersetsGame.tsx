import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import EnteteJeu from "./EnteteJeu";
import { HISTOIRES } from "@/lib/bible/histoires";
import type { ModeAge } from "@/lib/gameData";
import { creerPuzzle } from "@/lib/versetsATrous";
import { ecrireNiveauJeu, lireNiveauJeu, PRIX_INDICE } from "@/lib/jeux";
import { passageAlire } from "@/lib/lienBible";

interface VersetsGameProps {
  mode: ModeAge;
  score: number;
  onSpendStars: (n: number) => void;
  onEarnStars: (n: number) => void;
  onClose: () => void;
}

const GAIN = 15;

/** Fill-in-the-blank verses (Louis Segond 1910); after a mistake, the player is sent to the passage */
const VersetsGame = ({ mode, score, onSpendStars, onEarnStars, onClose }: VersetsGameProps) => {
  const [niveau, setNiveau] = useState(() => lireNiveauJeu("versets", mode));
  const puzzle = useMemo(() => creerPuzzle(niveau, mode), [niveau, mode]);
  const histoire = HISTOIRES.find((h) => h.id === puzzle.verset.histoire);
  const [choix, setChoix] = useState<(string | null)[]>(() => puzzle.reponses.map(() => null));
  const [verifie, setVerifie] = useState(false);
  const [reussi, setReussi] = useState(false);
  const passage = passageAlire(puzzle.verset.reference);
  const remplis = choix.every((c) => c !== null);
  const utilises = choix.filter(Boolean) as string[];

  const choisirMot = (mot: string) => {
    if (reussi) return;
    const i = choix.findIndex((c) => c === null);
    if (i < 0) return;
    setVerifie(false);
    setChoix((c) => c.map((x, k) => (k === i ? mot : x)));
  };

  const viderTrou = (i: number) => {
    if (reussi) return;
    setVerifie(false);
    setChoix((c) => c.map((x, k) => (k === i ? null : x)));
  };

  const verifier = () => {
    setVerifie(true);
    if (choix.every((c, i) => c === puzzle.reponses[i])) {
      setReussi(true);
      onEarnStars(GAIN);
      ecrireNiveauJeu("versets", mode, niveau + 1);
    }
  };

  const acheterIndice = () => {
    const i = choix.findIndex((c, k) => c !== puzzle.reponses[k]);
    if (i < 0 || score < PRIX_INDICE) return;
    onSpendStars(PRIX_INDICE);
    setVerifie(false);
    setChoix((c) => c.map((x, k) => (k === i ? puzzle.reponses[k] : x === puzzle.reponses[i] ? null : x)));
  };

  const suivant = () => {
    const n = niveau + 1;
    setNiveau(n);
    setChoix(creerPuzzle(n, mode).reponses.map(() => null));
    setVerifie(false);
    setReussi(false);
  };

  // the puzzle is rebuilt by useMemo when the level changes: keep the slots in step with it
  const slots = choix.length === puzzle.reponses.length ? choix : puzzle.reponses.map(() => null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <EnteteJeu titre={`✍️ Versets à trous · niveau ${niveau}`} score={score} onClose={onClose} />
      <main className="flex-1 flex flex-col items-center p-4 gap-4 max-w-md mx-auto w-full">
        <div className="bg-card rounded-2xl p-5 shadow-md w-full mt-4">
          <p className="text-xs font-bold text-primary mb-3">
            {histoire?.emoji} {histoire?.titre} · {puzzle.verset.reference}
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            {puzzle.morceaux.map((m, k) =>
              m.trou < 0 ? (
                <span key={k}>{m.texte}</span>
              ) : (
                <button
                  key={k}
                  onClick={() => viderTrou(m.trou)}
                  className={`inline-block min-w-[4.5rem] mx-0.5 px-2 rounded-md border-b-2 font-bold ${
                    verifie && slots[m.trou] !== null
                      ? slots[m.trou] === puzzle.reponses[m.trou]
                        ? "bg-game-card-matched text-secondary-foreground border-secondary"
                        : "bg-game-card-wrong text-destructive-foreground border-destructive"
                      : slots[m.trou]
                        ? "bg-primary/15 text-primary border-primary"
                        : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {slots[m.trou] ?? "____"}
                </button>
              )
            )}
          </p>
          <p className="text-[11px] text-muted-foreground mt-3">Bible Louis Segond 1910 · touche un mot placé pour le retirer.</p>
        </div>

        {!reussi && (
          <div className="flex flex-wrap gap-2 justify-center w-full">
            {puzzle.banque.map((mot, k) => {
              const pris = utilises.filter((u) => u === mot).length >= puzzle.banque.filter((b) => b === mot).length;
              return (
                <button
                  key={`${mot}-${k}`}
                  onClick={() => choisirMot(mot)}
                  disabled={pris}
                  className="px-3 py-2 rounded-xl bg-card border border-border font-bold text-foreground shadow-sm disabled:opacity-30"
                >
                  {mot}
                </button>
              );
            })}
          </div>
        )}

        {verifie && !reussi && (
          <div className="w-full space-y-2">
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 text-sm text-foreground">
              ❌ Pas tout à fait. Ouvre ta Bible à <strong>{puzzle.verset.reference}</strong> : relis le verset et tout le
              chapitre pour retrouver les bons mots.
            </div>
            {passage && (
              <a
                href={passage.url}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-xl"
              >
                📖 Lire {passage.chapitre} (Louis Segond)
              </a>
            )}
          </div>
        )}

        {reussi ? (
          <motion.div className="bg-card rounded-2xl p-5 shadow-md w-full text-center" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <p className="text-xl font-extrabold text-foreground">🎉 Bravo ! +{GAIN} ⭐</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tu connais {puzzle.verset.reference}. {histoire && `Pour aller plus loin, lis ${histoire.reference}.`}
            </p>
            <button onClick={suivant} className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl mt-4">
              Verset suivant →
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <button
              onClick={verifier}
              disabled={!remplis}
              className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl disabled:opacity-40"
            >
              Vérifier
            </button>
            <button
              onClick={acheterIndice}
              disabled={score < PRIX_INDICE}
              className="text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg disabled:opacity-40"
            >
              💡 Placer un bon mot ({PRIX_INDICE} ⭐)
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default VersetsGame;
