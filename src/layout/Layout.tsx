import React, { useState } from 'react';
import { LeftNavigation, type ScreenId } from '../components/reusable/LeftNavigation';
import { TopNavigation } from '../components/reusable/TopNavigation';
import { UploadRFP } from '../screens/UploadRFP';
import { SOWDraft } from '../screens/SOWDraft';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('rfp-to-sow');
  
  const toggleSidebar = () => setCollapsed(prev => !prev);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'rfp-to-sow':
        return <UploadRFP onTransitionToDraft={() => setActiveScreen('sow-draft')} />;
      case 'sow-draft':
        return <SOWDraft />;
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <div className="app-layout">
      <LeftNavigation 
        collapsed={collapsed} 
        activeItem={activeScreen}
        onItemClick={setActiveScreen}
        onToggleCollapse={toggleSidebar}
      />
      <main className="app-main">
        <TopNavigation 
          collapsed={collapsed} 
          onToggleSidebar={toggleSidebar} 
          title="RFP to SOW" 
          breadcrumb="M42 Hub" 
        />
        <div className="app-content">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}
