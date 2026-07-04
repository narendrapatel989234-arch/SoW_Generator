import React from 'react';
import { Icon } from '../ui/Icon';
import { IconButton } from '../ui/IconButton';

interface TopNavigationProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  title: string;
  breadcrumb?: string;
}

export function TopNavigation({ collapsed, onToggleSidebar, title, breadcrumb }: TopNavigationProps) {
  return (
    <header className="app-topbar">
      <div className="app-topbar__left">
        <IconButton label="Toggle sidebar" onClick={onToggleSidebar}>
          <Icon name="menu" />
        </IconButton>
        
        <div className="app-topbar__breadcrumb">
          {breadcrumb && (
            <>
              <span className="app-topbar__crumb">{breadcrumb}</span>
              <Icon name="chevron-right" size={14} />
            </>
          )}
          <span className="app-topbar__crumb app-topbar__crumb--current">{title}</span>
        </div>
      </div>

      <div className="app-topbar__right">
        <IconButton label="Help">
          <Icon name="help-circle" />
        </IconButton>
        <IconButton label="Notifications">
          <Icon name="bell" />
        </IconButton>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--app-color-primary-soft)', color: 'var(--app-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', marginLeft: '8px' }}>
          JD
        </div>
      </div>
    </header>
  );
}
