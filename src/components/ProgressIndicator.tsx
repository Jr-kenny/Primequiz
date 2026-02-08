import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  status: string;
  isLoading?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  status,
  isLoading = false,
  className
}) => {
  const getStatusIcon = () => {
    if (status.startsWith('✅')) return '✅';
    if (status.startsWith('❌')) return '❌';
    if (status.startsWith('⏳') || status.startsWith('⚠️')) return '⏳';
    return '🔄';
  };

  return (
    <div className={cn(
      "rounded-2xl p-4 border-2 border-foreground/20 bg-card/50 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getStatusIcon()}</span>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{status}</p>
          {isLoading && (
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-progress-pulse rounded-full w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
