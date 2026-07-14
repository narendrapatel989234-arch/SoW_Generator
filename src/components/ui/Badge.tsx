import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  tone?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  style?: React.CSSProperties;
}

export function Badge({ children, tone = 'neutral', style }: BadgeProps) {
  return (
    <span className="badge" data-tone={tone} style={style}>
      {children}
    </span>
  );
}
