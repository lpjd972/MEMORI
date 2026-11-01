import { useState, useEffect, useCallback, useRef } from "react";
import MemoryCard from "./MemoryCard";
import { createCards, getLevelConfig, type GameCard, type ModeAge } from "@/lib/gameData";

interface MemoryBoardProps {
  level: number;
  mode: ModeAge;
  onComplete: (score: number) => void;
  onError: (livesLost: number) => void;
}

const MemoryBoard = ({ level, mode, onComplete, onError }: MemoryBoardProps) => {
  const config = getLevelConfig(level, mode);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  // Refs avoid double-flips when two cards are tapped faster than React re-renders
  const flippedRef = useRef<number[]>([]);
  const movesRef = useRef(0);

  useEffect(() => {
    setCards(createCards(level, mode));
    flippedRef.current = [];
    movesRef.current = 0;
    setMatchedPairs(0);
    setIsChecking(false);
  }, [level, mode]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking || flippedRef.current.length >= 2 || flippedRef.current.includes(id)) return;

      const newFlipped = [...flippedRef.current, id];
      flippedRef.current = newFlipped;
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)));

      if (newFlipped.length < 2) return;

      setIsChecking(true);
      movesRef.current += 1;
      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId)!;
      const second = cards.find((c) => c.id === secondId)!;

      if (first.key === second.key) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
          );
          flippedRef.current = [];
          setIsChecking(false);
          const newMatched = matchedPairs + 1;
          setMatchedPairs(newMatched);
          if (newMatched === config.pairs) {
            // Level complete — score based on efficiency
            const score = Math.max(10, config.pairs * 20 - movesRef.current * 2);
            setTimeout(() => onComplete(score), 500);
          }
        }, 400);
      } else {
        onError(config.livesLostPerError);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
          );
          flippedRef.current = [];
          setIsChecking(false);
        }, mode === "petits" ? 1200 : 800);
      }
    },
    [cards, isChecking, matchedPairs, config, mode, onComplete, onError]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-start justify-between gap-3 mb-1 px-1">
        <span className="text-sm font-bold text-foreground">
          Niveau {config.level} — {config.label}
        </span>
        <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
          {matchedPairs}/{config.pairs} paires
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4 px-1">
        📖 {config.histoire.reference}
        {config.tour > 1 && <span className="ml-2 font-bold text-accent">· Tour {config.tour}</span>}
      </p>
      <div
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))` }}
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            emoji={card.emoji}
            mot={card.mot}
            mode={mode}
            columns={config.columns}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(card.id)}
            disabled={isChecking}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryBoard;
