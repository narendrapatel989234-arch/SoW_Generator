import React from 'react';
import { Icon, type IconName } from '../ui/Icon';

export type ScreenId = 'dashboard' | 'rfp-to-sow' | 'templates' | 'review' | 'settings' | 'sow-draft';

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
      { id: 'templates', label: 'Templates', icon: 'file-text' },
      { id: 'review', label: 'Reviews', icon: 'check-circle' }
    ]
  }
];

interface LeftNavigationProps {
  collapsed: boolean;
  activeItem?: ScreenId;
  onItemClick?: (id: ScreenId) => void;
  onToggleCollapse?: () => void;
}

export function LeftNavigation({ collapsed, activeItem, onItemClick, onToggleCollapse }: LeftNavigationProps) {
  return (
    <aside className="app-sidebar" data-collapsed={collapsed}>
      <div className="app-sidebar__brand">
        <div className="app-sidebar__logo">
          {collapsed ? 'M2' : 'M42'}
        </div>
        {!collapsed && (
          <div className="app-sidebar__brand-copy">
            SOW GENERATOR
          </div>
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
        <div className="app-sidebar__user" title={collapsed ? "Admin User" : undefined}>
          <div className="app-sidebar__avatar">AD</div>
          {!collapsed && (
            <div className="app-sidebar__user-copy">
              <span className="app-sidebar__user-name">Admin User</span>
              <span className="app-sidebar__user-email">M42 Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
