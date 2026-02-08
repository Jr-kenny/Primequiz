import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Grading is done locally since quiz data includes answers
import { ProgressIndicator } from '@/components/ProgressIndicator';

interface CustomQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface CustomQuizData {
  summary: string;
  questions: CustomQuestion[];
}

const CustomQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizData, quizId, difficulty } = location.state as {
    quizData: CustomQuizData;
    quizId: number;
    difficulty: string;
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(quizData.questions.length).fill(null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  if (!quizData) {
    navigate('/custom');
    return null;
  }

  const handleSelectAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const allAnswered = answers.every((a) => a !== null);

  const handleSubmit = async () => {
    if (!allAnswered) return;

    setIsSubmitting(true);
    setStatus('📝 Grading your answers...');

    // Grade locally since quiz data already contains answers
    let score = 0;
    quizData.questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    navigate('/custom-results', {
      state: {
        result: {
          quiz_id: quizId,
          score,
          total: quizData.questions.length,
          percentage: (score / quizData.questions.length) * 100,
        },
        quizData,
        difficulty,
        answers,
      },
    });
  };

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="min-h-screen bg-background bg-halftone flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/custom')}
              className="rounded-full border-2 border-foreground/20"
              disabled={isSubmitting}
            >
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-xl font-black text-foreground">Custom Quiz</h1>
              <p className="text-muted-foreground text-sm capitalize">{difficulty} difficulty</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">
              {currentQuestion + 1}/{quizData.questions.length}
            </p>
            <p className="text-muted-foreground text-sm">{answeredCount} answered</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-3xl p-6 border-2 border-foreground/10 shadow-brutal">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black">
                {currentQuestion + 1}
              </span>
              <span className="text-sm text-muted-foreground">Question</span>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = answers[currentQuestion] === option;
                const letter = String.fromCharCode(65 + index);
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={isSubmitting}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-background border-foreground/10 text-foreground hover:border-primary/50'
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isSelected ? 'bg-primary-foreground text-primary' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-medium">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          {isSubmitting && (
            <div className="mt-6">
              <ProgressIndicator status={status} isLoading={true} />
            </div>
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="p-6 border-t-2 border-foreground/10 bg-card/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={goToPrev}
            disabled={currentQuestion === 0 || isSubmitting}
            className="px-6 py-3 rounded-xl border-2"
          >
            <ChevronLeft size={20} className="mr-2" /> Previous
          </Button>

          {/* Question Dots */}
          <div className="flex gap-2 flex-wrap justify-center">
            {quizData.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => !isSubmitting && setCurrentQuestion(i)}
                disabled={isSubmitting}
                className={`w-8 h-8 rounded-full border-2 font-bold text-sm transition-all ${
                  i === currentQuestion
                    ? 'bg-primary border-primary text-primary-foreground scale-110'
                    : answers[i]
                    ? 'bg-green-success/20 border-green-success text-green-success'
                    : 'bg-muted border-foreground/20 text-muted-foreground hover:border-primary/50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quizData.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="px-6 py-3 rounded-xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:shadow-none"
            >
              Submit <Send size={20} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={goToNext} disabled={isSubmitting} className="px-6 py-3 rounded-xl">
              Next <ChevronRight size={20} className="ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CustomQuiz;
