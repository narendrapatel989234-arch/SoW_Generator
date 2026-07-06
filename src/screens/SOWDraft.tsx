import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { RichEditor } from '../components/ui/RichEditor';

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isShareModalOpen) {
        setIsShareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShareModalOpen]);

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
                        setExportToastMessage('TXT export started.');
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
                      <Icon name="file" size={16} /> Export as TXT
                    </button>
                  </div>
                </>
              )}
            </div>
        </div>
      </div>

      <div className="sow-workspace">
        {activeTab === 'sow' && (
          <>
            {/* TOC Sidebar */}
            <div className="sow-toc-sidebar">
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--app-color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Table of Contents</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            <div className="sow-main-content-wrapper" style={{ position: 'relative', height: '100%', minHeight: '900px' }}>
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
          <div style={{ padding: '32px', width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px', gridColumn: '1 / -1' }}>
             
             {/* 1. Primary RFP */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)' }}>RFP Document</h3>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)', borderRadius: '8px', width: '100%' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--app-color-primary-soft)', color: 'var(--app-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
                     <Icon name="file-text" size={20} />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--app-color-text)' }}>Project_Requirements_v2.pdf</div>
                     <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span>4.2 MB</span>
                       <span>•</span>
                       <span style={{ color: 'var(--app-color-success)' }}>Uploaded Just now</span>
                     </div>
                   </div>
                 </div>
                 <Button variant="ghost" style={{ padding: '8px' }}>
                   <Icon name="external-link" size={16} />
                 </Button>
               </div>
             </div>

             {/* 2. Document Info */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)' }}>Document Info</h3>
               <div style={{ backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)', borderRadius: '8px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                 <div><div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Title</div><div style={{ fontSize: '14px', fontWeight: 500 }}>Global Infrastructure Modernization</div></div>
                 <div><div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Client</div><div style={{ fontSize: '14px', fontWeight: 500 }}>Acme Corp</div></div>
                 <div><div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Format</div><div style={{ fontSize: '14px', fontWeight: 500 }}>PDF Document</div></div>
                 <div><div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Total Files</div><div style={{ fontSize: '14px', fontWeight: 500 }}>2 Documents</div></div>
               </div>
             </div>
             
             {/* 3. Supporting Documents */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)' }}>Supporting Documents</h3>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)', borderRadius: '8px', width: '100%' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--app-color-surface-muted)', color: 'var(--app-color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
                     <Icon name="paperclip" size={20} />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--app-color-text)' }}>Architecture_Diagrams.png</div>
                     <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span>1.8 MB</span>
                       <span>•</span>
                       <span>Supporting</span>
                     </div>
                   </div>
                 </div>
                 <Button variant="ghost" style={{ padding: '8px' }}>
                   <Icon name="external-link" size={16} />
                 </Button>
               </div>
             </div>

             {/* 4. Tags */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)' }}>Applicable Tags</h3>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px', backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)', borderRadius: '8px' }}>
                 {['Cloud Migration', 'Security', 'Azure', 'Infrastructure', 'Modernization'].map(tag => (
                   <span key={tag} style={{ backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-primary)', fontSize: '13px', fontWeight: 500, padding: '6px 12px', borderRadius: '16px', border: 'none' }}>
                     {tag}
                   </span>
                 ))}
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
            width: '560px',
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

      {/* Share Toast */}
      {showShareToast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', width: '380px', maxWidth: 'calc(100vw - 48px)',
          backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)',
          borderLeft: '4px solid var(--app-color-success)', boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
          padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px',
          zIndex: 1000, animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div style={{ color: 'var(--app-color-success)', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            <Icon name="check-circle" size={20} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ color: 'var(--app-color-text)', fontWeight: 600, fontSize: '14px' }}>
              SOW draft shared successfully
            </div>
          </div>
          <button 
            onClick={() => setShowShareToast(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--app-color-text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
            aria-label="Close notification"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      )}

      {/* Export Toast */}
      {exportToastMessage && (
        <div style={{
          position: 'fixed', top: showShareToast ? '90px' : '24px', right: '24px', width: '380px', maxWidth: 'calc(100vw - 48px)',
          backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)',
          borderLeft: '4px solid var(--app-color-success)', boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
          padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px',
          zIndex: 1000, animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div style={{ color: 'var(--app-color-success)', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            <Icon name="check-circle" size={20} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ color: 'var(--app-color-text)', fontWeight: 600, fontSize: '14px' }}>
              {exportToastMessage}
            </div>
          </div>
          <button 
            onClick={() => setExportToastMessage('')}
            style={{ background: 'transparent', border: 'none', color: 'var(--app-color-text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
            aria-label="Close notification"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      )}

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
            width: 'calc(100% - 32px)',
            maxWidth: '560px',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            padding: '32px',
            display: 'flex', flexDirection: 'column',
            transform: isFadingOut ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.4s ease'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon name="loader" size={24} className="icon-spin" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '8px' }}>Generating Scope of Work</h2>
              <p style={{ color: 'var(--app-color-text-muted)', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                Your RFP has been uploaded successfully.<br/>
                Our AI is analysing the uploaded documents and preparing your first draft.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
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

            <div style={{ backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
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

            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--app-color-text-muted)', borderTop: '1px solid var(--app-color-border)', paddingTop: '16px' }}>
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
    </div>
    </>
  );
}
