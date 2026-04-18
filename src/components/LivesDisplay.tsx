import { motion } from "framer-motion";

interface LivesDisplayProps {
  lives: number;
}

const LivesDisplay = ({ lives }: LivesDisplayProps) => {
  return (
    <motion.div
      className="flex items-center gap-1.5 bg-card rounded-full px-4 py-2 shadow-md"
      key={lives}
      animate={lives <= 10 ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <span className={`text-xl ${lives <= 10 ? "animate-pulse-heart" : ""}`}>❤️</span>
      <span className={`font-extrabold text-lg ${lives <= 10 ? "text-game-lives" : "text-foreground"}`}>
        {lives}
      </span>
    </motion.div>
  );
};

export default LivesDisplay;
