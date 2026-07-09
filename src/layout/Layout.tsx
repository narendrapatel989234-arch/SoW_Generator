import React, { useState } from 'react';
import { LeftNavigation, type ScreenId } from '../components/reusable/LeftNavigation';
import { TopNavigation } from '../components/reusable/TopNavigation';
import { UploadRFP } from '../screens/UploadRFP';
import { SOWDraft } from '../screens/SOWDraft';
import { Review } from '../screens/Review';
import { ValidateSOW } from '../screens/ValidateSOW';
export function Layout() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('rfp-to-sow');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeScreen]);
  
  const toggleSidebar = () => setCollapsed(prev => !prev);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'rfp-to-sow':
        return <UploadRFP onTransitionToDraft={() => setActiveScreen('validate-sow')} />;
      case 'validate-sow':
        return <ValidateSOW 
          onProceed={(enabled) => {
            setSelectedSections(enabled);
            setActiveScreen('sow-draft');
          }} 
          onCancel={() => setActiveScreen('rfp-to-sow')} 
        />;
      case 'sow-draft':
        return <SOWDraft selectedSections={selectedSections.length > 0 ? selectedSections : undefined} />;
      case 'sow-draft-review':
        return <SOWDraft isReviewMode={true} selectedSections={selectedSections.length > 0 ? selectedSections : undefined} />;
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
          title={activeScreen === 'sow-draft' || activeScreen === 'sow-draft-review' || activeScreen === 'validate-sow' ? 'SOW-2026-001' : activeScreen === 'review' ? 'Reviews' : 'Upload RFP'} 
          breadcrumb={activeScreen === 'sow-draft' ? 'Review' : activeScreen === 'sow-draft-review' ? 'Review' : activeScreen === 'validate-sow' ? 'Validate Sections' : undefined}
        />
        <div className="app-content" id="app-content">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}
