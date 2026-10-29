import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { MODES, MODES_ORDER, STATS, getLevelConfig, type ModeAge } from "@/lib/gameData";
import { INITIAL_LIVES } from "@/hooks/useGameState";

interface HomeScreenProps {
  onStart: () => void;
  mode: ModeAge;
  onModeChange: (mode: ModeAge) => void;
  currentLevel: number;
  onRestart: () => void;
  onBonus: () => void;
  user?: User | null;
  profile?: { display_name: string | null; is_premium: boolean } | null;
  onAuthClick?: () => void;
  onSignOut?: () => void;
  onLeaderboard?: () => void;
}

const HomeScreen = ({
  onStart,
  mode,
  onModeChange,
  currentLevel,
  onRestart,
  onBonus,
  user,
  profile,
  onAuthClick,
  onSignOut,
  onLeaderboard,
}: HomeScreenProps) => {
  const current = getLevelConfig(currentLevel, mode);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 gap-6">
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-7xl"
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          📖
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">Memory Bible</h1>
        <p className="text-base font-bold text-primary text-center">La Parole de Dieu, de la Genèse à l'Apocalypse</p>
      </motion.div>

      {user && profile && (
        <motion.div
          className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-lg">👋</span>
          <span className="font-bold text-foreground text-sm">{profile.display_name ?? "Joueur"}</span>
          {profile.is_premium && (
            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">Premium ⭐</span>
          )}
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-bold text-muted-foreground mb-2 text-center">Qui joue ?</p>
        <div className="grid grid-cols-3 gap-2">
          {MODES_ORDER.map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 border-2 transition-colors ${
                mode === m ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
              aria-pressed={mode === m}
            >
              <span className="text-2xl">{MODES[m].emoji}</span>
              <span className="text-xs font-extrabold text-foreground leading-tight text-center">{MODES[m].label}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{MODES[m].ages}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">{MODES[mode].description}</p>
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="w-full game-gradient text-primary-foreground font-extrabold py-4 rounded-xl shadow-lg text-lg"
          onClick={onStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ▶ {currentLevel > 1 ? `Continuer · niveau ${currentLevel}` : "Jouer"}
        </motion.button>
        {currentLevel > 1 && <p className="text-xs text-muted-foreground -mt-1">{current.label}</p>}

        <motion.button
          className="w-full bg-card text-foreground font-bold py-3 rounded-xl shadow-sm border border-border"
          onClick={onBonus}
          whileTap={{ scale: 0.97 }}
        >
          🎁 Bonus : Défi de la Parole & louange
        </motion.button>

        {onLeaderboard && (
          <motion.button
            className="w-full bg-card text-foreground font-bold py-3 rounded-xl shadow-sm border border-border"
            onClick={onLeaderboard}
            whileTap={{ scale: 0.97 }}
          >
            🏆 Classement
          </motion.button>
        )}

        {!user && onAuthClick && (
          <motion.button
            className="w-full bg-muted text-foreground font-bold py-3 rounded-xl"
            onClick={onAuthClick}
            whileTap={{ scale: 0.97 }}
          >
            🔐 Se connecter (facultatif)
          </motion.button>
        )}

        <div className="flex items-center gap-4 mt-1">
          {currentLevel > 1 && (
            <button onClick={onRestart} className="text-xs text-muted-foreground font-semibold underline">
              Recommencer depuis la Genèse
            </button>
          )}
          {user && onSignOut && (
            <button onClick={onSignOut} className="text-xs text-muted-foreground font-semibold">
              Déconnexion
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-muted-foreground text-sm font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span>❤️ {INITIAL_LIVES} vies</span>
        <span>📜 {STATS.histoires} histoires</span>
        <span>❓ {STATS.questions} questions</span>
      </motion.div>
      <p className="text-[11px] text-muted-foreground text-center max-w-xs -mt-3">
        Versets cités : Bible Louis Segond 1910 ·{" "}
        <a href="/privacy" className="underline">
          Confidentialité
        </a>
      </p>
    </div>
  );
};

export default HomeScreen;
