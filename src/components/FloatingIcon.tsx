import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FloatingIconProps {
  icon: LucideIcon;
  className?: string;
  variant?: 'yellow' | 'pink' | 'blue' | 'green';
  size?: number;
}

const variantStyles = {
  yellow: 'bg-primary',
  pink: 'bg-secondary',
  blue: 'bg-accent',
  green: 'bg-green-success',
};

const iconColorStyles = {
  yellow: 'text-primary-foreground',
  pink: 'text-secondary-foreground',
  blue: 'text-accent-foreground',
  green: 'text-foreground',
};

export const FloatingIcon: React.FC<FloatingIconProps> = ({ 
  icon: Icon,
  className,
  variant = 'yellow',
  size = 32
}) => (
  <div 
    className={cn(
      "absolute z-30 p-3 rounded-2xl shadow-xl border-2 border-foreground",
      variantStyles[variant],
      className
    )}
  >
    <Icon className={cn(iconColorStyles[variant], variant === 'yellow' && 'fill-current')} size={size} />
  </div>
);
