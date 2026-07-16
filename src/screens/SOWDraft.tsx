import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { RichEditor } from '../components/ui/RichEditor';
import { AlertModal } from '../components/ui/AlertModal';
import { Badge } from '../components/ui/Badge';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import pptxgen from 'pptxgenjs';
import { Card } from '../components/ui/Card';
import { Stepper } from '../components/ui/Stepper';
import { MultiSelect } from '../components/ui/MultiSelect';
import { type Section } from '../screens/ValidateSOW';

const initialTocItems = [
  { title: 'Executive Summary', score: 95, status: 'Approved' },
  { title: 'Objectives', score: 82, status: 'With Reviewer', assignedReviewer: 'David Brown' },
  { title: 'Project Scope', score: 88, status: 'Awaiting PMO', assignedReviewer: 'Sujith Thomas', reviewerComment: 'Updated based on the requested security requirements.' },
  { title: 'Solution Architecture', score: 54, status: 'Approved' },
  { title: 'Technical Requirements', score: 90, status: 'Approved' },
  { title: 'Deliverables', score: 94, status: 'Approved' },
  { title: 'Timeline', score: 87, status: 'With Reviewer', assignedReviewer: 'David Brown' },
  { title: 'Commercial Proposal', score: 76, status: 'With Reviewer', assignedReviewer: 'Gopika Nair' },
  { title: 'Risks & Assumptions', score: 86, status: 'Awaiting PMO', assignedReviewer: 'Narendra Patel', reviewerComment: 'Added risk 4.3 regarding compliance.' },
  { title: 'Acceptance Criteria', score: 91, status: 'Approved' }
];

const processingStages = [
  'Initializing AI generation engine',
  'Analyzing validated SOW sections',
  'Drafting content for selected sections',
  'Synthesizing document structure',
  'Applying formatting and styles',
  'Generating final Scope of Work',
  'Ready for review'
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
    id: 'act-16',
    category: 'approval',
    title: 'Section Approved',
    description: 'Approved the Objectives section',
    sectionName: 'Objectives',
    user: 'David Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    metadata: { approvalComment: 'Looks good. Business goals align with the RFP.' }
  },
  {
    id: 'act-15',
    category: 'edit',
    title: 'Section Regenerated',
    description: 'Requested regeneration for the Timeline section',
    sectionName: 'Timeline',
    user: 'David Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    metadata: { aiInstruction: 'Please refine the timeline to highlight phase 1 deliverables more clearly.' }
  },
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
  isApprovedMode?: boolean;
  selectedSections?: string[];
  sections?: Section[];
  setSections?: React.Dispatch<React.SetStateAction<Section[]>>;
  globalReviewers?: string[];
  setGlobalReviewers?: React.Dispatch<React.SetStateAction<string[]>>;
  isDraftMode?: boolean;
  onSendForReview?: () => void;
  onSubmitFinal?: () => void;
  userRole?: string | null;
}

export function SOWDraft({ 
  isReviewMode = false, 
  isApprovedMode = false,
  isDraftMode = false,
  selectedSections, 
  sections = [], 
  setSections, 
  globalReviewers = [], 
  setGlobalReviewers,
  onSendForReview,
  onSubmitFinal,
  userRole = 'PMO'
}: SOWDraftProps) {
  const [activeTab, setActiveTab] = useState<'rfp' | 'configure' | 'sow' | 'activity'>('sow');
  const [hoveredScoreIndex, setHoveredScoreIndex] = useState<number | null>(null);
  const [hoveredReviewerIndex, setHoveredReviewerIndex] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Add Reviewer Modal State
  const [addReviewerSectionId, setAddReviewerSectionId] = useState<string | null>(null);
  const [reviewerSearch, setReviewerSearch] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState<TeamMember[]>([]);
  const [showReviewerSuggestions, setShowReviewerSuggestions] = useState(false);
  const [newReviewerMessage, setNewReviewerMessage] = useState('');
  const [newReviewerSections, setNewReviewerSections] = useState<string[]>([]);
  
  const filteredReviewerSuggestions = mockTeamMembers.filter(u => 
    !selectedReviewers.some(r => r.name === u.name) && 
    (u.name.toLowerCase().includes(reviewerSearch.toLowerCase()) || u.role.toLowerCase().includes(reviewerSearch.toLowerCase()))
  );

  const handleAddReviewer = () => {
    if (selectedReviewers.length > 0 && newReviewerSections.length > 0 && setSections && setGlobalReviewers) {
      selectedReviewers.forEach(reviewer => {
        const trimmedName = reviewer.name;
        if (!globalReviewers.includes(trimmedName)) {
          setGlobalReviewers(prev => [...prev, trimmedName]);
        }
        setSections(prev => prev.map(s => {
          if (newReviewerSections.includes(s.name) && !s.reviewers.includes(trimmedName)) {
            return { 
              ...s, 
              reviewers: [...s.reviewers, trimmedName],
              reviewerStatuses: { ...(s.reviewerStatuses || {}), [trimmedName]: 'Pending' }
            };
          }
          return s;
        }));
      });
      setAddReviewerSectionId(null);
      setSelectedReviewers([]);
      setReviewerSearch('');
      setNewReviewerMessage('');
      setNewReviewerSections([]);
    }
  };
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [tocItems, setTocItems] = useState<{title: string, score: number, status?: string, assignedReviewer?: string, reviewerComment?: string}[]>(
    selectedSections && selectedSections.length > 0
      ? selectedSections.map(title => ({ title, score: Math.random() > 0.2 ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 50 }))
      : initialTocItems
  );
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(mockActivities);
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});

  const toggleActivityExpand = (id: string) => {
    setExpandedActivities(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Processing States
  const [isProcessing, setIsProcessing] = useState(!(isReviewMode || isApprovedMode || isDraftMode));
  const [processingProgress, setProcessingProgress] = useState((isReviewMode || isApprovedMode || isDraftMode) ? 100 : 0);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isProcessing) return;
    
    let progress = 0;
    const totalTime = 4000; // 4 seconds total
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
  
  // Regenerate Section States
  const [regeneratePopupSection, setRegeneratePopupSection] = useState<number | null>(null);
  const [regenerationInstructions, setRegenerationInstructions] = useState('');

  // Global scroll lock for popups
  useEffect(() => {
    // Need to pull all these state variables into the check
  }, []); // We will redefine this below all the state declarations
  
  // Approval States
  const [reviewerPopupSection, setReviewerPopupSection] = useState<number | null>(null);
  const [approvePopupSection, setApprovePopupSection] = useState<number | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  
  // TOC Menu States
  const [hoveredTocIndex, setHoveredTocIndex] = useState<number | null>(null);
  const [openTocMenuIndex, setOpenTocMenuIndex] = useState<number | null>(null);

  // Preview State
  const [previewFile, setPreviewFile] = useState<{name: string, size?: string} | null>(null);

  // Hover states for Review Header
  const [showIdHover, setShowIdHover] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Global scroll lock for all popups
  useEffect(() => {
    if (
      addReviewerSectionId !== null || 
      isShareModalOpen || 
      regeneratePopupSection !== null ||
      reviewerPopupSection !== null ||
      approvePopupSection !== null ||
      showPreview
    ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [
    addReviewerSectionId, 
    isShareModalOpen, 
    regeneratePopupSection, 
    reviewerPopupSection, 
    approvePopupSection,
    showPreview
  ]);
  const [showBadgeHover, setShowBadgeHover] = useState(false);
  const idRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [idTooltipPos, setIdTooltipPos] = useState({ top: 0, left: 0 });
  const [badgeTooltipPos, setBadgeTooltipPos] = useState({ top: 0, left: 0 });

  const handleIdMouseEnter = () => {
    if (idRef.current) {
      const rect = idRef.current.getBoundingClientRect();
      setIdTooltipPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2
      });
      setShowIdHover(true);
    }
  };

  const handleBadgeMouseEnter = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setBadgeTooltipPos({
        top: rect.bottom + 8,
        left: rect.right
      });
      setShowBadgeHover(true);
    }
  };

  const handleScroll = () => {
    setShowIdHover(false);
    setShowBadgeHover(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

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
      });
    } catch (error) {
      setExportToastMessage('Failed to export PPT presentation.');
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
    const isAnyModalOpen = isShareModalOpen || isProcessing || isFadingOut || reviewerPopupSection !== null || approvePopupSection !== null || regeneratePopupSection !== null || previewFile !== null;
    
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
        if (regeneratePopupSection !== null) setRegeneratePopupSection(null);
        if (previewFile !== null) setPreviewFile(null);
        if (addReviewerSectionId !== null) {
          setAddReviewerSectionId(null);
          setSelectedReviewers([]);
          setReviewerSearch('');
          setNewReviewerMessage('');
          setNewReviewerSections([]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      const style = document.getElementById('modal-no-scroll');
      if (style) style.remove();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShareModalOpen, isProcessing, isFadingOut, reviewerPopupSection, approvePopupSection, regeneratePopupSection, previewFile]);

  const getSectionStatus = (section: any) => {
    if (!section.reviewers || section.reviewers.length === 0) {
      return 'Pending';
    }
    const statuses = section.reviewerStatuses || {};
    let highestPriorityStatus = 'Pending';
    let highestPriority = 0;
    
    // Priority order:
    // 3. Rejected
    // 2. Pending
    // 1. Approved

    section.reviewers.forEach((r: string) => {
      const s = statuses[r] || 'Pending';
      let priority = 1;
      if (s === 'Rejected') priority = 3;
      else if (s === 'Pending') priority = 2;
      else if (s === 'Approved' || s === 'Approve') priority = 1;
      
      if (priority > highestPriority) {
        highestPriority = priority;
        highestPriorityStatus = s === 'Approve' ? 'Approved' : s;
      }
    });
    return highestPriorityStatus;
  };

  const renderStatus = (section: any) => {
    const highestPriorityStatus = getSectionStatus(section);

    let tone = 'warning';
    switch (highestPriorityStatus) {
      case 'Rejected': tone = 'danger'; break;
      case 'Pending': tone = 'warning'; break;
      case 'Approved': tone = 'success'; break;
    }

    return (
      <Badge tone={tone as any}>
        {highestPriorityStatus}
      </Badge>
    );
  };

  const handleSendForReview = () => {
    // Validate that all included sections have at least one reviewer
    const missingReviewers = sections.filter(s => s.included && s.reviewers.length === 0);
    if (missingReviewers.length > 0) {
      setToastMessage('Validation failed: All enabled sections must have at least one reviewer assigned.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    
    // Pass validation
    if (onSendForReview) {
      onSendForReview();
      setToastMessage('SOW has been sent for review successfully.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const exportBlock = (
    <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>

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
              onClick={() => { setShowExportMenu(false); handleExportWord(); }}
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
              onClick={() => { setShowExportMenu(false); handleExportPPT(); }}
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
  );

  return (
    <>
    <div className="page-container" style={{ 
      display: 'flex', flexDirection: 'column', height: '100%', flex: 1, overflow: 'visible', minHeight: 0,
      pointerEvents: isProcessing ? 'none' : 'auto'
    }}>

        <Stepper 
          steps={[
            { id: 'analyze', label: 'Analyze' },
            { id: 'configure', label: 'Configure' },
            { id: 'generate', label: 'Generate' }
          ]} 
          currentStepId="generate" 
        />
      {/* Header */}
      <div className="screen-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--app-color-border)' }}>
        {/* Tabs */}
        <div className="tabs-container" style={{ margin: 0, borderBottom: 'none' }}>
            {userRole !== 'Reviewer' && (
              <button 
                className={`tab-item ${activeTab === 'rfp' ? 'active' : ''}`}
                onClick={() => setActiveTab('rfp')}
              >
                RFP
              </button>
            )}
            {userRole !== 'Reviewer' && (
              <button 
                className={`tab-item ${activeTab === 'configure' ? 'active' : ''}`}
                onClick={() => setActiveTab('configure')}
              >
                Configure Sections
              </button>
            )}
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
            {userRole !== 'Reviewer' && exportBlock}
            {userRole === 'PMO' && (() => {
              const isFullyApproved = tocItems.length > 0 && tocItems.every(item => item.status === 'Approved');
              return (
                <div title={!isFullyApproved ? "All sections must be approved before final submission." : ""}>
                  <Button 
                    variant="primary" 
                    disabled={!isFullyApproved}
                    onClick={() => setShowSubmitModal(true)} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      backgroundColor: !isFullyApproved ? 'var(--app-color-surface-muted)' : undefined,
                      color: !isFullyApproved ? 'var(--app-color-text-muted)' : undefined,
                      border: !isFullyApproved ? '1px solid var(--app-color-border)' : undefined,
                      opacity: !isFullyApproved ? 0.6 : 1,
                      pointerEvents: !isFullyApproved ? 'none' : 'auto'
                    }}
                  >
                    <Icon name="check-circle" size={16} /> Submit
                  </Button>
                </div>
              );
            })()}
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
                    const isAssigned = item.assignedReviewer === 'David Brown';
                    const isLocked = userRole === 'Reviewer' && !isAssigned;

                    return (
                      <li key={idx} 
                        className={`toc-tab-item ${activeSectionIndex === idx ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
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
                        style={{
                          cursor: 'pointer'
                        }}
                        title={isLocked ? "Read-only section" : undefined}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--app-color-text-muted)' }} />
                            <span style={{ fontSize: '13px', color: isLocked ? 'var(--app-color-text-muted)' : undefined }}>{item.title}</span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                            {isApprovedMode ? (
                              <span title="Approved" style={{ display: 'flex' }}><Icon name="check-circle" size={18} style={{ color: 'var(--app-color-success)' }} /></span>
                            ) : isLocked ? null : item.status === 'Approved' ? (
                              <span title="Approved" style={{ display: 'flex' }}><Icon name="check-circle" size={18} style={{ color: 'var(--app-color-success)' }} /></span>
                            ) : (
                              <>
                                <div 
                                  onMouseEnter={() => setHoveredScoreIndex(idx)}
                                  onMouseLeave={() => setHoveredScoreIndex(null)}
                                  style={{ position: 'relative' }}
                                >
                                  <div 
                                    style={{ 
                                      fontSize: '11px', 
                                      fontWeight: 600, 
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      backgroundColor: item.score >= 90 ? 'rgba(34, 197, 94, 0.1)' : item.score >= 60 ? 'rgba(217, 119, 6, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                      color: item.score >= 90 ? 'var(--app-color-success)' : item.score >= 60 ? '#d97706' : 'var(--app-color-danger)',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      whiteSpace: 'nowrap',
                                      cursor: 'default'
                                    }}
                                  >
                                    {item.score}%
                                  </div>
                                  
                                  {hoveredScoreIndex === idx && (
                                    <div className="context-menu-animate" style={{
                                      position: 'absolute', top: 'calc(100% + 8px)', left: '4px',
                                      backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)',
                                      borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100,
                                      width: '190px', padding: '12px',
                                      color: 'var(--app-color-text)', fontSize: '12px', lineHeight: 1.4,
                                      fontWeight: 400, whiteSpace: 'normal', textAlign: 'left'
                                    }}>
                                      <div style={{ fontWeight: 600, marginBottom: '4px', color: item.score >= 90 ? 'var(--app-color-success)' : item.score >= 60 ? '#d97706' : 'var(--app-color-danger)' }}>
                                        {item.score >= 90 ? 'High Confidence' : item.score >= 60 ? 'Medium Confidence' : 'Low Confidence'}
                                      </div>
                                      {item.score >= 90 ? "Strong alignment with RFP requirements and thorough detail." : 
                                       item.score >= 60 ? "Partial alignment with RFP. Some requirements may need elaboration." : 
                                       "Weak alignment with RFP or missing critical details. Thorough review required."}
                                    </div>
                                  )}
                                </div>
                                {isReviewMode && item.assignedReviewer && (
                                  <div 
                                    onMouseEnter={() => setHoveredReviewerIndex(idx)}
                                    onMouseLeave={() => setHoveredReviewerIndex(null)}
                                    style={{ position: 'relative', display: 'flex' }}
                                  >
                                    <div style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      cursor: 'default', color: 'var(--app-color-text-muted)',
                                      padding: '4px', borderRadius: '4px',
                                      transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      <Icon name="user" size={16} />
                                    </div>
                                    
                                    {hoveredReviewerIndex === idx && (
                                      <div className="context-menu-animate" style={{
                                        position: 'absolute', top: 'calc(100% + 8px)', right: '0',
                                        backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)',
                                        borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100,
                                        width: 'max-content', padding: '8px 12px',
                                        color: 'var(--app-color-text)', fontSize: '12px', lineHeight: 1.4,
                                        fontWeight: 500, whiteSpace: 'nowrap', textAlign: 'left'
                                      }}>
                                        <div style={{ fontSize: '11px', color: 'var(--app-color-text-muted)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' }}>Assigned Reviewer</div>
                                        <div>{item.assignedReviewer}</div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                            {(!isApprovedMode && item.status !== 'Approved' && (userRole !== 'Reviewer' || isAssigned)) && (hoveredTocIndex === idx || openTocMenuIndex === idx) && (
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
                                      {userRole !== 'Reviewer' && !isReviewMode && !isApprovedMode && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setAddReviewerSectionId(item.title); setNewReviewerSections([item.title]); setOpenTocMenuIndex(null); }}
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
                                      )}
                                      
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setRegeneratePopupSection(idx); setOpenTocMenuIndex(null); }}
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
                  <>
                    <RichEditor 
                      tocItems={tocItems.map(item => item.title)} 
                      activeSectionIndex={activeSectionIndex}
                      isGenerating={false}
                      readOnly={isApprovedMode}
                      lockedSections={tocItems.map(item => userRole === 'Reviewer' && item.assignedReviewer !== 'David Brown')}
                      onShowToast={(msg) => {
                        setToastMessage(msg);
                        setTimeout(() => setToastMessage(''), 3000);
                      }}
                      onSectionChange={setActiveSectionIndex}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'rfp' && (
          <div className="page-container" style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
              
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--app-color-text)', lineHeight: 1.4 }}>
                        Cloud Migration & Infrastructure Modernization - Phase 1
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', lineHeight: 1 }}>86%</div>
                        <div style={{ fontSize: '11px', color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px', fontWeight: 600 }}>Relevance</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--app-color-success)' }}></span>
                          <span style={{ color: 'var(--app-color-text-muted)' }}>Matching Tag</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9ca3af' }}></span>
                          <span style={{ color: 'var(--app-color-text-muted)' }}>Other Tag</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Cloud', 'Azure', 'Migration'].map(t => (
                          <span key={t} className="tag-chip" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid transparent', fontWeight: 500 }}>{t}</span>
                        ))}
                        {['DevOps', 'Data', 'Networking', 'Storage'].map(t => (
                          <span key={t} className="tag-chip" style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', fontWeight: 400 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--app-color-surface)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    border: '1px solid var(--app-color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--app-color-text)', lineHeight: 1.4 }}>
                        Security & Compliance Audit for Cloud Infrastructure
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>50%</div>
                        <div style={{ fontSize: '11px', color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px', fontWeight: 600 }}>Relevance</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--app-color-success)' }}></span>
                          <span style={{ color: 'var(--app-color-text-muted)' }}>Matching Tag</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9ca3af' }}></span>
                          <span style={{ color: 'var(--app-color-text-muted)' }}>Other Tag</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Security'].map(t => (
                          <span key={t} className="tag-chip" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid transparent', fontWeight: 500 }}>{t}</span>
                        ))}
                        {['Compliance', 'Audit'].map(t => (
                          <span key={t} className="tag-chip" style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', fontWeight: 400 }}>{t}</span>
                        ))}
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


            </div>
          </div>
        )}

        {activeTab === 'configure' && (
          <div className="page-container" style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <Card title={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Configure Sections & Reviewers</div>
                  <div style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', fontWeight: 400 }}>
                    Review the selected sections and manage reviewer assignments before submitting the document for review.
                  </div>
                </div>
              }>
                <div style={{ margin: '-24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', width: '10%', whiteSpace: 'nowrap' }}>Section No.</th>
                        <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', width: '30%' }}>Section Name</th>
                        <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', width: '60%' }}>Reviewer</th>
                      </tr>
                    </thead>
                    <tbody style={{ animation: 'simpleFade 0.3s ease-in' }}>
                      {sections.filter(s => s.included).map((section, idx, arr) => {
                        const sectionStatus = getSectionStatus(section);
                        return (
                        <tr key={section.id} style={{ 
                          borderBottom: idx === arr.length - 1 ? 'none' : '1px solid var(--app-color-border)', 
                          backgroundColor: 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                        >
                          <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 500 }}>{section.no}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 500, color: 'var(--app-color-text)' }}>{section.name}</td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <MultiSelect 
                                options={Object.keys(section.reviewerStatuses || {})}
                                value={section.reviewers}
                                onChange={(val) => {
                                  if (setSections) {
                                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, reviewers: val } : s));
                                  }
                                }}
                                disabled={isReviewMode || isApprovedMode}
                                placeholder="Select Reviewers..."
                              />
                              {section.reviewers.length === 0 && (
                                <div style={{ color: 'var(--app-color-danger)', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                  <Icon name="alert-circle" size={12} /> At least one reviewer must be assigned to each section.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="page-container" style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'var(--app-color-surface)', borderRadius: '12px', border: '1px solid var(--app-color-border)', padding: '32px 48px' }}>
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
                      const iconConfig = { name: 'sparkles', color: '#0ea5e9', bg: '#ffffff' };

                      return (
                        <div key={log.id} style={{ position: 'relative', display: 'flex', gap: '16px', zIndex: 1 }}>
                          {/* Timeline Badge */}
                          <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                            backgroundColor: iconConfig.bg, color: iconConfig.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid #bfdbfe', marginLeft: '-16px', zIndex: 2
                          }}>
                            <Icon name={iconConfig.name as any} size={16} />
                          </div>
                          
                          {/* Card */}
                          <div style={{ 
                            flex: 1, backgroundColor: 'var(--app-color-surface)', borderRadius: '16px',
                            border: '1px solid var(--app-color-border)', overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                          }}>
                            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              
                              {/* Card Header & Description */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)' }}>{log.title}</h3>
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

                              {/* Removed Metadata Blocks */}

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
            width: 'min(420px, calc(100vw - 32px))',
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
            width: 'min(600px, calc(100vw - 32px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--app-color-border)' }}>
              <Icon name="user-plus" size={20} style={{ color: 'var(--app-color-primary)', marginRight: '12px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', margin: 0 }}>Add Reviewer</h2>
              <button 
                onClick={() => setReviewerPopupSection(null)}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <Icon name="x" size={20} style={{ color: 'var(--app-color-text-muted)' }} />
              </button>
            </div>
            
            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
                Search and select team members to review this section.
              </p>
              {/* Information Card */}
              <div style={{ 
                width: '100%', padding: '16px', backgroundColor: 'var(--app-color-surface-muted)', 
                borderRadius: '8px', border: '1px solid var(--app-color-border)',
                display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left'
              }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', fontWeight: 500 }}>Section Name:</span>
                  <span style={{ fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 600 }}>{tocItems[reviewerPopupSection as number]?.title}</span>
                </div>
              </div>
              
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
            <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', width: '100%' }}>
              <Button variant="ghost" onClick={() => setReviewerPopupSection(null)} style={{ border: '1px solid var(--app-color-border)', padding: '8px 24px' }}>Cancel</Button>
              <Button variant="accent" onClick={handleShareSubmit} disabled={selectedRecipients.length === 0 || isSharing} style={{ padding: '8px 24px' }}>
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

      {addReviewerSectionId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setAddReviewerSectionId(null); setSelectedReviewers([]); setReviewerSearch(''); setNewReviewerMessage(''); setNewReviewerSections([]); }}>
          <div style={{
            width: 'min(440px, calc(100vw - 32px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--app-color-border)' }}>
              <Icon name="user-plus" size={20} style={{ color: 'var(--app-color-primary)', marginRight: '12px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', margin: 0 }}>Add Reviewer</h2>
              <button 
                onClick={() => { setAddReviewerSectionId(null); setSelectedReviewers([]); setReviewerSearch(''); setNewReviewerMessage(''); setNewReviewerSections([]); }}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <Icon name="x" size={20} style={{ color: 'var(--app-color-text-muted)' }} />
              </button>
            </div>
            
            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
                Assign a reviewer to the selected sections and add an optional message.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 500, color: 'var(--app-color-text)' }}>
                  Reviewer <span style={{ color: 'var(--app-color-danger)', marginLeft: '4px' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
                    padding: '8px 12px', minHeight: '44px',
                    border: '1px solid var(--app-color-border)', borderRadius: '6px',
                    backgroundColor: 'var(--app-color-surface)'
                  }}>
                    {selectedReviewers.map((recipient, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '4px 8px', backgroundColor: 'var(--app-color-surface-muted)',
                        borderRadius: '16px', fontSize: '13px', color: 'var(--app-color-text)',
                        border: '1px solid var(--app-color-border)'
                      }}>
                        {recipient.name}
                        <button 
                          onClick={() => setSelectedReviewers(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--app-color-text-muted)', cursor: 'pointer', display: 'flex' }}
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                    ))}
                    <input 
                      type="text"
                      value={reviewerSearch}
                      onChange={(e) => {
                        setReviewerSearch(e.target.value);
                        setShowReviewerSuggestions(true);
                      }}
                      onFocus={() => setShowReviewerSuggestions(true)}
                      placeholder={selectedReviewers.length === 0 ? "Search by name or email..." : ""}
                      style={{ border: 'none', outline: 'none', flex: 1, minWidth: '150px', backgroundColor: 'transparent', fontSize: '14px', color: 'var(--app-color-text)' }}
                    />
                  </div>
                  
                  {/* Suggestions Dropdown */}
                  {showReviewerSuggestions && reviewerSearch && filteredReviewerSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                      backgroundColor: 'var(--app-color-surface)', border: '1px solid var(--app-color-border)',
                      borderRadius: '6px', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', zIndex: 10,
                      maxHeight: '200px', overflowY: 'auto'
                    }}>
                      {filteredReviewerSuggestions.map((suggestion, i) => (
                        <div 
                          key={i}
                          onClick={() => {
                            setSelectedReviewers([...selectedReviewers, suggestion]);
                            setReviewerSearch('');
                            setShowReviewerSuggestions(false);
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                            cursor: 'pointer', borderBottom: i < filteredReviewerSuggestions.length - 1 ? '1px solid var(--app-color-border)' : 'none'
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 500, color: 'var(--app-color-text)' }}>
                  Assigned Sections <span style={{ color: 'var(--app-color-danger)', marginLeft: '4px' }}>*</span>
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <MultiSelect 
                    options={sections.filter(s => s.included).map(s => s.name)}
                    value={newReviewerSections}
                    onChange={setNewReviewerSections}
                    placeholder="Select sections..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--app-color-text)' }}>Message</label>
                <textarea 
                  value={newReviewerMessage}
                  onChange={(e) => setNewReviewerMessage(e.target.value)}
                  placeholder="Add a note for the reviewer"
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--app-color-border)',
                    fontSize: '13px',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: '72px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--app-color-surface)',
                    color: 'var(--app-color-text)'
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', width: '100%' }}>
              <Button variant="ghost" onClick={() => { setAddReviewerSectionId(null); setSelectedReviewers([]); setReviewerSearch(''); setNewReviewerMessage(''); setNewReviewerSections([]); }} style={{ border: '1px solid var(--app-color-border)', padding: '8px 24px' }}>Cancel</Button>
              <Button variant="accent" onClick={handleAddReviewer} disabled={selectedReviewers.length === 0 || newReviewerSections.length === 0} style={{ padding: '8px 24px', opacity: (selectedReviewers.length === 0 || newReviewerSections.length === 0) ? 0.6 : 1 }}>Add Reviewer</Button>
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
            width: 'min(440px, calc(100vw - 32px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--app-color-border)' }}>
              <Icon name="check" size={20} style={{ color: 'var(--app-color-primary)', marginRight: '12px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', margin: 0 }}>Approve Section</h2>
              <button 
                onClick={() => setApprovePopupSection(null)}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <Icon name="x" size={20} style={{ color: 'var(--app-color-text-muted)' }} />
              </button>
            </div>
            
            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
                Are you sure you want to approve this section? Once approved, it will be marked as Approved.
              </p>
              {/* Information Card */}
              <div style={{ 
                width: '100%', padding: '16px', backgroundColor: 'var(--app-color-surface-muted)', 
                borderRadius: '8px', border: '1px solid var(--app-color-border)',
                display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left'
              }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', fontWeight: 500 }}>Section Name:</span>
                  <span style={{ fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 600 }}>{tocItems[approvePopupSection as number]?.title}</span>
                </div>
              </div>

              {/* Approval Comments */}
              <div style={{ width: '100%', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--app-color-text)', marginBottom: '8px' }}>
                  Approval Comments
                </label>
                <textarea 
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Add approval comments or notes (optional)..."
                  style={{
                    width: '100%', height: '72px', padding: '12px',
                    border: '1px solid var(--app-color-border)', borderRadius: '6px',
                    backgroundColor: 'var(--app-color-surface)', fontSize: '13px',
                    color: 'var(--app-color-text)', resize: 'none', outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', width: '100%' }}>
              <Button variant="ghost" onClick={() => {
                setApprovePopupSection(null);
                setApprovalComment('');
              }} style={{ border: '1px solid var(--app-color-border)', padding: '8px 24px' }}>
                Cancel
              </Button>
              <Button variant="accent" disabled={!approvalComment.trim()} onClick={() => {
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
                  user: userRole === 'Reviewer' ? 'David Brown' : 'Dipali Balkrishna Patil',
                  timestamp: new Date(),
                  metadata: approvalComment.trim() ? { approvalComment: approvalComment.trim() } : undefined
                };
                setActivityLog(prev => [newActivity, ...prev]);
                
                setApprovePopupSection(null);
                setApprovalComment('');
                setToastMessage('Section approved successfully.');
                setTimeout(() => setToastMessage(''), 3000);
              }} style={{ padding: '8px 24px', opacity: !approvalComment.trim() ? 0.6 : 1 }}>
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Section Modal */}
      {regeneratePopupSection !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setRegeneratePopupSection(null)}>
          <div style={{
            width: 'min(440px, calc(100vw - 32px))',
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--app-color-border)' }}>
              <Icon name="refresh-cw" size={20} style={{ color: 'var(--app-color-primary)', marginRight: '12px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', margin: 0 }}>Regenerate Section</h2>
              <button 
                onClick={() => setRegeneratePopupSection(null)}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <Icon name="x" size={20} style={{ color: 'var(--app-color-text-muted)' }} />
              </button>
            </div>
            
            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
                Provide specific instructions or context for the AI to regenerate this section.
              </p>
              {/* Information Card */}
              <div style={{ 
                width: '100%', padding: '16px', backgroundColor: 'var(--app-color-surface-muted)', 
                borderRadius: '8px', border: '1px solid var(--app-color-border)',
                display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left'
              }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', fontWeight: 500 }}>Section Name:</span>
                  <span style={{ fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 600 }}>{tocItems[regeneratePopupSection as number]?.title}</span>
                </div>
              </div>

              {/* Regeneration Instructions */}
              <div style={{ width: '100%', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--app-color-text)', marginBottom: '8px' }}>
                  Additional Instructions
                </label>
                <textarea 
                  value={regenerationInstructions}
                  onChange={(e) => setRegenerationInstructions(e.target.value)}
                  placeholder="e.g., Make the content more concise, improve business language..."
                  style={{
                    width: '100%', height: '72px', padding: '12px',
                    border: '1px solid var(--app-color-border)', borderRadius: '6px',
                    backgroundColor: 'var(--app-color-surface)', fontSize: '13px',
                    color: 'var(--app-color-text)', resize: 'none', outline: 'none',
                    fontFamily: 'inherit', lineHeight: 1.5, overflowY: 'auto'
                  }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', width: '100%' }}>
              <Button variant="ghost" onClick={() => {
                setRegeneratePopupSection(null);
                setRegenerationInstructions('');
              }} style={{ border: '1px solid var(--app-color-border)', padding: '8px 24px' }}>
                Cancel
              </Button>
              <Button 
                variant="accent" 
                disabled={!regenerationInstructions.trim()}
                onClick={() => {
                if (regeneratePopupSection === null) return;
                const sectionName = tocItems[regeneratePopupSection]?.title;
                const instructions = regenerationInstructions.trim();
                
                // Close popup
                setRegeneratePopupSection(null);
                setRegenerationInstructions('');
                
                // Simulate AI generation by reusing the processing popup logic
                // But start from a higher progress and end quicker
                setProcessingProgress(0);
                setCurrentProcessingStep(0);
                setIsProcessing(true);
                
                // Add to Activity Log
                const newActivity: ActivityItem = {
                  id: `act-${Date.now()}`,
                  category: 'edit',
                  title: 'Section Regenerated',
                  description: `Requested regeneration for the ${sectionName} section`,
                  sectionName: sectionName,
                  user: userRole === 'Reviewer' ? 'David Brown' : 'Dipali Balkrishna Patil',
                  timestamp: new Date(),
                  metadata: instructions ? { aiInstruction: instructions } : undefined
                };
                setActivityLog(prev => [newActivity, ...prev]);
                
                setToastMessage('Section regenerated successfully.');
                setTimeout(() => setToastMessage(''), 3000);
              }} style={{ padding: '8px 24px', opacity: !regenerationInstructions.trim() ? 0.6 : 1 }}>
                <Icon name="sparkles" size={16} /> Regenerate
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
        type={exportToastMessage.includes('Failed') ? 'error' : 'success'}
        autoCloseDuration={3000}
        hideCloseButton={true}
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
            <div key="gen" className="fade-in-content" style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon name="loader" size={20} className="icon-spin" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '6px' }}>
                Generating Scope of Work
              </h2>
              <p style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', lineHeight: '1.4', margin: 0 }}>
                Please wait while our AI synthesizes your selected sections into a comprehensive SOW draft.
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
      {/* Hover Popovers */}
      {(isDraftMode || isReviewMode || isApprovedMode) && document.getElementById('topbar-right-portal-target') && createPortal(
        <>
          <span style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', fontWeight: 'normal' }}>Last updated &bull; 10 min ago</span>
          <div 
            ref={badgeRef}
            onMouseEnter={handleBadgeMouseEnter}
            onMouseLeave={() => setShowBadgeHover(false)}
            style={{ cursor: 'default', display: 'flex', alignItems: 'center' }}
          >
            {isDraftMode ? (
              <Badge tone="neutral">Draft</Badge>
            ) : isApprovedMode ? (
              <Badge tone="success">Approved</Badge>
            ) : (
              <Badge tone="warning">In Review</Badge>
            )}
          </div>
        </>,
        document.getElementById('topbar-right-portal-target')!
      )}
      {showIdHover && createPortal(
        <div style={{
          position: 'fixed',
          top: `${idTooltipPos.top}px`,
          left: `${idTooltipPos.left}px`,
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--app-color-surface)',
          border: '1px solid var(--app-color-border)',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: 'var(--app-shadow-float)',
          zIndex: 1000,
          pointerEvents: 'none',
          minWidth: '220px',
          fontSize: '13px'
        }}>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>Cloud Migration Initiative</div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', color: 'var(--app-color-text)' }}>
            <span style={{ color: 'var(--app-color-text-muted)' }}>Client:</span>
            <span>Acme Corp</span>
            <span style={{ color: 'var(--app-color-text-muted)' }}>Created By:</span>
            <span>Ashika Sharma</span>
            <span style={{ color: 'var(--app-color-text-muted)' }}>Created On:</span>
            <span>Jul 08, 2026</span>
            <span style={{ color: 'var(--app-color-text-muted)' }}>Version:</span>
            <span>1.2</span>
            <span style={{ color: 'var(--app-color-text-muted)' }}>Last Updated:</span>
            <span>5 min ago</span>
          </div>
        </div>,
        document.body
      )}

      {showBadgeHover && createPortal(
        <div style={{
          position: 'fixed',
          top: `${badgeTooltipPos.top}px`,
          left: `${badgeTooltipPos.left}px`,
          transform: 'translateX(-100%)',
          backgroundColor: 'var(--app-color-surface)',
          border: '1px solid var(--app-color-border)',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 9999,
          width: 'max-content',
          minWidth: '220px',
          maxWidth: '260px',
          color: 'var(--app-color-text)',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {isDraftMode ? (
            <>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '8px' }}>
                Draft
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ color: 'var(--app-color-text-muted)' }}>Not yet sent for review</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: 'var(--app-color-text-muted)' }}>Last updated :</span>
                  <span style={{ fontWeight: 600 }}>10 min ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: 'var(--app-color-text-muted)' }}>Version :</span>
                  <span style={{ fontWeight: 600 }}>0.1</span>
                </div>
              </div>
            </>
          ) : isApprovedMode ? (
            <>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '8px' }}>
                Approved
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: 'var(--app-color-text-muted)' }}>Status :</span>
                  <span style={{ fontWeight: 600 }}>All sections accepted</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: 'var(--app-color-text-muted)' }}>Approved on :</span>
                  <span style={{ fontWeight: 600 }}>Jul 10, 2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: 'var(--app-color-text-muted)' }}>Approved by :</span>
                  <span style={{ fontWeight: 600 }}>Narendra Patel</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: 'var(--app-color-text-muted)' }}>Version :</span>
                  <span style={{ fontWeight: 600 }}>1.0</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '8px' }}>
                In Review
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: 'var(--app-color-text-muted)' }}>👥 With Reviewers :</span>
                  <span style={{ fontWeight: 600 }}>3</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: 'var(--app-color-text-muted)' }}>📥 Awaiting PMO :</span>
                  <span style={{ fontWeight: 600 }}>2</span>
                </div>
              </div>
            </>
          )}
        </div>,
        document.body
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1050
        }}>
          <div className="context-menu-animate" style={{
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: '12px',
            width: '400px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: 'var(--app-color-primary-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--app-color-primary)'
                }}>
                  <Icon name="check-circle" size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-text)', margin: 0 }}>
                  Confirm Final Submission
                </h3>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--app-color-text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                Are you sure you want to submit this SOW? This will finalize all approved sections and change the status to "Approved".
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button variant="ghost" onClick={() => setShowSubmitModal(false)} style={{ padding: '8px 24px' }}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => {
                  setShowSubmitModal(false);
                  
                  const newActivity: ActivityItem = {
                    id: `act-${Date.now()}`,
                    category: 'approval',
                    title: 'SOW Final Submission',
                    description: 'SOW has been successfully submitted and approved.',
                    user: userRole === 'Reviewer' ? 'David Brown' : 'Dipali Balkrishna Patil',
                    timestamp: new Date()
                  };
                  setActivityLog(prev => [newActivity, ...prev]);

                  if (onSubmitFinal) {
                    onSubmitFinal();
                  } else {
                    setToastMessage('SOW Submitted Successfully!');
                    setTimeout(() => setToastMessage(''), 3000);
                  }
                }} style={{ padding: '8px 24px' }}>
                  Submit SOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
}
