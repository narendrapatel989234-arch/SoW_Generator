import React, { useState } from 'react';
import { LeftNavigation, type ScreenId } from '../components/reusable/LeftNavigation';
import { TopNavigation } from '../components/reusable/TopNavigation';
import { UploadRFP } from '../screens/UploadRFP';
import { SOWDraft } from '../screens/SOWDraft';
import { Review } from '../screens/Review';
import { ValidateSOW, type Section, mockSections } from '../screens/ValidateSOW';
import { Templates } from '../screens/Templates';
export function Layout() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('rfp-to-sow');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [globalReviewers, setGlobalReviewers] = useState<string[]>(['Anna Marie Pinto', 'Himanshu Khandelwal', 'Sagar']);
  const [templatesView, setTemplatesView] = useState<'list' | 'details' | 'configuration'>('list');
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeScreen]);
  
  const toggleSidebar = () => setCollapsed(prev => !prev);

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
          title={
            activeScreen === 'validate-sow' ? 'Configure Sections' :
            activeScreen === 'sow-draft' || activeScreen === 'sow-draft-review' ? 'SOW-2026-001' : 
            activeScreen === 'review' ? 'Reviews' : 
            activeScreen === 'templates' ? (templatesView === 'details' ? 'SOW Template' : 'Template & Configuration') :
            'Upload RFP'
          } 
          breadcrumb={
            activeScreen === 'validate-sow' ? 'Upload RFP' :
            activeScreen === 'sow-draft' || activeScreen === 'sow-draft-review' ? 'Review' : 
            (activeScreen === 'templates' && templatesView === 'details') ? 'Template & Configuration' :
            undefined
          }
          onBreadcrumbClick={
            activeScreen === 'validate-sow' ? () => setActiveScreen('rfp-to-sow') : 
            (activeScreen === 'templates' && templatesView === 'details') ? () => setTemplatesView('list') : 
            undefined
          }
        />
        <div className="app-content" id="app-content">
          <div style={{ display: activeScreen === 'rfp-to-sow' ? 'block' : 'none', height: '100%' }}>
            <UploadRFP onTransitionToDraft={() => setActiveScreen('validate-sow')} />
          </div>
          <div style={{ display: activeScreen === 'validate-sow' ? 'flex' : 'none', height: '100%', flexDirection: 'column', flex: 1 }}>
            <ValidateSOW 
              sections={sections}
              setSections={setSections}
              globalReviewers={globalReviewers}
              setGlobalReviewers={setGlobalReviewers}
              onProceed={(enabled) => {
                setSelectedSections(enabled);
                setActiveScreen('sow-draft');
              }} 
              onCancel={() => setActiveScreen('rfp-to-sow')} 
            />
          </div>
          {activeScreen === 'sow-draft' && (
            <SOWDraft 
              selectedSections={selectedSections.length > 0 ? selectedSections : undefined} 
              sections={sections}
              setSections={setSections}
              globalReviewers={globalReviewers}
              setGlobalReviewers={setGlobalReviewers}
            />
          )}
          {activeScreen === 'sow-draft-review' && (
            <SOWDraft 
              isReviewMode={true} 
              selectedSections={selectedSections.length > 0 ? selectedSections : undefined}
              sections={sections}
              setSections={setSections}
              globalReviewers={globalReviewers}
              setGlobalReviewers={setGlobalReviewers}
            />
          )}
          {activeScreen === 'review' && (
            <Review onTransitionToDraft={() => setActiveScreen('sow-draft-review')} />
          )}
          {activeScreen === 'templates' && (
            <Templates 
              globalReviewers={globalReviewers} 
              activeView={templatesView}
              onViewChange={setTemplatesView}
            />
          )}
        </div>
      </main>
    </div>
  );
}
