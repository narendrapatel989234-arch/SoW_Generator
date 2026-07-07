import React from 'react';
import { Icon } from '../ui/Icon';
import { IconButton } from '../ui/IconButton';

interface TopNavigationProps {
  title: string;
  breadcrumb?: string;
}

export function TopNavigation({ title, breadcrumb }: TopNavigationProps) {
  return (
    <header className="app-topbar">
      <div className="app-topbar__left">
        <div className="app-topbar__breadcrumb">
          {breadcrumb && (
            <>
              <span className="app-topbar__crumb">{breadcrumb}</span>
              <Icon name="chevron-right" size={14} />
            </>
          )}
          <span 
            className="app-topbar__crumb app-topbar__crumb--current"
            style={{ 
              fontSize: breadcrumb ? undefined : '20px', 
              fontWeight: breadcrumb ? undefined : 600,
              color: breadcrumb ? undefined : 'var(--app-color-text)'
            }}
          >
            {title}
          </span>
        </div>
      </div>

      <div className="app-topbar__right">
      </div>
    </header>
  );
}
