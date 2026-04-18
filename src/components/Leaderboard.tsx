import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCloudSave } from "@/hooks/useCloudSave";

interface LeaderboardProps {
  onClose: () => void;
}

const Leaderboard = ({ onClose }: LeaderboardProps) => {
  const { getLeaderboard } = useCloudSave(undefined);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    getLeaderboard().then(setEntries);
  }, [getLeaderboard]);

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
                  {(entry.profiles as any)?.display_name ?? "Joueur"}
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
