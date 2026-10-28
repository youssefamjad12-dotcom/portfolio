import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border-input bg-transparent text-foreground',
  };
  return (
    <span className={`${base} ${variants[variant]} ${className || ''}`} {...props} />
  );
}
