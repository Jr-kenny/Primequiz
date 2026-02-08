import React from 'react';
import { cn } from '@/lib/utils';
import { QuizQuestion } from '@/lib/genlayer';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showCorrect?: boolean;
  className?: string;
}

const optionLabels = ['A', 'B', 'C', 'D'] as const;

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  showCorrect = false,
  className
}) => {
  return (
    <div className={cn(
      "rounded-3xl p-6 bg-card border-2 border-foreground/10 shadow-brutal",
      "animate-slide-up",
      className
    )}>
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-black text-lg">{questionNumber}</span>
        </div>
        <h3 className="text-lg font-bold text-card-foreground leading-relaxed">
          {question.question}
        </h3>
      </div>

      <div className="grid gap-3">
        {optionLabels.map((label) => {
          const optionText = question.options[label];
          const isSelected = selectedAnswer === label;
          const isCorrect = showCorrect && label === question.correct_option;
          const isWrong = showCorrect && isSelected && label !== question.correct_option;

          return (
            <button
              key={label}
              onClick={() => !showCorrect && onSelectAnswer(label)}
              disabled={showCorrect}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                "flex items-center gap-4 group",
                !showCorrect && "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                isSelected && !showCorrect && "border-primary bg-primary/20",
                !isSelected && !showCorrect && "border-foreground/20 bg-card hover:border-primary/50",
                isCorrect && "border-green-success bg-green-success/20",
                isWrong && "border-destructive bg-destructive/20",
                showCorrect && "cursor-default"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors",
                isSelected && !showCorrect && "bg-primary border-primary text-primary-foreground",
                !isSelected && !showCorrect && "bg-muted border-foreground/20 text-muted-foreground group-hover:border-primary/50",
                isCorrect && "bg-green-success border-green-success text-foreground",
                isWrong && "bg-destructive border-destructive text-destructive-foreground"
              )}>
                {label}
              </div>
              <span className={cn(
                "flex-1 font-medium",
                isSelected && !showCorrect && "text-foreground",
                !isSelected && !showCorrect && "text-muted-foreground group-hover:text-foreground",
                isCorrect && "text-foreground",
                isWrong && "text-destructive-foreground"
              )}>
                {optionText}
              </span>
              {isCorrect && <span className="text-green-success font-bold">✓ Correct</span>}
              {isWrong && <span className="text-destructive font-bold">✗ Wrong</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
