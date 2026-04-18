import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";

interface HomeScreenProps {
  onStart: () => void;
  user?: User | null;
  profile?: { display_name: string | null; is_premium: boolean } | null;
  onAuthClick?: () => void;
  onSignOut?: () => void;
  onLeaderboard?: () => void;
}

const HomeScreen = ({ onStart, user, profile, onAuthClick, onSignOut, onLeaderboard }: HomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-8">
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-7xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          🧠
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Memori
        </h1>
        <p className="text-lg font-bold text-primary">Ultime</p>
      </motion.div>

      {user && profile && (
        <motion.div
          className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-lg">👋</span>
          <span className="font-bold text-foreground text-sm">{profile.display_name ?? "Joueur"}</span>
          {profile.is_premium && <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">Premium ⭐</span>}
        </motion.div>
      )}

      <motion.p
        className="text-center text-muted-foreground font-semibold max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Entraîne ta mémoire chaque jour.
        <br />
        Simple à jouer. Difficile à maîtriser.
      </motion.p>

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
          ▶ Jouer
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
            🔐 Se connecter
          </motion.button>
        )}

        {user && onSignOut && (
          <button
            onClick={onSignOut}
            className="text-xs text-muted-foreground font-semibold mt-2"
          >
            Déconnexion
          </button>
        )}
      </motion.div>

      <motion.div
        className="flex items-center gap-6 text-muted-foreground text-sm font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-1">
          <span>❤️</span> 50 vies
        </div>
        <div className="flex items-center gap-1">
          <span>📈</span> 10 niveaux
        </div>
        <div className="flex items-center gap-1">
          <span>🧩</span> Quiz + Énigmes
        </div>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
