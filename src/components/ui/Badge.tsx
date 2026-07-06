import React from 'react';

interface BadgeProps {
  tone?: 'neutral' | 'success' | 'danger' | 'warning' | 'info';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Badge({ tone = 'neutral', children, style }: BadgeProps) {
  return (
    <span className="badge" data-tone={tone} style={style}>
      {children}
    </span>
  );
}
