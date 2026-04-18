import { useState, useEffect, useCallback } from "react";
import MemoryCard from "./MemoryCard";
import { createCards, getLevelConfig, type GameCard } from "@/lib/gameData";

interface MemoryBoardProps {
  level: number;
  onComplete: (score: number) => void;
  onError: (livesLost: number) => void;
}

const MemoryBoard = ({ level, onComplete, onError }: MemoryBoardProps) => {
  const config = getLevelConfig(level);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setCards(createCards(config.pairs));
    setFlippedIds([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsChecking(false);
  }, [level, config.pairs]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking || flippedIds.length >= 2) return;

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)));

      if (newFlipped.length === 2) {
        setIsChecking(true);
        setMoves((m) => m + 1);
        const [firstId, secondId] = newFlipped;
        const first = cards.find((c) => c.id === firstId)!;
        const second = cards.find((c) => c.id === secondId)!;

        if (first.symbol === second.symbol) {
          // Match!
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
              )
            );
            setFlippedIds([]);
            setIsChecking(false);
            const newMatched = matchedPairs + 1;
            setMatchedPairs(newMatched);
            if (newMatched === config.pairs) {
              // Level complete — score based on efficiency
              const score = Math.max(10, config.pairs * 20 - moves * 2);
              setTimeout(() => onComplete(score), 500);
            }
          }, 400);
        } else {
          // No match
          onError(config.livesLostPerError);
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
              )
            );
            setFlippedIds([]);
            setIsChecking(false);
          }, 800);
        }
      }
    },
    [cards, flippedIds, isChecking, matchedPairs, config, moves, onComplete, onError]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-sm font-bold text-muted-foreground">
          Niveau {config.level} — {config.label}
        </span>
        <span className="text-sm font-semibold text-muted-foreground">
          {matchedPairs}/{config.pairs} paires
        </span>
      </div>
      <div
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${config.columns}, 1fr)` }}
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            symbol={card.symbol}
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
