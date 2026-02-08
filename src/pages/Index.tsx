import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, DollarSign } from 'lucide-react';

// --- Prime Quiz Logo Component (for header) ---
const PrimeQuizLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Icon: Abstract Isles / 'P' Shape */}
    <path d="M40 80C40 57.9086 57.9086 40 80 40H90V80H40Z" fill="white" />
    <path d="M60 90C60 78.9543 68.9543 70 80 70H110V90C110 101.046 101.046 110 90 110H60V90Z" fill="white" style={{ opacity: 0.8 }} />

    {/* Typography */}
    <text x="130" y="75" fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="38" fill="white">PRIME</text>
    <text x="130" y="105" fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" fontWeight="300" fontSize="28" letterSpacing="0.15em" fill="white">QUIZ</text>
  </svg>
);

// --- Custom Styles ---
const halftoneBackground = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1.5px)',
  backgroundSize: '24px 24px',
};

// --- Sub-Components ---
const FloatingIcon = ({ children, className, color = "bg-yellow-400" }: { children: React.ReactNode; className?: string; color?: string }) => (
  <div className={`absolute z-30 p-3 rounded-2xl shadow-xl transform border-2 border-white ${color} ${className || ''}`}>
    {children}
  </div>
);

// --- Main Page ---
const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#6D28D9] overflow-hidden relative flex flex-col items-center justify-center p-6 sm:p-10 select-none font-sans" style={halftoneBackground}>

      {/* Header Logo - Top of page */}
      <div className="absolute top-4 left-6 sm:top-6 sm:left-10 z-50">
        <PrimeQuizLogo className="w-32 sm:w-40" />
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-[#7C3AED] rounded-full blur-[120px] opacity-40 -z-10"></div>

      {/* Title Section */}
      <div className="absolute top-24 left-6 sm:top-32 sm:left-16 z-50">
        <div className="relative font-black italic text-4xl sm:text-6xl text-yellow-400 transform -rotate-2" style={{ textShadow: '6px 6px 0px #000' }}>
          QUIZ!?
        </div>
        <h1 className="text-white text-3xl sm:text-5xl font-black mt-4 uppercase tracking-tight leading-tight">
          Challenge Your<br />
          <span className="text-yellow-400">Intellect</span>
        </h1>

        {/* Start Quiz Button */}
        <button
          onClick={() => navigate('/setup')}
          className="mt-6 sm:mt-8 bg-yellow-400 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-base sm:text-lg border-4 border-black shadow-[4px_4px_0_0_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          Start Quiz →
        </button>
      </div>

      {/* Floating 3D Icons */}
      <FloatingIcon className="hidden sm:block top-[15%] right-[20%] -rotate-12 animate-bounce" color="bg-pink-500">
        <Trophy className="text-white" size={32} />
      </FloatingIcon>
      <FloatingIcon className="hidden sm:block bottom-[20%] left-[15%] rotate-12" color="bg-blue-500">
        <DollarSign className="text-white" size={32} />
      </FloatingIcon>
      <FloatingIcon className="hidden sm:block bottom-[10%] right-[30%] -rotate-6" color="bg-yellow-400">
        <Star className="text-black fill-current" size={32} />
      </FloatingIcon>

      {/* Footer Label */}
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-16">
        <p className="text-white/40 font-mono text-xs sm:text-sm tracking-widest uppercase">© 2026 Prime Isles</p>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-20px) rotate(-12deg); }
          100% { transform: translateY(0px) rotate(-12deg); }
        }
        .animate-bounce {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;
