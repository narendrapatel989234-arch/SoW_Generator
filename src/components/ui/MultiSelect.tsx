import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  onActionClick?: () => void;
  actionLabel?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  onActionClick,
  actionLabel,
  disabled = false
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter(v => v !== option));
  };

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`multi-select ${disabled ? 'multi-select--disabled' : ''}`} ref={containerRef}>
      <div 
        className={`multi-select__control ${isOpen ? 'multi-select__control--open' : ''}`} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="multi-select__value-container" style={{ flexWrap: 'nowrap', overflow: 'hidden' }}>
          {value.length === 0 ? (
            <span className="multi-select__placeholder">{placeholder}</span>
          ) : (
            <>
              {value.slice(0, 2).map(val => (
                <span key={val} className="multi-select__chip" style={{ height: '22px' }}>
                  <span style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    maxWidth: '85px',
                    display: 'inline-block',
                    verticalAlign: 'middle'
                  }}>
                    {val}
                  </span>
                  {!disabled && (
                    <button type="button" className="multi-select__chip-remove" onClick={(e) => removeOption(val, e)}>
                      <Icon name="x" size={12} />
                    </button>
                  )}
                </span>
              ))}
              {value.length > 2 && (
                <span 
                  className="multi-select__chip multi-select__chip--overflow" 
                  style={{ position: 'relative', cursor: 'default', paddingRight: '6px', height: '22px' }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  +{value.length - 2}
                  {showTooltip && (
                    <div style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--app-color-text)',
                      color: 'var(--app-color-surface)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      width: 'max-content',
                      zIndex: 1000,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      pointerEvents: 'none',
                      lineHeight: '1.5',
                      textAlign: 'left'
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Additional Reviewers</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {value.slice(2).map(v => (
                          <div key={v}>• {v}</div>
                        ))}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)',
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--app-color-text)'
                      }} />
                    </div>
                  )}
                </span>
              )}
            </>
          )}
        </div>
        <div className="multi-select__indicators">
          <Icon name="chevron-down" size={16} style={{ color: 'var(--app-color-text-muted)' }} />
        </div>
      </div>

      {isOpen && (
        <div className="multi-select__menu">
          <div className="multi-select__search">
            <Icon name="search" size={14} style={{ color: 'var(--app-color-text-muted)' }} />
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
            />
          </div>
          
          <div className="multi-select__options">
            {filteredOptions.length === 0 ? (
              <div className="multi-select__no-options">No matches found</div>
            ) : (
              filteredOptions.map(opt => (
                <div 
                  key={opt}
                  className={`multi-select__option ${value.includes(opt) ? 'multi-select__option--selected' : ''}`}
                  onClick={(e) => toggleOption(opt, e)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <div style={{ 
                    width: '18px', height: '18px', 
                    borderRadius: '4px', 
                    border: `1.5px solid ${value.includes(opt) ? 'var(--app-color-accent)' : '#d1d5db'}`,
                    backgroundColor: value.includes(opt) ? 'var(--app-color-accent)' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}>
                    {value.includes(opt) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  {opt}
                </div>
              ))
            )}
          </div>

          {onActionClick && actionLabel && (
            <div className="multi-select__action" onClick={() => {
              setIsOpen(false);
              onActionClick();
            }}>
              {actionLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
