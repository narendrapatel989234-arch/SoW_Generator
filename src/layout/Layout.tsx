import React, { useState } from 'react';
import { LeftNavigation, type ScreenId } from '../components/reusable/LeftNavigation';
import { TopNavigation } from '../components/reusable/TopNavigation';
import { UploadRFP } from '../screens/UploadRFP';
import { SOWDraft } from '../screens/SOWDraft';
import { Review } from '../screens/Review';
export function Layout() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('rfp-to-sow');
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeScreen]);
  
  const toggleSidebar = () => setCollapsed(prev => !prev);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'rfp-to-sow':
        return <UploadRFP onTransitionToDraft={() => setActiveScreen('sow-draft')} />;
      case 'sow-draft':
        return <SOWDraft />;
      case 'sow-draft-review':
        return <SOWDraft isReviewMode={true} />;
      case 'review':
        return <Review onTransitionToDraft={() => setActiveScreen('sow-draft-review')} />;
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
        onToggle={toggleSidebar}
      />
      <main className="app-main">
        <TopNavigation 
          title={activeScreen === 'sow-draft' || activeScreen === 'sow-draft-review' ? 'SOW-2026-001' : activeScreen === 'review' ? 'Reviews' : 'Upload RFP'} 
          breadcrumb={activeScreen === 'sow-draft' ? 'Review' : activeScreen === 'sow-draft-review' ? 'Draft Review' : undefined}
        />
        <div className="app-content" id="app-content">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}
