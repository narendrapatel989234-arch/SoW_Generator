import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
}

export function Button({ variant = 'default', className = '', children, ...props }: ButtonProps) {
  let btnClass = 'app-button';
  if (variant !== 'default') {
    btnClass += ` app-button--${variant}`;
  }
  if (className) {
    btnClass += ` ${className}`;
  }
  return (
    <button className={btnClass} {...props}>
      {children}
    </button>
  );
}
