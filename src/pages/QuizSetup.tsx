import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, BookOpen, Brain, Flame, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateQuiz, QuizData, isGenLayerConfigured } from '@/lib/genlayer';
import { ProgressIndicator } from '@/components/ProgressIndicator';

const difficulties = [
  { id: 'easy', label: 'Easy', icon: BookOpen, description: 'Perfect honestly' },
  { id: 'mid', label: 'Medium', icon: Brain, description: 'A balanced challenge' },
  { id: 'hard', label: 'Hard', icon: Flame, description: 'Are you sure?' },
];

const QuizSetup = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleStartQuiz = async () => {
    if (!topic || !difficulty) return;

    if (!isGenLayerConfigured()) {
      // Demo mode - use mock data
      const mockQuiz: QuizData = {
        study_material: `Welcome to your ${topic} quiz! This is demo mode. Connect your GenLayer key to generate real AI-powered quizzes. For now, here's some placeholder content about ${topic} at ${difficulty} difficulty.`,
        questions: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          question: `Sample question ${i + 1} about ${topic}?`,
          options: {
            A: `Option A for question ${i + 1}`,
            B: `Option B for question ${i + 1}`,
            C: `Option C for question ${i + 1}`,
            D: `Option D for question ${i + 1}`,
          },
          correct_option: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        })),
      };
      
      navigate('/study', { state: { quizData: mockQuiz, topic, difficulty } });
      return;
    }

    setIsLoading(true);
    setStatus('🚀 Initializing...');

    const quizData = await generateQuiz(topic, difficulty, setStatus);

    if (quizData) {
      navigate('/study', { state: { quizData, topic, difficulty } });
    } else {
      setStatus('❌ Failed to generate quiz. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-halftone flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="rounded-full border-2 border-foreground/20"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-black text-foreground">Create Your Quiz</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Topic Input */}
          <div className="space-y-3">
            <label className="text-lg font-bold text-foreground">What do you want to learn?</label>
            <Input
              type="text"
              placeholder="e.g., Ancient Rome, Quantum Physics, JavaScript..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
              className="h-16 text-lg rounded-2xl border-2 border-foreground/20 bg-card/50 backdrop-blur-sm focus:border-primary placeholder:text-muted-foreground"
            />
            
            {/* Custom Mode Link - Right under topic input */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/custom')}
                className="text-primary font-medium hover:underline"
              >
                Or use Custom Mode →
              </button>
              <p className="text-xs text-muted-foreground mt-1">
                Submit your own study material
              </p>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-lg font-bold text-foreground">Select Difficulty</label>
            <div className="grid gap-4">
              {difficulties.map((diff) => {
                const Icon = diff.icon;
                const isSelected = difficulty === diff.id;
                
                return (
                  <button
                    key={diff.id}
                    onClick={() => !isLoading && setDifficulty(diff.id)}
                    disabled={isLoading}
                    className={`
                      p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-200
                      ${isSelected 
                        ? 'border-primary bg-primary/20 shadow-brutal-yellow' 
                        : 'border-foreground/20 bg-card/50 hover:border-primary/50 hover:scale-[1.02]'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center border-2
                      ${isSelected 
                        ? 'bg-primary border-primary-foreground' 
                        : 'bg-muted border-foreground/20'
                      }
                    `}>
                      <Icon size={28} className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-lg ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {diff.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{diff.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <ChevronRight className="text-primary-foreground" size={20} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Indicator */}
          {isLoading && (
            <ProgressIndicator status={status} isLoading={true} />
          )}

          {/* Start Button */}
          <Button
            onClick={handleStartQuiz}
            disabled={!topic || !difficulty || isLoading}
            className="w-full h-16 text-xl font-bold rounded-2xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
          >
            {isLoading ? 'Generating...' : 'Generate Quiz'} 
            <Zap className="ml-3" size={28} />
          </Button>

          {!isGenLayerConfigured() && (
            <p className="text-center text-muted-foreground text-sm">
              ⚠️ Demo mode: Add VITE_GENLAYER_KEY for AI-powered quizzes
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizSetup;
