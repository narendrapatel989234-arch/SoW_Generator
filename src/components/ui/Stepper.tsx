import React from 'react';
import { Icon } from './Icon';

export interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStepId: string;
  className?: string;
}

export function Stepper({ steps, currentStepId, className = '' }: StepperProps) {
  // Hidden temporarily as requested
  return null;
  
  const currentIndex = steps.findIndex(s => s.id === currentStepId);
  return (
    <div className={`enterprise-stepper ${className}`} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      width: 'max-content',
      margin: '0 auto 32px auto',
      padding: '8px 16px',
      justifyContent: 'center'
    }}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isLast = index === steps.length - 1;
        
        return (
          <React.Fragment key={step.id}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0
            }}>
              {/* Step Indicator */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: isActive ? 700 : 600,
                fontSize: '14px',
                backgroundColor: isCompleted ? 'var(--app-color-accent)' : isActive ? 'var(--app-color-primary)' : 'var(--app-color-surface)',
                color: isCompleted || isActive ? '#fff' : 'var(--app-color-text-muted)',
                border: isCompleted ? '2px solid var(--app-color-accent)' : isActive ? '2px solid var(--app-color-primary)' : '2px solid var(--app-color-border)',
                boxShadow: isActive ? '0 0 0 4px rgba(13, 33, 44, 0.1)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {isCompleted ? <Icon name="check" size={16} strokeWidth={3} /> : (index + 1)}
              </div>

              {/* Step Label */}
              <span style={{
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isCompleted ? 'var(--app-color-accent)' : isActive ? 'var(--app-color-text)' : 'var(--app-color-text-muted)',
                whiteSpace: 'nowrap'
              }}>
                {step.label}
              </span>
            </div>

            {/* Connector line for all except last */}
            {!isLast && (
              <div style={{
                width: '60px',
                height: '2px',
                backgroundColor: isCompleted ? 'var(--app-color-accent)' : 'var(--app-color-border)',
                opacity: isCompleted ? 1 : 0.6,
                marginLeft: '16px',
                marginRight: '16px',
                transition: 'all 0.3s ease'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
