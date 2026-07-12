import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export function Toast({
  isOpen,
  onClose,
  title,
  description,
  type = 'success',
  duration = 6000
}: ToastProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      return;
    }

    if (!isHovered && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isHovered, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Matches fade-out animation duration
  };

  if (!isOpen && !isClosing) return null;

  const getTheme = () => {
    switch (type) {
      case 'success':
        return { icon: 'check-circle', color: 'var(--app-color-success)', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'error':
        return { icon: 'alert-circle', color: 'var(--app-color-danger)', bg: 'rgba(239, 68, 68, 0.1)' };
      case 'warning':
        return { icon: 'alert-triangle', color: 'var(--app-color-warning)', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'info':
      default:
        return { icon: 'info', color: 'var(--app-color-primary)', bg: 'rgba(59, 130, 246, 0.1)' };
    }
  };

  const theme = getTheme();

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        backgroundColor: 'var(--app-color-surface)',
        border: '1px solid var(--app-color-border)',
        borderLeft: `4px solid ${theme.color}`,
        borderRadius: 'var(--app-radius-md)',
        padding: '16px',
        boxShadow: 'var(--app-shadow-lg)',
        zIndex: 9999,
        width: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: isClosing ? 'toastFadeOut 0.3s ease forwards' : 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastFadeOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(10px); opacity: 0; }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          backgroundColor: theme.bg, 
          color: theme.color, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon name={theme.icon as any} size={18} />
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)', lineHeight: 1.2 }}>
            {title}
          </h4>
          {description && (
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--app-color-text-muted)', lineHeight: 1.4 }}>
              {description}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          aria-label="Dismiss notification"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: 'var(--app-color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            marginTop: '2px'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Icon name="x" size={14} />
        </button>
      </div>

      {duration > 0 && !isHovered && !isClosing && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          backgroundColor: theme.color,
          animation: `toastProgress ${duration}ms linear forwards`
        }} />
      )}
    </div>,
    document.body
  );
}
