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
  const currentIndex = steps.findIndex(s => s.id === currentStepId);

  return (
    <div className={`enterprise-stepper ${className}`} style={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: '32px',
      position: 'relative'
    }}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        
        return (
          <div key={step.id} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            flex: 1,
            position: 'relative'
          }}>
            {/* Connector line for all except last */}
            {index < steps.length - 1 && (
              <div style={{
                position: 'absolute',
                top: '16px', // Centered vertically with the 32px badge
                left: '50%',
                width: '100%',
                height: '2px',
                backgroundColor: isCompleted ? 'var(--app-color-accent)' : 'var(--app-color-border)',
                opacity: isCompleted ? 1 : 0.6,
                zIndex: 0,
                transition: 'all 0.3s ease'
              }} />
            )}

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
              zIndex: 1, // Above the connector line
              marginBottom: '12px'
            }}>
              {isCompleted ? <Icon name="check" size={16} strokeWidth={3} /> : (index + 1)}
            </div>

            {/* Step Label */}
            <span style={{
              fontSize: '14px',
              fontWeight: isActive ? 700 : 500,
              color: isCompleted ? 'var(--app-color-accent)' : isActive ? 'var(--app-color-text)' : 'var(--app-color-text-muted)',
              textAlign: 'center',
              zIndex: 1
            }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
