import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { RichEditor } from '../components/ui/RichEditor';
import { AlertModal } from '../components/ui/AlertModal';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const tocItems = [
  'Executive Summary',
  'Objectives',
  'Project Scope',
  'Solution Architecture',
  'Technical Requirements',
  'Deliverables',
  'Timeline',
  'Commercial Proposal',
  'Risks & Assumptions',
  'Acceptance Criteria'
];

const processingStages = [
  'Uploading RFP document',
  'Reading RFP document',
  'Extracting business requirements',
  'Identifying project scope',
  'Preparing solution structure',
  'Generating Scope of Work',
  'Finalizing draft'
];

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

const mockTeamMembers: TeamMember[] = [
  { name: 'Ashika Sharma', role: 'ashika@example.com', initials: 'AS' },
  { name: 'Sujith Thomas', role: 'sujith@example.com', initials: 'ST' },
  { name: 'Narendra Patel', role: 'narendra@example.com', initials: 'NP' },
  { name: 'Gopika Nair', role: 'gopika@example.com', initials: 'GN' },
  { name: 'Dipali Balkrishna Patil', role: 'dipali@example.com', initials: 'DP' }
];

export function SOWDraft() {
  const [activeTab, setActiveTab] = useState<'rfp' | 'sow'>('sow');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Processing States
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isProcessing) return;
    
    let progress = 0;
    const totalTime = 14000; // 14 seconds total
    const intervalTime = 100;
    
    const timer = setInterval(() => {
      progress += (100 / (totalTime / intervalTime));
      setProcessingProgress(Math.min(progress, 100));
      
      let stepIndex = 0;
      if (progress < 25) stepIndex = 0; // Uploading takes 25% (3.5s)
      else if (progress < 40) stepIndex = 1;
      else if (progress < 55) stepIndex = 2;
      else if (progress < 70) stepIndex = 3;
      else if (progress < 80) stepIndex = 4;
      else if (progress < 90) stepIndex = 5;
      else stepIndex = 6;
      
      setCurrentProcessingStep(stepIndex);
      
      if (progress >= 100) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          setIsProcessing(false);
          setIsFadingOut(false);
        }, 400); // 400ms fade duration
      }
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [isProcessing]);

  // Share Modal States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<TeamMember[]>([]);
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Export Menu States
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportToastMessage, setExportToastMessage] = useState('');

  // Preview State
  const [previewFile, setPreviewFile] = useState<{name: string, size?: string} | null>(null);

  const filteredSuggestions = mockTeamMembers.filter(member => 
    (member.name.toLowerCase().includes(recipientSearch.toLowerCase()) || 
     member.role.toLowerCase().includes(recipientSearch.toLowerCase())) &&
    !selectedRecipients.find(r => r.name === member.name)
  );

  const handleShareSubmit = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      setIsShareModalOpen(false);
      setShowShareToast(true);
      // Reset modal state
      setRecipientSearch('');
      setSelectedRecipients([]);
      setMessage('');
      
      setTimeout(() => setShowShareToast(false), 3000);
    }, 1500);
  };


  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (isShareModalOpen || isProcessing || isFadingOut) {
      if (mainContent) (mainContent as HTMLElement).style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      if (mainContent) (mainContent as HTMLElement).style.overflow = '';
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isShareModalOpen) {
        setIsShareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (mainContent) (mainContent as HTMLElement).style.overflow = '';
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShareModalOpen, isProcessing, isFadingOut]);

  return (
    <>
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '100%', flex: 1, overflow: 'hidden', minHeight: 0,
      pointerEvents: isProcessing ? 'none' : 'auto'
    }}>
      {/* Header */}
      <div className="screen-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--app-color-border)' }}>
        {/* Tabs */}
        <div className="tabs-container" style={{ margin: 0, borderBottom: 'none' }}>
            <button 
              className={`tab-item ${activeTab === 'rfp' ? 'active' : ''}`}
              onClick={() => setActiveTab('rfp')}
            >
              RFP
            </button>
            <button 
              className={`tab-item ${activeTab === 'sow' ? 'active' : ''}`}
              onClick={() => setActiveTab('sow')}
            >
              SOW Draft
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <Button variant="secondary" onClick={() => setIsShareModalOpen(true)} disabled={isProcessing}>
              <Icon name="upload-cloud" size={16} /> Share
            </Button>
            
            <div style={{ position: 'relative' }}>
              <Button variant="accent" onClick={() => setShowExportMenu(!showExportMenu)} disabled={isProcessing}>
                <Icon name="download" size={16} /> Export
              </Button>
              
              {showExportMenu && (
                <>
                  <div 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                    backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)',
                    borderRadius: '6px', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', zIndex: 100,
                    minWidth: '160px', overflow: 'hidden'
                  }}>
                    <button 
                      onClick={() => {
                        setShowExportMenu(false);
                        setExportToastMessage('PDF export started.');
                        setTimeout(() => setExportToastMessage(''), 3000);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '12px 16px',
                        backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid var(--app-color-border)',
                        cursor: 'pointer', color: 'var(--app-color-text)', fontSize: '14px', textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Icon name="file-text" size={16} /> Export as PDF
                    </button>
                    <button 
                      onClick={() => {
                        setShowExportMenu(false);
                        setExportToastMessage('DOCX export started.');
                        setTimeout(() => setExportToastMessage(''), 3000);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '12px 16px',
                        backgroundColor: 'transparent', border: 'none',
                        cursor: 'pointer', color: 'var(--app-color-text)', fontSize: '14px', textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Icon name="file" size={16} /> Export as DOCX
                    </button>
                  </div>
                </>
              )}
            </div>
        </div>
      </div>

      <div 
        className="sow-workspace"
        style={activeTab === 'rfp' ? { display: 'block', height: 'auto', overflow: 'visible' } : {}}
      >
        {activeTab === 'sow' && (
          <>
            {/* TOC Sidebar */}
            <div className="sow-toc-sidebar" style={{ paddingTop: 0 }}>
              <div style={{ height: '54px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--app-color-border)', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--app-color-primary)', margin: 0 }}>Table of Contents</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isProcessing ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <li key={i} style={{ padding: '12px 14px' }}>
                      <div className="skeleton-text" style={{ width: i % 2 === 0 ? '70%' : '85%', height: '10px' }} />
                    </li>
                  ))
                ) : (
                  tocItems.map((item, idx) => {
                    return (
                      <li key={idx} 
                        className={`toc-tab-item ${activeSectionIndex === idx ? 'active' : ''}`}
                        onClick={() => {
                          setActiveSectionIndex(idx);
                          setTimeout(() => {
                            const sectionElement = document.getElementById(`sow-section-${idx}`);
                            const scrollArea = document.getElementById('sow-editor-scroll-area');
                            if (sectionElement && scrollArea) {
                              const containerRect = scrollArea.getBoundingClientRect();
                              const sectionRect = sectionElement.getBoundingClientRect();
                              const offset = 24; 
                              const scrollTop = scrollArea.scrollTop + (sectionRect.top - containerRect.top) - offset;
                              scrollArea.scrollTo({ top: scrollTop, behavior: 'smooth' });
                            }
                          }, 50);
                        }}
                      >
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--app-color-accent)' }} />
                        {item}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

            {/* Main Content Area */}
            <div className="sow-main-content-wrapper" style={{ position: 'relative', height: '100%' }}>
              <div className="sow-main-content" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {isProcessing ? (
                  <div style={{ padding: '24px 0', opacity: 0.6, display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {/* Header Block */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div className="skeleton-title" style={{ width: '56px', height: '56px', borderRadius: '12px' }}></div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="skeleton-title" style={{ width: '35%', height: '24px', borderRadius: '6px' }}></div>
                        <div className="skeleton-text" style={{ width: '60%', height: '14px', borderRadius: '6px' }}></div>
                      </div>
                    </div>
                    
                    {/* Large Banner Block */}
                    <div className="skeleton-title" style={{ width: '100%', height: '240px', borderRadius: '16px' }}></div>
                    
                    {/* Two Column Layout Block */}
                    <div style={{ display: 'flex', gap: '32px' }}>
                      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="skeleton-title" style={{ width: '45%', height: '22px', borderRadius: '6px', marginBottom: '8px' }}></div>
                        <div className="skeleton-text" style={{ width: '100%', height: '12px', borderRadius: '6px' }}></div>
                        <div className="skeleton-text" style={{ width: '100%', height: '12px', borderRadius: '6px' }}></div>
                        <div className="skeleton-text" style={{ width: '92%', height: '12px', borderRadius: '6px' }}></div>
                        <div className="skeleton-text" style={{ width: '96%', height: '12px', borderRadius: '6px' }}></div>
                        <div className="skeleton-text" style={{ width: '85%', height: '12px', borderRadius: '6px' }}></div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="skeleton-title" style={{ width: '100%', height: '140px', borderRadius: '12px' }}></div>
                        <div className="skeleton-text" style={{ width: '75%', height: '12px', borderRadius: '6px' }}></div>
                        <div className="skeleton-text" style={{ width: '55%', height: '12px', borderRadius: '6px' }}></div>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                      <div className="skeleton-title" style={{ width: '30%', height: '22px', borderRadius: '6px', marginBottom: '8px' }}></div>
                      <div className="skeleton-text" style={{ width: '100%', height: '12px', borderRadius: '6px' }}></div>
                      <div className="skeleton-text" style={{ width: '90%', height: '12px', borderRadius: '6px' }}></div>
                    </div>
                  </div>
                ) : (
                  <RichEditor 
                    tocItems={tocItems} 
                    activeSectionIndex={activeSectionIndex}
                    isGenerating={false}
                    onSectionChange={setActiveSectionIndex}
                  />
                )}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'rfp' && (
          <div style={{ padding: '32px', width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
              
              <Card title={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>RFP Document</div>
                  </div>
                </div>
              }>
                <div 
                  className="file-item"
                  style={{ margin: 0, display: 'flex', flexDirection: 'column', padding: '12px', border: '1px solid var(--app-color-border)', borderRadius: '8px', backgroundColor: 'var(--app-color-surface)', cursor: 'pointer' }}
                  onClick={() => setPreviewFile({ name: 'Project_Requirements_v2.pdf', size: '4.2 MB' })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div className="file-item__icon-wrapper" style={{ marginRight: '12px' }}>
                      <Icon name="file-text" size={20} />
                    </div>
                    <div className="file-item__main" style={{ flex: 1, minWidth: 0 }}>
                      <div className="file-item__name" style={{ fontWeight: 500, fontSize: '14px', color: 'var(--app-color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Project_Requirements_v2.pdf</div>
                      <div className="file-item__meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--app-color-text-muted)', marginTop: '4px' }}>
                        <span>4.2 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>Supporting Documents</div>
                  </div>
                </div>
              }>
                <div className="supporting-docs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {[
                    { name: 'Architecture_Diagrams.png', size: '1.8 MB' },
                    { name: 'Security_Compliance_Guidelines.pdf', size: '3.4 MB' },
                    { name: 'Vendor_Q_and_A.docx', size: '0.9 MB' },
                    { name: 'Legacy_API_Specs.json', size: '2.1 MB' }
                  ].map((doc, i) => (
                    <div 
                      key={i} 
                      className="file-item"
                      style={{ margin: 0, display: 'flex', flexDirection: 'column', padding: '12px', border: '1px solid var(--app-color-border)', borderRadius: '8px', backgroundColor: 'var(--app-color-surface)', cursor: 'pointer' }}
                      onClick={() => setPreviewFile(doc)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <div className="file-item__icon-wrapper" style={{ marginRight: '12px' }}>
                          <Icon name="file-text" size={20} />
                        </div>
                        <div className="file-item__main" style={{ flex: 1, minWidth: 0 }}>
                          <div className="file-item__name" style={{ fontWeight: 500, fontSize: '14px', color: 'var(--app-color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                          <div className="file-item__meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--app-color-text-muted)', marginTop: '4px' }}>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>Applicable Tags</div>
                  </div>
                </div>
              }>
                <div style={{ 
                  display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
                  padding: '12px 16px', border: '1px solid var(--app-color-border)', 
                  borderRadius: 'var(--app-radius-sm)', backgroundColor: 'var(--app-color-surface)'
                }}>
                  {['Cloud Migration', 'Security', 'Azure', 'Infrastructure', 'Modernization'].map(tag => (
                    <Badge key={tag} tone="info" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-primary)', borderRadius: '24px', border: 'none', fontWeight: 500 }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.5)',
          backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setIsShareModalOpen(false)}>
          <div style={{
            width: 'min(500px, calc(100vw - 32px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '32px 32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0ea5e9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
              }}>
                <Icon name="share-2" size={24} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '8px' }}>Share</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>Search and select team members to share this draft for review.</p>
            </div>
            
            {/* Body */}
            <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Recipient Search */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--app-color-primary)', marginBottom: '8px' }}>
                  Add recipients <span style={{ color: 'var(--app-color-danger)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
                    padding: '8px 12px', minHeight: '44px',
                    border: '1px solid var(--app-color-border)', borderRadius: '6px',
                    backgroundColor: 'var(--app-color-surface)'
                  }}>
                    {selectedRecipients.map((recipient, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '4px 8px', backgroundColor: 'var(--app-color-surface-muted)',
                        borderRadius: '16px', fontSize: '13px', color: 'var(--app-color-text)',
                        border: '1px solid var(--app-color-border)'
                      }}>
                        {recipient.name}
                        <button 
                          onClick={() => setSelectedRecipients(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--app-color-text-muted)', cursor: 'pointer', display: 'flex' }}
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                    ))}
                    <input 
                      type="text"
                      value={recipientSearch}
                      onChange={(e) => {
                        setRecipientSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={selectedRecipients.length === 0 ? "Type a name or email..." : ""}
                      style={{ border: 'none', outline: 'none', flex: 1, minWidth: '150px', backgroundColor: 'transparent', fontSize: '14px', color: 'var(--app-color-text)' }}
                    />
                  </div>
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && recipientSearch && filteredSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                      backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)',
                      borderRadius: '6px', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', zIndex: 10,
                      maxHeight: '200px', overflowY: 'auto'
                    }}>
                      {filteredSuggestions.map((suggestion, i) => (
                        <div 
                          key={i}
                          onClick={() => {
                            setSelectedRecipients([...selectedRecipients, suggestion]);
                            setRecipientSearch('');
                            setShowSuggestions(false);
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                            cursor: 'pointer', borderBottom: i < filteredSuggestions.length - 1 ? '1px solid var(--app-color-border)' : 'none'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600
                          }}>
                            {suggestion.initials}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--app-color-text)' }}>{suggestion.name}</span>
                            <span style={{ fontSize: '12px', color: 'var(--app-color-text-muted)' }}>{suggestion.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--app-color-primary)', marginBottom: '8px' }}>
                  Message
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message for reviewers..."
                  style={{
                    width: '100%', height: '80px', padding: '12px',
                    border: '1px solid var(--app-color-border)', borderRadius: '6px',
                    backgroundColor: 'var(--app-color-surface)', fontSize: '14px',
                    color: 'var(--app-color-text)', resize: 'none', outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>


            </div>

            {/* Footer */}
            <div style={{ padding: '0 32px 32px', display: 'flex', justifyContent: 'center', gap: '16px', width: '100%' }}>
              <Button variant="ghost" onClick={() => setIsShareModalOpen(false)} style={{ border: '1px solid var(--app-color-border)', flex: 1, justifyContent: 'center', padding: '10px 0' }}>Cancel</Button>
              <Button variant="accent" onClick={handleShareSubmit} disabled={selectedRecipients.length === 0 || isSharing} style={{ flex: 1, justifyContent: 'center', padding: '10px 0' }}>
                {isSharing ? (
                  <><Icon name="loader" size={16} className="icon-spin" /> Sharing...</>
                ) : (
                  <>Share</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: 'var(--app-color-surface)',
          border: '1px solid var(--app-color-border)',
          borderRadius: 'var(--app-radius-md)',
          padding: '12px 16px',
          boxShadow: 'var(--app-shadow-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 2000,
          animation: 'slideInRight 0.3s ease-out',
          color: 'var(--app-color-text)',
          fontSize: '14px',
          fontWeight: 500
        }}>
          <Icon name="check-circle" size={18} style={{ color: 'var(--app-color-success)' }} />
          SOW draft shared successfully
        </div>
      )}

      {/* Export Toast Modal */}
      <AlertModal 
        isOpen={!!exportToastMessage}
        onClose={() => setExportToastMessage('')}
        title={exportToastMessage}
        type="success"
      />

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* AI Processing Modal */}
      {(isProcessing || isFadingOut) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1050,
          opacity: isFadingOut ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'auto'
        }}>
          <div style={{
            width: 'min(420px, calc(100vw - 32px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            padding: '20px 24px',
            display: 'flex', flexDirection: 'column',
            transform: isFadingOut ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.4s ease',
            overflow: 'hidden'
          }}>
            <div key={currentProcessingStep === 0 ? "upload" : "gen"} className="fade-in-content" style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon name={currentProcessingStep === 0 ? "upload-cloud" : "loader"} size={20} className={currentProcessingStep === 0 ? "icon-bounce" : "icon-spin"} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '6px' }}>
                {currentProcessingStep === 0 ? 'Uploading RFP Document' : 'Generating Scope of Work'}
              </h2>
              <p style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', lineHeight: '1.4', margin: 0 }}>
                {currentProcessingStep === 0 
                  ? 'Please wait while we securely upload and process your files.' 
                  : 'Our AI is analysing the uploaded documents and preparing your first draft.'}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--app-color-text-muted)' }}>
                <span style={{ fontWeight: 500 }}>Overall Progress</span>
                <span style={{ fontWeight: 600, color: 'var(--app-color-primary)' }}>{Math.round(processingProgress)}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: 'var(--app-color-accent)', width: `${processingProgress}%`, transition: 'width 0.1s linear' }} />
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--app-color-text-muted)', marginTop: '6px' }}>
                Estimated remaining time: {Math.max(0, Math.ceil(14 - (processingProgress / 100 * 14)))}s
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {processingStages.map((stage, idx) => {
                  const isCompleted = idx < currentProcessingStep || processingProgress >= 100;
                  const isCurrent = idx === currentProcessingStep && processingProgress < 100;
                  return (
                    <li key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      fontSize: '13px',
                      color: isCompleted ? 'var(--app-color-text)' : isCurrent ? 'var(--app-color-accent)' : 'var(--app-color-text-muted)',
                      opacity: (!isCompleted && !isCurrent) ? 0.5 : 1
                    }}>
                      {isCompleted ? <Icon name="check-circle" size={16} style={{ color: 'var(--app-color-success)' }} /> :
                       isCurrent ? <Icon name="loader" size={16} className="icon-spin" /> :
                       <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--app-color-border)' }} />}
                      {stage}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--app-color-text-muted)', borderTop: '1px solid var(--app-color-border)', paddingTop: '12px', marginTop: 'auto' }}>
              Please wait while we generate your Scope of Work.<br/>
              Do not close this window.
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .icon-bounce {
          animation: bounceIcon 1s infinite;
        }
        @keyframes fadeInContent {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-content {
          animation: fadeInContent 0.4s ease-out;
        }
      `}</style>
      {/* Preview Modal */}
      {previewFile && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(2px)'
        }}
        onClick={() => setPreviewFile(null)}
        >
          <div style={{
            backgroundColor: 'var(--app-color-surface)',
            width: '100%',
            height: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            borderRadius: 'var(--app-radius-md)',
            border: '1px solid var(--app-color-border)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--app-shadow-soft)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--app-color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon name="file-text" size={24} style={{ color: 'var(--app-color-primary)' }} />
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }} title={previewFile.name}>
                  {previewFile.name.length > 40 ? previewFile.name.substring(0, 40) + '...' : previewFile.name}
                </h2>
              </div>
              <button 
                onClick={() => setPreviewFile(null)}
                className="icon-button"
                aria-label="Close"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <div style={{
              flex: 1,
              backgroundColor: 'var(--app-color-bg)',
              display: 'flex',
              justifyContent: 'center',
              padding: '24px',
              overflow: 'auto',
            }}>
              <div style={{
                backgroundColor: 'var(--app-color-surface)',
                width: '100%',
                maxWidth: '900px',
                padding: '64px',
                boxShadow: 'var(--app-shadow-soft)',
                color: 'var(--app-color-text)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                lineHeight: '1.6',
                minHeight: 'max-content',
                border: '1px solid var(--app-color-border)'
              }}>
                <section>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>1. Document Content Placeholder</h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>This is a mock preview of {previewFile.name}. In a real application, the actual document content (PDF, DOCX, etc.) would be rendered here.</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
}
