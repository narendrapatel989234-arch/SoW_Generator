import React from 'react';
import { Icon, type IconName } from '../ui/Icon';

export type ScreenId = 'dashboard' | 'rfp-to-sow' | 'templates' | 'review' | 'settings' | 'sow-draft' | 'sow-draft-review' | 'sow-draft-approved' | 'sow-draft-edit' | 'validate-sow' | 'activity-log';

export interface NavSection {
  id: string;
  label: string;
  items: {
    id: ScreenId;
    label: string;
    icon: IconName;
  }[];
}

export const navigationSections: NavSection[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'rfp-to-sow', label: 'Upload RFP', icon: 'upload' },
      { id: 'review', label: 'Review', icon: 'check-circle' },
      { id: 'templates', label: 'Template & Configuration', icon: 'file-text' }
    ]
  }
];

interface LeftNavigationProps {
  collapsed: boolean;
  activeItem?: ScreenId;
  onItemClick?: (id: ScreenId) => void;
  onToggle?: () => void;
  onLogout?: () => void;
  userRole?: string | null;
}

export function LeftNavigation({ collapsed, activeItem, onItemClick, onToggle, onLogout, userRole = 'PMO' }: LeftNavigationProps) {
  const visibleSections = navigationSections.map(section => {
    if (userRole === 'Reviewer') {
      return {
        ...section,
        items: section.items.filter(item => item.id === 'dashboard' || item.id === 'review')
      };
    }
    return section;
  });

  return (
    <aside className="app-sidebar" data-collapsed={collapsed}>
      <div className="app-sidebar__brand">
        <img 
          src="/Logo.png" 
          alt="M42 Logo" 
          className="app-sidebar__logo-img"
        />
        {onToggle && (
          <button 
            className="app-sidebar__collapse-toggle" 
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={14} />
          </button>
        )}
      </div>
      
      <div className="app-sidebar__content">
        {visibleSections.map(section => (
          <div key={section.id} className="app-sidebar__section">
            <nav className="app-sidebar__nav">
              {section.items.map(item => (
                <button 
                  key={item.id}
                  className="app-sidebar__item" 
                  data-active={activeItem === item.id}
                  onClick={() => onItemClick?.(item.id)}
                  aria-label={item.label}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="app-sidebar__icon"><Icon name={item.icon} size={20} /></div>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="app-sidebar__footer">
        {onLogout && (
          <div style={{ padding: '0 8px 8px 8px', borderBottom: '1px solid var(--app-color-border)', marginBottom: '8px' }}>
            <button 
              className="app-sidebar__item" 
              onClick={onLogout}
              aria-label="Logout"
              title={collapsed ? "Logout" : undefined}
            >
              <div className="app-sidebar__icon"><Icon name="log-out" size={20} /></div>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        )}
        <div className="app-sidebar__user" title={collapsed ? (userRole === 'Reviewer' ? 'David Brown' : 'John Doe') : undefined}>
          <div className="app-sidebar__avatar">{userRole === 'Reviewer' ? 'DB' : 'JD'}</div>
          {!collapsed && (
            <div className="app-sidebar__user-copy">
              <span className="app-sidebar__user-name">{userRole === 'Reviewer' ? 'David Brown' : 'John Doe'}</span>
              <span className="app-sidebar__user-email">{userRole === 'Reviewer' ? 'Technical Reviewer' : 'PMO User'}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
