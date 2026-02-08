import React from 'react';
import { cn } from '@/lib/utils';

interface ScreenFrameProps {
  children: React.ReactNode;
  className?: string;
  rotation?: string;
}

export const ScreenFrame: React.FC<ScreenFrameProps> = ({ 
  children, 
  className,
  rotation = "0deg" 
}) => (
  <div 
    className={cn(
      "w-[260px] h-[540px] rounded-[45px] p-2 relative border-[6px] border-foreground/10 flex-shrink-0 bg-foreground/5",
      className
    )}
    style={{ 
      transform: `rotate(${rotation})`, 
      boxShadow: '20px 20px 50px rgba(0,0,0,0.5)' 
    }}
  >
    <div className="w-full h-full bg-violet-light rounded-[38px] overflow-hidden relative border border-foreground/10">
      {children}
    </div>
  </div>
);
