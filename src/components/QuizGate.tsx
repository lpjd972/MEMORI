import { useState } from "react";
import { motion } from "framer-motion";
import type { QuizQuestion } from "@/lib/gameData";

interface QuizGateProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

const QuizGate = ({ question, onAnswer }: QuizGateProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const correct = index === question.correctIndex;
    setTimeout(() => onAnswer(correct), 1200);
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-card rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-6">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option, i) => {
            let style = "bg-game-surface text-foreground border-2 border-transparent";
            if (answered && i === question.correctIndex) {
              style = "bg-game-card-matched text-secondary-foreground border-2 border-secondary";
            } else if (answered && i === selected && i !== question.correctIndex) {
              style = "bg-game-card-wrong text-destructive-foreground border-2 border-destructive animate-shake";
            }

            return (
              <motion.button
                key={i}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${style}`}
                onClick={() => handleSelect(i)}
                disabled={answered}
                whileTap={!answered ? { scale: 0.97 } : {}}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default QuizGate;
