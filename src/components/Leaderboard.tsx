import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCloudSave } from "@/hooks/useCloudSave";
import { MODES, MODES_ORDER, type ModeAge } from "@/lib/gameData";

interface LeaderboardEntry {
  score: number;
  level_reached: number;
  created_at: string;
  profiles: { display_name: string | null } | null;
}

interface LeaderboardProps {
  onClose: () => void;
  /** Category shown first: players are only compared with their own age group */
  mode: ModeAge;
}

const Leaderboard = ({ onClose, mode }: LeaderboardProps) => {
  const { getLeaderboard } = useCloudSave(undefined);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [categorie, setCategorie] = useState<ModeAge>(mode);

  useEffect(() => {
    getLeaderboard(categorie).then((rows) => setEntries(rows as unknown as LeaderboardEntry[]));
  }, [getLeaderboard, categorie]);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen px-4 py-8 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between w-full max-w-md">
        <button onClick={onClose} className="text-sm font-bold text-muted-foreground">← Retour</button>
        <h2 className="text-2xl font-black text-foreground">🏆 Classement</h2>
        <div className="w-16" />
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-md">
        {MODES_ORDER.map((m) => (
          <button
            key={m}
            onClick={() => setCategorie(m)}
            className={`rounded-xl px-1 py-2 text-xs font-extrabold border-2 ${
              categorie === m ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground"
            }`}
            aria-pressed={categorie === m}
          >
            {MODES[m].emoji} {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md space-y-2">
        {entries.length === 0 && (
          <p className="text-center text-muted-foreground font-semibold">Aucun score pour l'instant !</p>
        )}
        {entries.map((entry, i) => (
          <motion.div
            key={entry.created_at + i}
            className="flex items-center justify-between bg-card rounded-xl px-4 py-3 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-black w-8 text-center">
                {i < 3 ? medals[i] : `${i + 1}.`}
              </span>
              <div>
                <p className="font-bold text-foreground text-sm">
                  {entry.profiles?.display_name ?? "Joueur"}
                </p>
                <p className="text-xs text-muted-foreground">Niveau {entry.level_reached}</p>
              </div>
            </div>
            <span className="font-black text-game-gold">⭐ {entry.score}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;
