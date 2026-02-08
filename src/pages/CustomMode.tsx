import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, Brain, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { generateCustomQuiz, isGenLayerConfigured } from '@/lib/genlayer';

const difficultyLevels = [
  { id: 'easy', label: 'Easy', icon: Sparkles, description: 'Basic concepts' },
  { id: 'medium', label: 'Medium', icon: Zap, description: 'Intermediate' },
  { id: 'hard', label: 'Hard', icon: Brain, description: 'Advanced' },
];

const CustomMode = () => {
  const navigate = useNavigate();
  const [material, setMaterial] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!material.trim()) return;

    setIsGenerating(true);
    setStatus('⏳ Analyzing your material...');

    const result = await generateCustomQuiz(material, difficulty, setStatus);

    if (result) {
      navigate('/custom-quiz', {
        state: {
          quizData: result.quiz,
          quizId: result.quizId,
          difficulty,
          isCustom: true,
        },
      });
    } else {
      setStatus('❌ Failed to generate quiz. Please try again.');
      setIsGenerating(false);
    }
  };

  const canGenerate = material.trim().length > 50 && difficulty !== '';

  return (
    <div className="min-h-screen bg-background bg-halftone flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/setup')}
            className="rounded-full border-2 border-foreground/20"
            disabled={isGenerating}
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">Custom Mode</h1>
            <p className="text-muted-foreground">Paste your own study material</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Big Textarea with Traffic Light Design */}
          <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10">
            {/* Traffic Light Header */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            
            {/* Textarea */}
            <textarea
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder={`"Paste your study notes, article, or any text content here..."`}
              disabled={isGenerating}
              className="w-full min-h-[300px] bg-transparent text-white/90 placeholder:text-white/40 p-6 text-base leading-relaxed resize-none focus:outline-none disabled:opacity-50"
            />
            
            {/* Footer hint */}
            <div className="px-6 pb-4">
              <p className="text-white/30 text-sm">
                Press Enter to submit • Min 50 characters
              </p>
            </div>
          </div>

          {/* Character count */}
          <div className="flex justify-between text-sm">
            <span className={`${material.length >= 50 ? 'text-green-success' : 'text-muted-foreground'}`}>
              {material.length} characters {material.length < 50 && `(${50 - material.length} more needed)`}
            </span>
          </div>

          {/* Difficulty Selection */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="text-primary" size={20} />
              Select Difficulty
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {difficultyLevels.map((level) => {
                const Icon = level.icon;
                const isSelected = difficulty === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setDifficulty(level.id)}
                    disabled={isGenerating}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground scale-105 shadow-brutal'
                        : 'bg-card border-foreground/10 text-foreground hover:border-primary/50'
                    } disabled:opacity-50`}
                  >
                    <Icon className={`mx-auto mb-2 ${isSelected ? '' : 'text-primary'}`} size={24} />
                    <p className="font-bold">{level.label}</p>
                    <p className={`text-xs ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {level.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          {isGenerating && (
            <ProgressIndicator status={status} isLoading={true} />
          )}

          {/* Demo Mode Notice */}
          {!isGenLayerConfigured() && (
            <div className="p-4 bg-primary/10 border-2 border-primary/30 rounded-xl">
              <p className="text-sm text-primary font-medium">
                🎮 Demo Mode: Running without GenLayer. Quiz will be generated locally.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t-2 border-foreground/10 bg-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full h-14 rounded-xl text-lg font-bold shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:shadow-none"
          >
            {isGenerating ? 'Generating Quiz...' : 'Generate Quiz from Material'}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CustomMode;
