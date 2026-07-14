import React, { useEffect } from 'react';
import { Icon } from './Icon';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          cursor: 'pointer'
        }}
        onClick={onClose}
      />
      <div style={{
        position: 'relative',
        width: '440px',
        maxWidth: '100%',
        backgroundColor: 'var(--app-color-surface)',
        height: '100%',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease',
        zIndex: 1
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--app-color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--app-color-text)' }}>{title}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--app-color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
