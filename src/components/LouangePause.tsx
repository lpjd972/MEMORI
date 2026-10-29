import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DUREE_EXTRAIT, LOUANGES } from "@/lib/louanges";
import { shuffleArray } from "@/lib/gameData";

interface LouangePauseProps {
  onClose: () => void;
}

// Shown when no song is configured yet (or offline): a psalm to meditate on for 30 seconds
const PSAUMES = [
  { texte: "Je bénirai l'Éternel en tout temps; sa louange sera toujours dans ma bouche.", reference: "Psaume 34:2" },
  { texte: "Que tout ce qui respire loue l'Éternel! Louez l'Éternel!", reference: "Psaume 150:6" },
  { texte: "L'Éternel est mon berger: je ne manquerai de rien.", reference: "Psaume 23:1" },
];

/**
 * A free 30-second worship break: plays an excerpt of a worship song from YouTube, then stops it.
 * No reward is attached (YouTube forbids rewarding users for watching a video).
 */
const LouangePause = ({ onClose }: LouangePauseProps) => {
  const louange = useMemo(() => (LOUANGES.length > 0 ? shuffleArray(LOUANGES)[0] : null), []);
  const psaume = useMemo(() => shuffleArray(PSAUMES)[0], []);
  const [countdown, setCountdown] = useState(DUREE_EXTRAIT);
  const finished = countdown === 0;

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
        {louange && !finished && (
          <iframe
            className="w-full max-w-xl aspect-video rounded-xl"
            src={embedUrl}
            title={louange.titre}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}

        {louange ? (
          <div>
            <p className="text-lg font-extrabold">{louange.titre}</p>
            <p className="text-sm text-white/70">{louange.chaine}</p>
          </div>
        ) : (
          <div className="max-w-sm">
            <div className="text-5xl mb-4">🙌</div>
            <p className="text-xl font-bold italic">« {psaume.texte} »</p>
            <p className="text-sm text-white/60 mt-2">{psaume.reference} — Louis Segond 1910</p>
          </div>
        )}

        {finished ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-white/80 font-semibold">Merci pour ce moment de louange 🙏</p>
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
            <button onClick={onClose} className="text-sm font-bold text-white/80 underline">
              Revenir au jeu
            </button>
          </div>
        ) : (
          <p className="text-sm text-white/60">Encore {countdown} s</p>
        )}
      </div>
    </motion.div>
  );
};

export default LouangePause;
