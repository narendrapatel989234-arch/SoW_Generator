import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  className?: string;
  children: React.ReactNode;
}

export function IconButton({ label, className = '', children, ...props }: IconButtonProps) {
  return (
    <button 
      className={`icon-button ${className}`} 
      aria-label={label} 
      title={label}
      {...props}
    >
      {children}
    </button>
  );
}
