import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, RotateCcw, Home, Target, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomResult {
  quiz_id: number;
  score: number;
  total: number;
  percentage: number;
}

interface CustomQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface CustomQuizData {
  summary: string;
  questions: CustomQuestion[];
}

const CustomResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, quizData, difficulty, answers } = location.state as {
    result: CustomResult;
    quizData: CustomQuizData;
    difficulty: string;
    answers: string[];
  };

  if (!result) {
    navigate('/custom');
    return null;
  }

  const percentage = Math.round(result.percentage);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-success';
    if (percentage >= 50) return 'text-primary';
    return 'text-destructive';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return { emoji: '🏆', text: 'Outstanding!' };
    if (percentage >= 80) return { emoji: '🌟', text: 'Excellent!' };
    if (percentage >= 70) return { emoji: '👏', text: 'Great Job!' };
    if (percentage >= 50) return { emoji: '💪', text: 'Good Effort!' };
    return { emoji: '📚', text: 'Keep Learning!' };
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="min-h-screen bg-background bg-halftone flex flex-col">
      {/* Hero Section */}
      <div className="relative pt-16 pb-8 px-6 text-center">
        {/* Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
        </div>

        {/* Trophy Icon */}
        <div className="relative z-10 mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary animate-pulse-glow">
            <Trophy className="text-primary" size={48} />
          </div>
        </div>

        {/* Score Display */}
        <div className="relative z-10">
          <p className="text-6xl mb-2">{scoreMessage.emoji}</p>
          <h1 className="text-4xl font-black text-foreground mb-2">{scoreMessage.text}</h1>
          <p className="text-muted-foreground mb-6">Custom Quiz • {difficulty}</p>

          <div className={`text-7xl font-black ${getScoreColor()} mb-2`}>{percentage}%</div>
          <p className="text-2xl font-bold text-foreground">
            {result.score}/{result.total} correct
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-8">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-4 text-center border-2 border-foreground/10">
            <CheckCircle className="text-green-success mx-auto mb-2" size={28} />
            <p className="text-2xl font-black text-foreground">{result.score}</p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border-2 border-foreground/10">
            <XCircle className="text-destructive mx-auto mb-2" size={28} />
            <p className="text-2xl font-black text-foreground">{result.total - result.score}</p>
            <p className="text-sm text-muted-foreground">Wrong</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border-2 border-foreground/10">
            <Target className="text-primary mx-auto mb-2" size={28} />
            <p className="text-2xl font-black text-foreground">{percentage}%</p>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Results Breakdown */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-foreground">Question Breakdown</h2>
          </div>

          <div className="bg-card rounded-3xl border-2 border-foreground/10 overflow-hidden">
            {quizData.questions.map((q, index) => {
              const isCorrect = answers[index] === q.answer;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 border-b border-foreground/10 last:border-b-0 ${
                    isCorrect ? 'bg-green-success/5' : 'bg-destructive/5'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-success/20' : 'bg-destructive/20'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="text-green-success" size={20} />
                    ) : (
                      <XCircle className="text-destructive" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCorrect ? 'text-foreground' : 'text-destructive'}`}>
                      Question {index + 1}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isCorrect ? 'Answered correctly' : `Correct: ${q.answer}`}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      isCorrect ? 'bg-green-success/20 text-green-success' : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {answers[index]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <footer className="p-6 border-t-2 border-foreground/10 bg-card/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')} className="flex-1 h-14 rounded-xl border-2">
            <Home size={20} className="mr-2" /> Home
          </Button>
          <Button
            onClick={() => navigate('/custom')}
            className="flex-1 h-14 rounded-xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <RotateCcw size={20} className="mr-2" /> New Quiz
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CustomResults;
