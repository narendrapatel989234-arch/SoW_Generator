import React from 'react';

interface BadgeProps {
  tone?: 'neutral' | 'success' | 'danger' | 'warning' | 'info';
  children: React.ReactNode;
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span className="badge" data-tone={tone}>
      {children}
    </span>
  );
}
