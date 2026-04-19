import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdInterstitial from "./AdInterstitial";
import { useAdMob } from "@/hooks/useAdMob";

interface PubsTabProps {
  onEarnLives: (amount: number) => void;
  onEarnHint: () => void;
  onSkipLevel: () => void;
  onClose: () => void;
}

const AD_OPTIONS = [
  {
    id: "lives",
    icon: "❤️",
    label: "Gagner 5 vies",
    description: "Regarde une pub pour obtenir 5 vies supplémentaires",
    reward: "5 vies",
  },
  {
    id: "hint",
    icon: "💡",
    label: "Obtenir un indice",
    description: "Regarde une pub pour débloquer un indice gratuit",
    reward: "1 indice",
  },
  {
    id: "skip",
    icon: "⏭️",
    label: "Passer un niveau",
    description: "Regarde une pub pour avancer au niveau suivant",
    reward: "Skip niveau",
  },
];

const PubsTab = ({ onEarnLives, onEarnHint, onSkipLevel, onClose }: PubsTabProps) => {
  const [activeAd, setActiveAd] = useState<{ id: string; reward: string } | null>(null);
  const { isNative, showRewardedAd } = useAdMob();

  const grantReward = (id: string) => {
    if (id === "lives") onEarnLives(5);
    if (id === "hint") onEarnHint();
    if (id === "skip") onSkipLevel();
  };

  const handleWatchAd = (id: string, reward: string) => {
    if (isNative) {
      showRewardedAd(() => {
        grantReward(id);
      });
      return;
    }
    setActiveAd({ id, reward });
  };

  return (
    <>
      <AnimatePresence>
        {activeAd && (
          <AdInterstitial
            key="interstitial"
            rewardLabel={activeAd.reward}
            onRewarded={() => {
              grantReward(activeAd.id);
              setActiveAd(null);
              onClose();
            }}
            onClose={() => setActiveAd(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="min-h-screen flex flex-col bg-background"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
          <button
            onClick={onClose}
            className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-lg font-extrabold text-foreground">📺 PUBS</h1>
          <div className="w-12" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          <p className="text-muted-foreground text-center text-sm mb-4 max-w-sm">
            Regarde des publicités pour gagner des bonus ! Aucune pub ne sera affichée pendant le jeu.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            {AD_OPTIONS.map((opt) => (
              <motion.button
                key={opt.id}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors text-left"
                onClick={() => handleWatchAd(opt.id, opt.reward)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-3xl">{opt.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                  {opt.reward}
                </span>
              </motion.button>
            ))}
          </div>
        </main>
      </motion.div>
    </>
  );
};

export default PubsTab;
