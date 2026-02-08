import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizData } from '@/lib/genlayer';

const StudyMaterial = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizData, topic, difficulty } = location.state as { 
    quizData: QuizData; 
    topic: string; 
    difficulty: string;
  };

  if (!quizData) {
    navigate('/setup');
    return null;
  }

  return (
    <div className="min-h-screen bg-background bg-halftone flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/setup')}
            className="rounded-full border-2 border-foreground/20"
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">Study Material</h1>
            <p className="text-muted-foreground text-sm">{topic} • {difficulty}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full border-2 border-primary">
          <BookOpen className="text-primary" size={20} />
          <span className="font-bold text-primary">Read & Learn</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Study Card */}
          <div className="bg-card rounded-3xl p-8 border-2 border-foreground/10 shadow-brutal mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground">Study materials</h2>
                <p className="text-muted-foreground text-sm">Review this material before starting the quiz</p>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-card-foreground leading-relaxed text-lg">
                {quizData.study_material}
              </p>
            </div>
          </div>

          {/* Quiz Preview */}
          <div className="bg-card/50 rounded-2xl p-6 border-2 border-foreground/10 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">Ready to test your knowledge?</h3>
                <p className="text-muted-foreground text-sm">
                  {quizData.questions.length} questions await you
                </p>
              </div>
              <div className="text-4xl font-black text-primary">{quizData.questions.length}</div>
            </div>
          </div>

          {/* Start Quiz Button */}
          <Button
            onClick={() => navigate('/quiz', { state: { quizData, topic, difficulty } })}
            className="w-full h-16 text-xl font-bold rounded-2xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Start Quiz <ArrowRight className="ml-3" size={28} />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default StudyMaterial;
