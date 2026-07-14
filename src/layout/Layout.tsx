import React, { useState } from 'react';
import { LeftNavigation, type ScreenId } from '../components/reusable/LeftNavigation';
import { TopNavigation } from '../components/reusable/TopNavigation';
import { UploadRFP } from '../screens/UploadRFP';
import { SOWDraft } from '../screens/SOWDraft';
import { Review } from '../screens/Review';
import { ValidateSOW, type Section, mockSections } from '../screens/ValidateSOW';
import { Templates } from '../screens/Templates';
import { ActivityLog } from '../screens/ActivityLog';
import { Icon } from '../components/ui/Icon';

interface LayoutProps {
  userRole?: string | null;
  onLogout?: () => void;
}

export function Layout({ userRole = 'PMO', onLogout }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [activeScreen, setActiveScreen] = useState<ScreenId>(
    userRole === 'Reviewer' ? 'dashboard' : 'rfp-to-sow'
  );
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [globalReviewers, setGlobalReviewers] = useState<string[]>(['Anna Marie Pinto', 'Himanshu Khandelwal', 'Sagar']);
  const [templatesView, setTemplatesView] = useState<'list' | 'details'>('list');
  
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
        onLogout={onLogout}
        userRole={userRole}
      />
      <main className="app-main">
        <TopNavigation 
          title={
            activeScreen === 'dashboard' ? 'Dashboard' :
            activeScreen === 'validate-sow' ? 'Configure Sections' :
            activeScreen === 'sow-draft' || activeScreen === 'sow-draft-review' || activeScreen === 'sow-draft-approved' ? 'SOW-2026-001' : 
            activeScreen === 'review' ? 'Review' : 
            activeScreen === 'templates' ? (templatesView === 'details' ? 'Statement of Work (SOW)' : 'Template & Configuration') :
            activeScreen === 'activity-log' ? 'Activity Log' :
            'Upload RFP'
          } 
          breadcrumb={
            activeScreen === 'validate-sow' ? 'Upload RFP' :
            activeScreen === 'sow-draft' || activeScreen === 'sow-draft-review' || activeScreen === 'sow-draft-approved' ? 'Review' : 
            (activeScreen === 'templates' && templatesView === 'details') ? 'Template & Configuration' :
            undefined
          }
          onBreadcrumbClick={
            activeScreen === 'validate-sow' ? () => setActiveScreen('rfp-to-sow') : 
            (activeScreen === 'sow-draft' || activeScreen === 'sow-draft-review' || activeScreen === 'sow-draft-approved') ? () => setActiveScreen('review') :
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
              userRole={userRole}
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
              onSubmitFinal={() => setActiveScreen('sow-draft-approved')}
              userRole={userRole}
            />
          )}
          {activeScreen === 'sow-draft-approved' && (
            <SOWDraft 
              isApprovedMode={true}
              selectedSections={selectedSections.length > 0 ? selectedSections : undefined}
              sections={sections}
              setSections={setSections}
              globalReviewers={globalReviewers}
              setGlobalReviewers={setGlobalReviewers}
              userRole={userRole}
            />
          )}
          {activeScreen === 'sow-draft-edit' && (
            <SOWDraft 
              isDraftMode={true}
              selectedSections={selectedSections.length > 0 ? selectedSections : undefined}
              sections={sections}
              setSections={setSections}
              globalReviewers={globalReviewers}
              setGlobalReviewers={setGlobalReviewers}
              onSendForReview={() => setActiveScreen('sow-draft-review')}
              userRole={userRole}
            />
          )}
          {activeScreen === 'review' && (
            <Review 
              userRole={userRole}
              onTransitionToDraft={(docId, status) => {
              setSelectedSections([]);
              if (status === 'In Review') {
                setActiveScreen('sow-draft-review');
              } else if (status === 'Approved') {
                setActiveScreen('sow-draft-approved');
              } else if (status === 'Draft') {
                setActiveScreen('sow-draft-edit');
              } else {
                setActiveScreen('sow-draft');
              }
            }} />
          )}
          {activeScreen === 'templates' && (
            <Templates 
              globalReviewers={globalReviewers} 
              activeView={templatesView}
              onViewChange={setTemplatesView}
            />
          )}
          {activeScreen === 'activity-log' && (
            <ActivityLog />
          )}
          {activeScreen === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', flex: 1, padding: '48px' }}>
              <div style={{
                backgroundColor: 'var(--app-color-surface)',
                border: '1px solid var(--app-color-border)',
                borderRadius: '16px',
                padding: '48px',
                maxWidth: '500px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
              }}>
                <div style={{ 
                  width: '72px', 
                  height: '72px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--app-color-primary-soft)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--app-color-primary)',
                  marginBottom: '24px'
                }}>
                  <Icon name="dashboard" size={36} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--app-color-text)', margin: '0 0 12px 0' }}>
                  Dashboard Module Coming Soon
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--app-color-text-muted)', lineHeight: '1.6', margin: 0 }}>
                  We are currently developing this module to provide comprehensive insights, analytics, and operational metrics. This feature will be available in an upcoming release.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
