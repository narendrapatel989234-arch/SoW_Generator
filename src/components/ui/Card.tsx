import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`app-card ${className}`}>
      {title && (
        <div className="app-card__header">
          <div className="app-card__title">{title}</div>
        </div>
      )}
      <div className="app-card__body">
        {children}
      </div>
    </div>
  );
}
