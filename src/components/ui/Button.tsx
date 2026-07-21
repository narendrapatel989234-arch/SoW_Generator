import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    let btnClass = 'app-button';
    if (variant !== 'default') {
      btnClass += ` app-button--${variant}`;
    }
    if (className) {
      btnClass += ` ${className}`;
    }
    return (
      <button ref={ref} className={btnClass} {...props}>
        {children}
      </button>
    );
  }
);
