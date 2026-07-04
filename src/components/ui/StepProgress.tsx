import React from 'react';
import { Icon, type IconName } from './Icon';

export type Step = {
  id: string;
  title: string;
  description?: string;
  status?: 'completed' | 'error' | 'pending';
  icon?: IconName;
};

interface StepProgressProps {
  steps: Step[];
  activeStep: string;
  variant?: 'default' | 'timeline';
  orientation?: 'vertical' | 'horizontal';
  onStepClick?: (id: string) => void;
  width?: number | string;
}

export function StepProgress({
  steps,
  activeStep,
  variant = 'default',
  orientation = 'horizontal',
  onStepClick,
  width
}: StepProgressProps) {
  return (
    <div 
      className="step-progress" 
      data-orientation={orientation} 
      data-variant={variant}
      style={{ width }}
    >
      {steps.map((step, idx) => {
        const isActive = activeStep === step.id;
        const isCompleted = step.status === 'completed';
        
        return (
          <React.Fragment key={step.id}>
            <div 
              className="step-progress__item" 
              data-active={isActive}
              data-status={step.status || (isActive ? 'pending' : '')}
              onClick={() => onStepClick?.(step.id)}
              style={{ cursor: onStepClick ? 'pointer' : 'default' }}
            >
              <div className="step-progress__rail">
                <div className="step-progress__badge">
                  {isCompleted ? <Icon name="check" size={16} /> : (idx + 1)}
                </div>
              </div>
              <div className="step-progress__content">
                <div className="step-progress__title-row">
                  {step.title}
                </div>
              </div>
            </div>
            {idx < steps.length - 1 && orientation === 'horizontal' && (
              <div className="step-progress__line" data-completed={isCompleted} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
