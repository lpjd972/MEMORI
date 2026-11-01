import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  DUREE_EXTRAIT,
  LOUANGES,
  VIE_DE_LOUANGE,
  VIES_PAUSE_PSAUME,
  prochainePauseEstVieDeLouange,
} from "@/lib/louanges";
import { shuffleArray } from "@/lib/gameData";

interface LouangePauseProps {
  onClose: () => void;
  /** Given lives after a full 30-second psalm meditation (never for a YouTube song) */
  onEarnLives?: (amount: number) => void;
  /** Force the psalm even when songs are configured */
  psaumeSeulement?: boolean;
}

// Shown when no song is configured yet (or offline): a psalm to meditate on for 30 seconds
const PSAUMES = [
  { texte: "Je bénirai l'Éternel en tout temps; sa louange sera toujours dans ma bouche.", reference: "Psaume 34:2" },
  { texte: "Que tout ce qui respire loue l'Éternel! Louez l'Éternel!", reference: "Psaume 150:6" },
  { texte: "L'Éternel est mon berger: je ne manquerai de rien.", reference: "Psaume 23:1" },
];

/**
 * A 30-second worship break. With a YouTube song: plays an excerpt then stops it, with no reward
 * (YouTube forbids rewarding users for watching a video). With a psalm: lives are given at the end.
 */
const LouangePause = ({ onClose, onEarnLives, psaumeSeulement = false }: LouangePauseProps) => {
  const louange = useMemo(
    () => (!psaumeSeulement && LOUANGES.length > 0 ? shuffleArray(LOUANGES)[0] : null),
    [psaumeSeulement]
  );
  const psaume = useMemo(() => shuffleArray(PSAUMES)[0], []);
  // Every other song break presents the Vie de Louange website instead of a YouTube song
  const vitrine = useMemo(() => louange !== null && prochainePauseEstVieDeLouange(), [louange]);
  const [countdown, setCountdown] = useState(DUREE_EXTRAIT);
  const finished = countdown === 0;
  const rewarded = useRef(false);
  const recompense = !louange && onEarnLives ? VIES_PAUSE_PSAUME : 0;

  useEffect(() => {
    if (finished && recompense > 0 && !rewarded.current) {
      rewarded.current = true;
      onEarnLives?.(recompense);
    }
  }, [finished, recompense, onEarnLives]);

  useEffect(() => {
    if (finished) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, finished]);

  const debut = louange?.debut ?? 0;
  const embedUrl = louange
    ? `https://www.youtube-nocookie.com/embed/${louange.youtubeId}?autoplay=1&start=${debut}&end=${debut + DUREE_EXTRAIT}&rel=0&playsinline=1`
    : "";
  const watchUrl = louange ? `https://www.youtube.com/watch?v=${louange.youtubeId}&t=${debut}s` : "";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-xs uppercase tracking-widest font-bold text-white/60">🎵 Pause louange</span>
        <button onClick={onClose} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-bold">
          Fermer ✕
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 text-center">
        {vitrine && (
          <div className="max-w-sm flex flex-col items-center gap-4">
            <div className="text-6xl">🎶</div>
            <p className="text-2xl font-extrabold">{VIE_DE_LOUANGE.nom}</p>
            <p className="text-white/80">{VIE_DE_LOUANGE.accroche}</p>
            <a
              href={VIE_DE_LOUANGE.url}
              target="_blank"
              rel="noreferrer"
              className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-6 py-3 rounded-xl"
            >
              Visiter le site Vie de Louange
            </a>
            <button onClick={onClose} className="text-sm font-bold text-white/80 underline">
              Revenir au jeu
            </button>
          </div>
        )}

        {louange && !vitrine && !finished && (
          <iframe
            className="w-full max-w-xl aspect-video rounded-xl"
            src={embedUrl}
            title={louange.titre ?? "Chant de louange"}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}

        {vitrine ? null : louange ? (
          <div>
            <p className="text-lg font-extrabold">{louange.titre ?? "🎵 Chant de louange"}</p>
            {louange.chaine && <p className="text-sm text-white/70">{louange.chaine}</p>}
          </div>
        ) : (
          <div className="max-w-sm">
            <div className="text-5xl mb-4">🙌</div>
            <p className="text-xl font-bold italic">« {psaume.texte} »</p>
            <p className="text-sm text-white/60 mt-2">{psaume.reference} — Louis Segond 1910</p>
          </div>
        )}

        {vitrine ? null : finished ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-white/80 font-semibold">Merci pour ce moment de louange 🙏</p>
            {recompense > 0 && <p className="text-2xl font-extrabold">+{recompense} ❤️</p>}
            {louange && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl"
              >
                ▶ Écouter le chant en entier sur YouTube
              </a>
            )}
            {louange && (
              <a href={VIE_DE_LOUANGE.url} target="_blank" rel="noreferrer" className="text-sm text-amber-300 underline">
                🎶 Découvre aussi notre site {VIE_DE_LOUANGE.nom}
              </a>
            )}
            <button onClick={onClose} className="text-sm font-bold text-white/80 underline">
              Revenir au jeu
            </button>
          </div>
        ) : (
          <p className="text-sm text-white/60">
            Encore {countdown} s{recompense > 0 && ` · +${recompense} ❤️ à la fin`}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default LouangePause;
