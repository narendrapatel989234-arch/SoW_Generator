import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { RichEditor } from '../components/ui/RichEditor';
import { AlertModal } from '../components/ui/AlertModal';
import { Badge } from '../components/ui/Badge';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import pptxgen from 'pptxgenjs';
import { Card } from '../components/ui/Card';

const initialTocItems = [
  { title: 'Executive Summary', score: 95 },
  { title: 'Objectives', score: 92 },
  { title: 'Project Scope', score: 88 },
  { title: 'Solution Architecture', score: 85 },
  { title: 'Technical Requirements', score: 90 },
  { title: 'Deliverables', score: 94 },
  { title: 'Timeline', score: 87 },
  { title: 'Commercial Proposal', score: 58 },
  { title: 'Risks & Assumptions', score: 86 },
  { title: 'Acceptance Criteria', score: 91 }
];

const processingStages = [
  'Uploading RFP and Supporting documents',
  'Analyzing selected Previous SOWs for reference',
  'Extracting business requirements',
  'Mapping historical context to project scope',
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

export type ActivityCategory = 'upload' | 'generation' | 'edit' | 'tag' | 'delete' | 'export' | 'review' | 'approval';

export interface ActivityItem {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  sectionName?: string;
  previousValue?: string | string[];
  updatedValue?: string | string[];
  metadata?: {
    aiInstruction?: string;
    approvalComment?: string;
  };
}

const mockActivities: ActivityItem[] = [
  {
    id: 'act-14',
    category: 'export',
    title: 'Document Exported',
    description: 'Exported as PDF Document (.pdf)',
    user: 'Dipali Balkrishna Patil',
    timestamp: new Date(Date.now() - 1000 * 60 * 2)
  },
  {
    id: 'act-13',
    category: 'approval',
    title: 'Final Document Approved',
    description: 'All sections have been reviewed and approved.',
    user: 'Project Sponsor',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    metadata: { approvalComment: 'Looks great. Proceed with sending to client.' }
  },
  {
    id: 'act-12',
    category: 'review',
    title: 'Review Comments Added',
    description: 'Added 3 comments regarding pricing structure.',
    sectionName: 'Commercial Proposal',
    user: 'Finance Reviewer',
    timestamp: new Date(Date.now() - 1000 * 60 * 35)
  },
  {
    id: 'act-11',
    category: 'delete',
    title: 'Paragraph Deleted',
    description: 'Removed outdated security clause.',
    sectionName: 'Technical Requirements',
    user: 'Dipali Balkrishna Patil',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    previousValue: '"Legacy TLS 1.1 support is required."'
  },
  {
    id: 'act-10',
    category: 'generation',
    title: 'Section Regenerated',
    description: 'Commercial Proposal regenerated using AI.',
    sectionName: 'Commercial Proposal',
    user: 'AI Assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 85),
    metadata: { aiInstruction: 'Make the pricing breakdown more granular and aligned with Azure consumption models.' },
    previousValue: 'Lump sum pricing of $150,000 for the migration.',
    updatedValue: 'Detailed breakdown: Compute $50k, Storage $30k, Services $70k.'
  },
  {
    id: 'act-9',
    category: 'approval',
    title: 'Section Approved',
    description: 'Approved the Technical Requirements section',
    sectionName: 'Technical Requirements',
    user: 'Sujith Thomas',
    timestamp: new Date(Date.now() - 1000 * 60 * 110)
  },
  {
    id: 'act-8',
    category: 'edit',
    title: 'Content Updated',
    description: 'Manually edited the Executive Summary content',
    sectionName: 'Executive Summary',
    user: 'Dipali Balkrishna Patil',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    previousValue: '"Cloud migration improves scalability."',
    updatedValue: '"Cloud migration improves scalability, security, and operational efficiency."'
  },
  {
    id: 'act-7',
    category: 'delete',
    title: 'Section Deleted',
    description: 'Commercial Proposal was removed from the document.',
    sectionName: 'Commercial Proposal',
    user: 'PMO',
    timestamp: new Date(Date.now() - 1000 * 60 * 150),
    previousValue: 'This section contained the detailed commercial proposal, including the pricing breakdown, payment milestones, and billing terms which are now moved to a separate contract.'
  },
  {
    id: 'act-6',
    category: 'review',
    title: 'Reviewer Added',
    description: 'Narendra Patel was assigned as Technical Reviewer for the Solution Architecture section.',
    sectionName: 'Solution Architecture',
    user: 'Dipali Balkrishna Patil',
    timestamp: new Date(Date.now() - 1000 * 60 * 200),
    metadata: { approvalComment: 'Please review the cloud migration strategy and ensure it aligns with our enterprise security standards.' }
  },
  {
    id: 'act-5',
    category: 'tag',
    title: 'Applicable Tags Updated',
    description: 'Modified tags to better align with the reference SOWs',
    user: 'Dipali Balkrishna Patil',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    previousValue: ['Healthcare', 'Azure'],
    updatedValue: ['Healthcare', 'Azure', 'Compliance', 'Security']
  },
  {
    id: 'act-4',
    category: 'generation',
    title: 'Section Regenerated',
    description: 'Solution Architecture regenerated using AI.',
    sectionName: 'Solution Architecture',
    user: 'AI Assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    metadata: { aiInstruction: 'Rewrite the architecture section to emphasize a microservices approach using Azure Kubernetes Service (AKS) and highlight the zero-trust security model.' },
    previousValue: 'The architecture uses a monolithic structure deployed on Azure VMs.',
    updatedValue: 'The revised architecture employs a microservices model hosted on Azure Kubernetes Service (AKS), incorporating a zero-trust security framework.'
  },
  {
    id: 'act-3',
    category: 'generation',
    title: 'Draft Generated',
    description: 'Initial SOW draft generated successfully from selected inputs.',
    user: 'AI Assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: 'act-2',
    category: 'upload',
    title: 'Supporting Documents Uploaded',
    description: 'Uploaded 2 architecture diagrams.',
    user: 'Dipali Balkrishna Patil',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 2)
  },
  {
    id: 'act-1',
    category: 'upload',
    title: 'RFP Uploaded',
    description: 'Uploaded initial RFP document.',
    user: 'Dipali Balkrishna Patil',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 5)
  }
];

interface SOWDraftProps {
  isReviewMode?: boolean;
}

export function SOWDraft({ isReviewMode = false }: SOWDraftProps) {
  const [activeTab, setActiveTab] = useState<'rfp' | 'sow' | 'activity'>('sow');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [tocItems, setTocItems] = useState<{title: string, score: number, status?: string}[]>(initialTocItems);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(mockActivities);
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});

  const toggleActivityExpand = (id: string) => {
    setExpandedActivities(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Processing States
  const [isProcessing, setIsProcessing] = useState(!isReviewMode);
  const [processingProgress, setProcessingProgress] = useState(isReviewMode ? 100 : 0);
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
  const [toastMessage, setToastMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Export Menu States
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportToastMessage, setExportToastMessage] = useState('');
  const [reviewerPopupSection, setReviewerPopupSection] = useState<number | null>(null);
  const [approvePopupSection, setApprovePopupSection] = useState<number | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  
  // TOC Menu States
  const [hoveredTocIndex, setHoveredTocIndex] = useState<number | null>(null);
  const [openTocMenuIndex, setOpenTocMenuIndex] = useState<number | null>(null);

  // Preview State
  const [previewFile, setPreviewFile] = useState<{name: string, size?: string} | null>(null);

  const handleExportWord = async () => {
    setExportToastMessage('Word export started...');
    
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Statement of Work (SOW)",
              heading: HeadingLevel.TITLE,
            }),
            ...tocItems.flatMap(item => [
              new Paragraph({
                text: item.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
              }),
              new Paragraph({
                text: `This section contains details regarding the ${item.title}. The content here is generated based on RFP requirements and supporting documents.`,
              })
            ])
          ],
        },
      ],
    });

    try {
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SOW_Document.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setExportToastMessage('Word export completed successfully.');
      
      // Add to activity log
      const newActivity = {
        id: `act-${Date.now()}`,
        category: 'export' as ActivityCategory,
        title: 'Document Exported',
        description: 'SOW Draft exported as Word Document (.docx)',
        user: 'Dipali Balkrishna Patil',
        timestamp: new Date()
      };
      setActivityLog(prev => [newActivity, ...prev]);
    } catch (error) {
      setExportToastMessage('Failed to export Word document.');
    }
    setTimeout(() => setExportToastMessage(''), 3000);
  };

  const handleExportPPT = () => {
    setExportToastMessage('PPT export started...');
    
    try {
      const pptx = new pptxgen();
      
      // Title slide
      let slide = pptx.addSlide();
      slide.addText('Statement of Work', { x: 1, y: 2, w: '80%', h: 1, fontSize: 36, bold: true, align: 'center', color: '0d212c' });
      slide.addText('Generated by M42', { x: 1, y: 3, w: '80%', h: 1, fontSize: 18, align: 'center', color: '5b7e95' });
      
      // Content slides
      tocItems.forEach(item => {
        let contentSlide = pptx.addSlide();
        contentSlide.addText(item.title, { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 24, bold: true, color: '0d212c' });
        contentSlide.addText(`• Key requirements for ${item.title}\n• Implementation strategy\n• Deliverables and timeline`, { x: 0.5, y: 1.5, w: '90%', h: 3, fontSize: 16, color: '5b7e95' });
      });
      
      pptx.writeFile({ fileName: 'SOW_Presentation.pptx' }).then(() => {
        setExportToastMessage('PPT export completed successfully.');
        
        // Add to activity log
        const newActivity = {
          id: `act-${Date.now()}`,
          category: 'export' as ActivityCategory,
          title: 'Presentation Exported',
          description: 'SOW Draft exported as PowerPoint Presentation (.pptx)',
          user: 'Dipali Balkrishna Patil',
          timestamp: new Date()
        };
        setActivityLog(prev => [newActivity, ...prev]);
        
        setTimeout(() => setExportToastMessage(''), 3000);
      });
    } catch (error) {
      setExportToastMessage('Failed to export PPT presentation.');
      setTimeout(() => setExportToastMessage(''), 3000);
    }
  };

  const filteredSuggestions = mockTeamMembers.filter(member => 
    (member.name.toLowerCase().includes(recipientSearch.toLowerCase()) || 
     member.role.toLowerCase().includes(recipientSearch.toLowerCase())) &&
    !selectedRecipients.find(r => r.name === member.name)
  );

  const handleShareSubmit = () => {
    setIsSharing(true);
    const isReviewerPopup = reviewerPopupSection !== null;
    
    setTimeout(() => {
      setIsSharing(false);
      setIsShareModalOpen(false);
      setReviewerPopupSection(null);
      setToastMessage(isReviewerPopup ? 'Reviewer added successfully' : 'SOW draft shared successfully');
      
      // Reset modal state
      setRecipientSearch('');
      setSelectedRecipients([]);
      setMessage('');
      
      setTimeout(() => setToastMessage(''), 3000);
    }, 1500);
  };


  useEffect(() => {
    const isAnyModalOpen = isShareModalOpen || isProcessing || isFadingOut || reviewerPopupSection !== null || approvePopupSection !== null || previewFile !== null;
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      
      // Inject global style to stop all internal scrolling
      if (!document.getElementById('modal-no-scroll')) {
        const style = document.createElement('style');
        style.id = 'modal-no-scroll';
        style.innerHTML = `
          html, body, #root, .app-layout, .app-main, .app-content, .main-content, .main-content *, .app-sidebar__content {
            overflow: hidden !important;
          }
          .main-content, .main-content *, .app-sidebar__content {
            pointer-events: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      document.body.style.overflow = 'unset';
      const style = document.getElementById('modal-no-scroll');
      if (style) style.remove();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isShareModalOpen) setIsShareModalOpen(false);
        if (reviewerPopupSection !== null) setReviewerPopupSection(null);
        if (approvePopupSection !== null) setApprovePopupSection(null);
        if (previewFile !== null) setPreviewFile(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      const style = document.getElementById('modal-no-scroll');
      if (style) style.remove();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShareModalOpen, isProcessing, isFadingOut, reviewerPopupSection, approvePopupSection, previewFile]);

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
            <button 
              className={`tab-item ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity Log
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
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
                        handleExportWord();
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '12px 16px',
                        backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid var(--app-color-border)',
                        cursor: 'pointer', color: 'var(--app-color-text)', fontSize: '14px', textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Icon name="file-text" size={16} /> Export as Word
                    </button>
                    <button 
                      onClick={() => {
                        setShowExportMenu(false);
                        handleExportPPT();
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '12px 16px',
                        backgroundColor: 'transparent', border: 'none',
                        cursor: 'pointer', color: 'var(--app-color-text)', fontSize: '14px', textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Icon name="grid" size={16} /> Export as PPT
                    </button>
                  </div>
                </>
              )}
            </div>
        </div>
      </div>

      <div 
        className="sow-workspace"
        style={activeTab !== 'sow' ? { display: 'block', height: 'auto', overflow: 'visible' } : {}}
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
                        onMouseEnter={() => setHoveredTocIndex(idx)}
                        onMouseLeave={() => setHoveredTocIndex(null)}
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--app-color-accent)' }} />
                            <span style={{ fontSize: '13px' }}>{item.title}</span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '24px', height: '24px', justifyContent: 'flex-end' }}>
                            {item.status === 'Approved' ? (
                              <Icon name="check-circle" size={18} style={{ color: 'var(--app-color-success)' }} />
                            ) : !(hoveredTocIndex === idx || openTocMenuIndex === idx) ? (
                              <div title="AI Generation Accuracy" style={{ 
                                fontSize: '12px', 
                                fontWeight: 700, 
                                color: item.score >= 90 ? 'var(--app-color-success)' : item.score >= 60 ? '#d97706' : 'var(--app-color-danger)'
                              }}>
                                {item.score}%
                              </div>
                            ) : (
                              <div style={{ position: 'relative' }}>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenTocMenuIndex(openTocMenuIndex === idx ? null : idx);
                                  }}
                                  style={{
                                    background: 'transparent', border: 'none', padding: '4px',
                                    cursor: 'pointer', color: 'var(--app-color-text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: '4px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <Icon name="more-horizontal" size={16} />
                                </button>
                                
                                {openTocMenuIndex === idx && (
                                  <>
                                    <div 
                                      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenTocMenuIndex(null);
                                      }}
                                    />
                                    <div className="context-menu-animate" style={{
                                      position: 'absolute', top: 'calc(100% + 8px)', left: '4px',
                                      backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)',
                                      borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100,
                                      minWidth: '220px', overflow: 'hidden', padding: '6px'
                                    }}>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setOpenTocMenuIndex(null); }}
                                        style={{
                                          display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '10px 12px',
                                          backgroundColor: 'transparent', border: 'none', borderRadius: '4px',
                                          cursor: 'pointer', color: 'var(--app-color-text)', fontSize: '14px', textAlign: 'left',
                                          marginBottom: '2px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                      >
                                        <Icon name="refresh-cw" size={18} /> Regenerate Section
                                      </button>
                                      
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setReviewerPopupSection(idx); setOpenTocMenuIndex(null); }}
                                        style={{
                                          display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '10px 12px',
                                          backgroundColor: 'transparent', border: 'none', borderRadius: '4px',
                                          cursor: 'pointer', color: 'var(--app-color-text)', fontSize: '14px', textAlign: 'left',
                                          marginBottom: '2px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                      >
                                        <Icon name="user-plus" size={18} /> Add Reviewer
                                      </button>

                                      
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setApprovePopupSection(idx); setOpenTocMenuIndex(null); }}
                                        style={{
                                          display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '10px 12px',
                                          backgroundColor: 'transparent', border: 'none', borderRadius: '4px',
                                          cursor: 'pointer', color: 'var(--app-color-text)', fontSize: '14px', textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                      >
                                        <Icon name="check" size={18} /> Approve
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
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
                    tocItems={tocItems.map(t => t.title)} 
                    activeSectionIndex={activeSectionIndex}
                    isGenerating={false}
                    readOnly={tocItems[activeSectionIndex]?.status === 'Approved'}
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

              <Card title={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>Selected Previous SOWs</div>
                  </div>
                </div>
              }>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                        backgroundColor: 'var(--app-color-surface)',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        border: '1px solid var(--app-color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div>
                              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--app-color-text)', lineHeight: 1.4 }}>
                                Cloud Migration & Infrastructure Modernization - Phase 1
                              </h3>
                            </div>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', alignItems: 'center', gap: '6px', 
                            padding: '4px 12px', backgroundColor: 'var(--app-color-success-soft)', 
                            color: 'var(--app-color-success)', borderRadius: '20px', fontWeight: 600, fontSize: '13px',
                          }}>
                            Match Score: 95%
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginLeft: '0' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '6px', fontWeight: 500 }}>Tags</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {['Cloud', 'Azure', 'Migration', 'DevOps'].map(t => (
                                <span key={t} className="tag-chip" style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>{t}</span>
                              ))}
                              <span title="Data, Networking, Storage" className="tag-chip" style={{ cursor: 'default', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>
                                + 3
                              </span>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--app-color-success)', marginBottom: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="check-circle" size={12} /> Matching Tags
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {['Cloud', 'Azure', 'Migration', 'Infrastructure'].map(t => (
                                <span key={t} className="tag-chip">{t}</span>
                              ))}
                              <span title="Modernization" className="tag-chip" style={{ cursor: 'default' }}>
                                + 1
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Selected SOW */}
                      <div style={{
                        backgroundColor: 'var(--app-color-surface)',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        border: '1px solid var(--app-color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div>
                              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--app-color-text)', lineHeight: 1.4 }}>
                                Enterprise Healthcare Platform Azure Migration
                              </h3>
                            </div>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', alignItems: 'center', gap: '6px', 
                            padding: '4px 12px', backgroundColor: 'var(--app-color-success-soft)', 
                            color: 'var(--app-color-success)', borderRadius: '20px', fontWeight: 600, fontSize: '13px',
                          }}>
                            Match Score: 89%
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginLeft: '0' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '6px', fontWeight: 500 }}>Tags</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {['Healthcare', 'Azure', 'Security'].map(t => (
                                <span key={t} className="tag-chip" style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>{t}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--app-color-success)', marginBottom: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="check-circle" size={12} /> Matching Tags
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {['Healthcare', 'Azure'].map(t => (
                                <span key={t} className="tag-chip">{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
              </Card>

            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div style={{ padding: '32px 48px', height: '100%', overflowY: 'auto', backgroundColor: 'var(--app-color-bg)' }}>
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--app-color-primary)', margin: '0 0 8px 0' }}>Activity Log</h2>
                <p style={{ margin: 0, color: 'var(--app-color-text-muted)', fontSize: '14px' }}>A complete audit trail of all actions performed on this SOW document.</p>
              </div>

              {activityLog.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'var(--app-color-surface)', borderRadius: '12px', border: '1px dashed var(--app-color-border)' }}>
                  <Icon name="activity" size={32} style={{ color: 'var(--app-color-text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ color: 'var(--app-color-text)', fontSize: '15px', fontWeight: 500, margin: '0 0 8px 0' }}>No activity available yet.</p>
                  <p style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', margin: 0 }}>Activities will appear here once changes are made to the document.</p>
                </div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  {/* Vertical Timeline Line */}
                  <div style={{ position: 'absolute', top: '16px', bottom: '16px', left: '23px', width: '2px', backgroundColor: 'var(--app-color-border)', zIndex: 0 }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {activityLog.map((log) => {
                      const iconConfig = (() => {
                        switch(log.category) {
                          case 'upload': return { name: 'upload-cloud', color: 'var(--app-color-accent)', bg: 'var(--app-color-accent-soft)' };
                          case 'generation': return { name: 'sparkles', color: '#8b5cf6', bg: '#ede9fe' };
                          case 'edit': return { name: 'edit', color: '#0ea5e9', bg: '#e0f2fe' };
                          case 'tag': return { name: 'tag', color: '#d97706', bg: '#fef3c7' };
                          case 'delete': return { name: 'trash', color: 'var(--app-color-danger)', bg: 'var(--app-color-danger-soft)' };
                          case 'export': return { name: 'download', color: 'var(--app-color-primary)', bg: 'var(--app-color-surface-muted)' };
                          case 'review': return { name: 'user-plus', color: '#0ea5e9', bg: '#e0f2fe' };
                          case 'approval': return { name: 'check-circle', color: 'var(--app-color-success)', bg: 'var(--app-color-success-soft)' };
                          default: return { name: 'activity', color: 'var(--app-color-text-muted)', bg: 'var(--app-color-surface-muted)' };
                        }
                      })();
                      
                      const showExpand = log.previousValue !== undefined;
                      const isExpanded = expandedActivities[log.id];

                      return (
                        <div key={log.id} style={{ position: 'relative', display: 'flex', gap: '16px', zIndex: 1 }}>
                          {/* Timeline Badge */}
                          <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                            backgroundColor: iconConfig.bg, color: iconConfig.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid var(--app-color-surface)', marginLeft: '-16px', zIndex: 2
                          }}>
                            <Icon name={iconConfig.name as any} size={16} />
                          </div>
                          
                          {/* Card */}
                          <div style={{ 
                            flex: 1, backgroundColor: 'var(--app-color-surface)', borderRadius: '12px',
                            border: '1px solid var(--app-color-border)', overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                          }}>
                            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              
                              {/* Card Header & Description */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)' }}>{log.title}</h3>
                                    {log.sectionName && (
                                      <Badge tone="default" style={{ fontSize: '11px', padding: '2px 8px' }}>{log.sectionName}</Badge>
                                    )}
                                  </div>
                                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
                                    {log.description}
                                  </p>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', whiteSpace: 'nowrap', textAlign: 'right' }}>
                                  <div style={{ fontWeight: 500, color: 'var(--app-color-text)' }}>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(log.timestamp)}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                                    <Icon name={log.user === 'AI Assistant' ? 'sparkles' : 'user'} size={12} /> {log.user}
                                  </div>
                                </div>
                              </div>

                              {/* Full Width Metadata (AI Instruction / Comments) */}
                              {log.metadata?.aiInstruction && (
                                <div style={{ width: '100%', marginTop: '4px', padding: '10px 14px', backgroundColor: '#f5f3ff', borderRadius: '6px', borderLeft: '3px solid #8b5cf6' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#6d28d9', marginBottom: '6px' }}><Icon name="sparkles" size={12} /> AI INSTRUCTION</div>
                                  <div style={{ fontSize: '13px', color: '#4c1d95', fontStyle: 'italic', lineHeight: 1.5 }}>"{log.metadata.aiInstruction}"</div>
                                </div>
                              )}
                              {log.metadata?.approvalComment && (
                                <div style={{ width: '100%', marginTop: '4px', padding: '10px 14px', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '6px', borderLeft: '3px solid var(--app-color-border)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--app-color-text-muted)', marginBottom: '6px' }}><Icon name="file-text" size={12} /> COMMENT</div>
                                  <div style={{ fontSize: '13px', color: 'var(--app-color-text)', lineHeight: 1.5 }}>"{log.metadata.approvalComment}"</div>
                                </div>
                              )}

                              {/* Expandable Action */}
                              {showExpand && (
                                <div>
                                  <button 
                                    onClick={() => toggleActivityExpand(log.id)}
                                    style={{
                                      background: 'none', border: 'none', padding: 0,
                                      color: 'var(--app-color-accent)', fontSize: '13px', fontWeight: 500,
                                      display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer'
                                    }}
                                  >
                                    {isExpanded ? 'Hide details' : 'View details'} <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={14} />
                                  </button>
                                  
                                  {isExpanded && (
                                    <div style={{ 
                                      marginTop: '12px', display: 'grid', gridTemplateColumns: log.updatedValue ? '1fr 1fr' : '1fr', gap: '16px',
                                      backgroundColor: 'var(--app-color-surface-muted)', padding: '16px', borderRadius: '8px',
                                      border: '1px solid var(--app-color-border)'
                                    }}>
                                      <div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--app-color-danger)' }} /> Previous
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--app-color-text)', lineHeight: 1.5 }}>
                                          {Array.isArray(log.previousValue) ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                              {log.previousValue.map(t => <span key={t} className="tag-chip">{t}</span>)}
                                            </div>
                                          ) : (
                                            <div style={{ padding: '8px 12px', backgroundColor: 'var(--app-color-surface)', borderRadius: '6px', border: '1px solid var(--app-color-border)', color: 'var(--app-color-danger)', textDecoration: 'line-through' }}>
                                              {log.previousValue}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {log.updatedValue && (
                                        <div>
                                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--app-color-success)' }} /> Updated
                                          </div>
                                          <div style={{ fontSize: '13px', color: 'var(--app-color-text)', lineHeight: 1.5 }}>
                                            {Array.isArray(log.updatedValue) ? (
                                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {log.updatedValue.map(t => <span key={t} className="tag-chip">{t}</span>)}
                                              </div>
                                            ) : (
                                              <div style={{ padding: '8px 12px', backgroundColor: 'var(--app-color-surface)', borderRadius: '6px', border: '1px solid var(--app-color-border)', color: 'var(--app-color-success)' }}>
                                                {log.updatedValue}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
      {toastMessage && (
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
          {toastMessage}
        </div>
      )}

      {/* Add Reviewer Confirmation Modal */}
      {reviewerPopupSection !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setReviewerPopupSection(null)}>
          <div style={{
            width: 'min(400px, calc(100vw - 32px))',
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
                <Icon name="user-plus" size={24} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '8px' }}>Add Reviewer</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>Search and select team members to review the <span style={{ fontWeight: 600, color: 'var(--app-color-primary)' }}>{tocItems[reviewerPopupSection]?.title}</span> section.</p>
            </div>
            
            {/* Body */}
            <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Recipient Search */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--app-color-primary)', marginBottom: '8px' }}>
                  Add reviewers <span style={{ color: 'var(--app-color-danger)' }}>*</span>
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
              <Button variant="ghost" onClick={() => setReviewerPopupSection(null)} style={{ border: '1px solid var(--app-color-border)', flex: 1, justifyContent: 'center', padding: '10px 0' }}>Cancel</Button>
              <Button variant="accent" onClick={handleShareSubmit} disabled={selectedRecipients.length === 0 || isSharing} style={{ flex: 1, justifyContent: 'center', padding: '10px 0' }}>
                {isSharing ? (
                  <><Icon name="loader" size={16} className="icon-spin" /> Adding...</>
                ) : (
                  <>Add Reviewer</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Section Confirmation Modal */}
      {approvePopupSection !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setApprovePopupSection(null)}>
          <div style={{
            width: 'min(400px, calc(100vw - 32px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '32px 32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
              }}>
                <Icon name="check" size={24} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '8px' }}>Approve Section</h2>
              <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: 'var(--app-color-text)', lineHeight: 1.5 }}>
                Are you sure you want to approve this section?
              </p>
              <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
                Once approved, this section will be marked as Approved.
              </p>

              {/* Information Card */}
              <div style={{ 
                width: '100%', padding: '16px', backgroundColor: 'var(--app-color-surface-muted)', 
                borderRadius: '8px', border: '1px solid var(--app-color-border)',
                display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', fontWeight: 500 }}>Section Name:</span>
                  <span style={{ fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 600 }}>{tocItems[approvePopupSection as number]?.title}</span>
                </div>
              </div>

              {/* Approval Comments */}
              <div style={{ width: '100%', textAlign: 'left', marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--app-color-text)', marginBottom: '8px' }}>
                  Approval Comments
                </label>
                <textarea 
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Add approval comments or notes (optional)..."
                  style={{
                    width: '100%', height: '80px', padding: '12px',
                    border: '1px solid var(--app-color-border)', borderRadius: '6px',
                    backgroundColor: 'var(--app-color-surface)', fontSize: '13px',
                    color: 'var(--app-color-text)', resize: 'none', outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ padding: '0 32px 32px', display: 'flex', justifyContent: 'center', gap: '16px', width: '100%' }}>
              <Button variant="ghost" onClick={() => {
                setApprovePopupSection(null);
                setApprovalComment('');
              }} style={{ border: '1px solid var(--app-color-border)', flex: 1, justifyContent: 'center', padding: '10px 0' }}>
                Cancel
              </Button>
              <Button variant="accent" onClick={() => {
                if (approvePopupSection === null) return;
                const newItems = [...tocItems];
                newItems[approvePopupSection].status = 'Approved';
                setTocItems(newItems);
                
                const newActivity: ActivityItem = {
                  id: `act-${Date.now()}`,
                  category: 'approval',
                  title: 'Section Approved',
                  description: `Approved the ${tocItems[approvePopupSection]?.title} section`,
                  sectionName: tocItems[approvePopupSection]?.title,
                  user: 'Dipali Balkrishna Patil',
                  timestamp: new Date(),
                  metadata: approvalComment.trim() ? { approvalComment: approvalComment.trim() } : undefined
                };
                setActivityLog(prev => [newActivity, ...prev]);
                
                setApprovePopupSection(null);
                setApprovalComment('');
                setToastMessage('Section approved successfully.');
                setTimeout(() => setToastMessage(''), 3000);
              }} style={{ flex: 1, justifyContent: 'center', padding: '10px 0' }}>
                Approve
              </Button>
            </div>
          </div>
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
                  : 'Generating your draft using the uploaded RFP, supporting documents, and the selected reference SOW.'}
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
