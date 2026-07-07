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
  'Upload completed',
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
    const totalTime = 12000; // 12 seconds
    const intervalTime = 100;
    
    const timer = setInterval(() => {
      progress += (100 / (totalTime / intervalTime));
      setProcessingProgress(Math.min(progress, 100));
      
      const stepIndex = Math.min(
        Math.floor((progress / 100) * processingStages.length), 
        processingStages.length - 1
      );
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
    if (isShareModalOpen || isProcessing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isShareModalOpen) {
        setIsShareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShareModalOpen, isProcessing]);

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
                {tocItems.map((item, idx) => {
                  return (
                    <li key={idx} 
                      className={`toc-tab-item ${activeSectionIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveSectionIndex(idx)}
                    >
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--app-color-accent)' }} />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Main Content Area */}
            <div className="sow-main-content-wrapper" style={{ position: 'relative', height: '100%' }}>
              <div className="sow-main-content" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <RichEditor 
                  tocItems={tocItems} 
                  activeSectionIndex={activeSectionIndex}
                  isGenerating={isProcessing}
                  onSectionChange={setActiveSectionIndex}
                >
                </RichEditor>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'rfp' && (
          <div style={{ padding: '32px 32px 80px 32px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
              
              {/* Primary RFP (No Document Info) */}
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-text)', margin: 0 }}>RFP Document</h3>
                  <div 
                    style={{ margin: 0, display: 'flex', flexDirection: 'column', padding: '12px', border: '1px solid var(--app-color-border)', borderRadius: '8px', backgroundColor: 'var(--app-color-surface)', cursor: 'pointer' }}
                    onClick={() => setPreviewFile({ name: 'Project_Requirements_v2.pdf', size: '4.2 MB' })}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface)')}
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
                </div>
              </div>

              {/* Supporting Docs & Tags inside one Card */}
              <div>
                <Card>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-text)', margin: 0 }}>Supporting Documents</h3>
                      <div className="supporting-docs-grid">
                        {[
                          { name: 'Architecture_Diagrams.png', size: '1.8 MB' },
                          { name: 'Security_Compliance_Guidelines.pdf', size: '3.4 MB' },
                          { name: 'Vendor_Q_and_A.docx', size: '0.9 MB' },
                          { name: 'Legacy_API_Specs.json', size: '2.1 MB' }
                        ].map((doc, i) => (
                          <div 
                            key={i} 
                            style={{ margin: 0, display: 'flex', flexDirection: 'column', padding: '12px', border: '1px solid var(--app-color-border)', borderRadius: '8px', backgroundColor: 'var(--app-color-surface)', cursor: 'pointer' }}
                            onClick={() => setPreviewFile(doc)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface)')}
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
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-text)', margin: 0 }}>Applicable Tags</h3>
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
                    </div>
                    
                  </div>
                </Card>
              </div>
              
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
            width: '100%', maxWidth: '560px',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '12px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.1)',
            display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--app-color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '4px' }}>Share SOW Draft</h2>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--app-color-text-muted)' }}>Search and select team members to share this draft for review.</p>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--app-color-text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
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
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--app-color-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="ghost" onClick={() => setIsShareModalOpen(false)}>Cancel</Button>
              <Button variant="accent" onClick={handleShareSubmit} disabled={selectedRecipients.length === 0 || isSharing}>
                {isSharing ? (
                  <><Icon name="loader" size={16} className="icon-spin" /> Sharing...</>
                ) : (
                  <>Share Draft</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast Modal */}
      <AlertModal 
        isOpen={showShareToast}
        onClose={() => setShowShareToast(false)}
        title="SOW draft shared successfully"
        type="success"
      />

      {/* Export Toast Modal */}
      <AlertModal 
        isOpen={!!exportToastMessage}
        onClose={() => setExportToastMessage('')}
        title={exportToastMessage}
        type="success"
      />

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
            width: 'min(480px, calc(100vw - 48px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            padding: '24px 32px',
            display: 'flex', flexDirection: 'column',
            transform: isFadingOut ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.4s ease'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon name="loader" size={24} className="icon-spin" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '8px' }}>Generating Scope of Work</h2>
              <p style={{ color: 'var(--app-color-text-muted)', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                Your RFP has been uploaded successfully.<br/>
                Our AI is analysing the uploaded documents and preparing your first draft.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: 'var(--app-color-text-muted)' }}>
                <span style={{ fontWeight: 500 }}>Overall Progress</span>
                <span style={{ fontWeight: 600, color: 'var(--app-color-primary)' }}>{Math.round(processingProgress)}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: 'var(--app-color-accent)', width: `${processingProgress}%`, transition: 'width 0.1s linear' }} />
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--app-color-text-muted)', marginTop: '8px' }}>
                Estimated remaining time: {Math.max(0, Math.ceil(12 - (processingProgress / 100 * 12)))}s
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
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

            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--app-color-text-muted)', borderTop: '1px solid var(--app-color-border)', paddingTop: '16px', marginTop: 'auto' }}>
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
