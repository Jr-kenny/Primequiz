import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizData, submitAnswers, isGenLayerConfigured, QuizResult } from '@/lib/genlayer';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressIndicator } from '@/components/ProgressIndicator';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizData, topic, difficulty } = location.state as {
    quizData: QuizData;
    topic: string;
    difficulty: string;
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(10).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  if (!quizData) {
    navigate('/setup');
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

  const allAnswered = answers.every(a => a !== null);

  const handleSubmit = async () => {
    if (!allAnswered) return;

    setIsSubmitting(true);
    setStatus('📝 Submitting your answers...');

    if (!isGenLayerConfigured()) {
      // Demo mode - calculate results locally
      let score = 0;
      const details: string[] = [];

      quizData.questions.forEach((q, i) => {
        const userAnswer = answers[i]!;
        if (userAnswer === q.correct_option) {
          score++;
          details.push(`Q${i + 1}: Correct`);
        } else {
          details.push(`Q${i + 1}: Wrong (Your: ${userAnswer}, Correct: ${q.correct_option})`);
        }
      });

      const result: QuizResult = {
        total_score: `${score}/10`,
        percentage: `${score * 10}%`,
        details,
      };

      navigate('/results', { state: { result, quizData, topic, difficulty, answers } });
      return;
    }

    const result = await submitAnswers(answers as string[], setStatus);

    if (result) {
      navigate('/results', { state: { result, quizData, topic, difficulty, answers } });
    } else {
      setStatus('❌ Failed to submit answers. Please try again.');
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="min-h-screen bg-background bg-halftone flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/study', { state: { quizData, topic, difficulty } })}
              className="rounded-full border-2 border-foreground/20"
              disabled={isSubmitting}
            >
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-xl font-black text-foreground">{topic}</h1>
              <p className="text-muted-foreground text-sm capitalize">{difficulty} difficulty</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">{currentQuestion + 1}/{quizData.questions.length}</p>
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
          <QuestionCard
            key={currentQuestion}
            question={quizData.questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            selectedAnswer={answers[currentQuestion]}
            onSelectAnswer={handleSelectAnswer}
          />

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
                className={`w-8 h-8 rounded-full border-2 font-bold text-sm transition-all ${i === currentQuestion
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
            <Button
              onClick={goToNext}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl"
            >
              Next <ChevronRight size={20} className="ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Quiz;
