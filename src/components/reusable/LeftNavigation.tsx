import React from 'react';
import { Icon, type IconName } from '../ui/Icon';

export type ScreenId = 'dashboard' | 'rfp-to-sow' | 'templates' | 'review' | 'settings' | 'sow-draft' | 'sow-draft-review' | 'validate-sow' | 'activity-log';

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
      { id: 'templates', label: 'Template & Configuration', icon: 'file-text' },
      { id: 'activity-log', label: 'Activity Log', icon: 'clock' }
    ]
  }
];

interface LeftNavigationProps {
  collapsed: boolean;
  activeItem?: ScreenId;
  onItemClick?: (id: ScreenId) => void;
  onToggle?: () => void;
}

export function LeftNavigation({ collapsed, activeItem, onItemClick, onToggle }: LeftNavigationProps) {
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
        {navigationSections.map(section => (
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
        <div className="app-sidebar__user" title={collapsed ? "John Doe" : undefined}>
          <div className="app-sidebar__avatar">JD</div>
          {!collapsed && (
            <div className="app-sidebar__user-copy">
              <span className="app-sidebar__user-name">John Doe</span>
              <span className="app-sidebar__user-email">PMO User</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
