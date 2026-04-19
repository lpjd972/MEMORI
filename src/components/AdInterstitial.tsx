import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// Slot AdSense de type "Display" grand format (crée un 300x600 ou responsive dans AdSense)
const AD_SLOT_INTERSTITIAL = "5076044960";
const AD_DURATION = 30; // secondes — durée réaliste d'une pub rewarded
const SKIP_AFTER = 5;   // le bouton "Passer" apparaît après 5s (mais pas de récompense)

interface AdInterstitialProps {
  rewardLabel: string;    // ex: "5 vies", "1 indice"
  onRewarded: () => void; // appelé seulement si l'utilisateur regarde jusqu'au bout
  onClose: () => void;    // appelé si skip ou fermeture sans récompense
}

const AdInterstitial = ({ rewardLabel, onRewarded, onClose }: AdInterstitialProps) => {
  const [countdown, setCountdown] = useState(AD_DURATION);
  const [canSkip, setCanSkip] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    // Charge l'unité AdSense
    if (!pushed.current) {
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (_) {}
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRewarded(true);
          return 0;
        }
        if (prev === AD_DURATION - SKIP_AFTER + 1) setCanSkip(true);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (rewarded) {
      const timeout = setTimeout(() => {
        onRewarded();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [rewarded, onRewarded]);

  const skipAd = () => {
    onClose(); // pas de récompense si skip
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Bandeau supérieur */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/80 border-b border-white/10">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Publicité</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Récompense : <span className="text-white font-bold">{rewardLabel}</span>
          </span>
          <AnimatePresence>
            {canSkip && !rewarded ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={skipAd}
                className="text-xs text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-bold transition-colors"
              >
                Passer ✕
              </motion.button>
            ) : !rewarded ? (
              <span className="text-xs text-gray-500 bg-white/10 px-3 py-1 rounded-full font-bold">
                Passer dans {countdown - (AD_DURATION - SKIP_AFTER)}s
              </span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Zone publicitaire plein écran */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {rewarded ? (
            <motion.div
              key="rewarded"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="text-6xl">🎉</div>
              <p className="text-white text-2xl font-extrabold">Récompense débloquée !</p>
              <p className="text-gray-300 text-lg">{rewardLabel} ajouté(s)</p>
            </motion.div>
          ) : (
            <motion.div
              key="ad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              {/* Pub AdSense grande taille */}
              <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%", maxWidth: "728px", minHeight: "280px" }}
                data-ad-client="ca-pub-2237336875852898"
                data-ad-slot={AD_SLOT_INTERSTITIAL}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Barre de progression */}
      {!rewarded && (
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full bg-purple-500"
            initial={{ width: "100%" }}
            animate={{ width: `${(countdown / AD_DURATION) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      )}

      {/* Bandeau inférieur */}
      {!rewarded && (
        <div className="flex items-center justify-between px-4 py-2 bg-black/80 border-t border-white/10">
          <span className="text-xs text-gray-500">
            Regarde la pub entière pour obtenir ta récompense
          </span>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-purple-500 text-white text-xs font-extrabold"
              style={{
                background: `conic-gradient(#a855f7 ${((AD_DURATION - countdown) / AD_DURATION) * 360}deg, transparent 0deg)`,
              }}
            >
              {countdown}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdInterstitial;
