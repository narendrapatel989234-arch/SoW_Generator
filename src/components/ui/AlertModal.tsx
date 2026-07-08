import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Button } from './Button';

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  hideCloseButton?: boolean;
  autoCloseDuration?: number;
  showOkButton?: boolean;
  okButtonText?: string;
}

export function AlertModal({ isOpen, onClose, title, description, type = 'success', hideCloseButton, autoCloseDuration, showOkButton, okButtonText = 'Ok' }: AlertModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      document.body.style.overflow = 'hidden';

      if (autoCloseDuration) {
        // Start fading out slightly before the actual close
        const fadeOutTimer = setTimeout(() => {
          setIsClosing(true);
        }, autoCloseDuration - 300);

        const closeTimer = setTimeout(() => {
          onClose();
        }, autoCloseDuration);

        return () => {
          clearTimeout(fadeOutTimer);
          clearTimeout(closeTimer);
          document.body.style.overflow = 'unset';
        };
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: { color: 'var(--app-color-success)', icon: 'check-circle' as const },
    error: { color: 'var(--app-color-danger)', icon: 'alert-circle' as const },
    info: { color: 'var(--app-color-primary)', icon: 'help-circle' as const }
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <>
      <style>{`
        @keyframes AlertModalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes AlertModalProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          opacity: isClosing ? 0 : 1,
          transition: 'opacity 0.3s ease-out'
        }}
        onClick={!hideCloseButton ? onClose : undefined}
      >
        <div 
          style={{
            position: 'relative',
            width: 'min(400px, calc(100vw - 32px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '32px 32px 24px',
            animation: 'AlertModalFadeIn 0.3s ease-out',
            transform: isClosing ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.3s ease-out',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {!hideCloseButton && (
            <button 
              onClick={onClose}
              style={{ 
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent', 
                border: 'none', 
                color: 'var(--app-color-text-muted)', 
                cursor: 'pointer', 
                padding: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '4px'
              }}
              aria-label="Close modal"
            >
              <Icon name="x" size={20} />
            </button>
          )}

          <div style={{ 
            width: '48px',
            height: '48px',
            color: config.color, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px',
            backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
            borderRadius: '50%'
          }}>
            <Icon name={config.icon} size={24} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ color: 'var(--app-color-text)', fontWeight: 600, fontSize: '18px' }}>
              {title}
            </div>
            {description && (
              <div style={{ color: 'var(--app-color-text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
                {description}
              </div>
            )}
          </div>

          {autoCloseDuration && (
            <div style={{ marginTop: '24px', width: '100%' }}>
              <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '8px', textAlign: 'center' }}>
                This message will close automatically.
              </div>
              <div style={{ height: '4px', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  backgroundColor: 'var(--app-color-accent)',
                  animation: `AlertModalProgress ${autoCloseDuration}ms linear forwards`
                }} />
              </div>
            </div>
          )}

          {showOkButton && (
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button variant="accent" onClick={onClose} style={{ padding: '8px 32px' }}>
                {okButtonText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
