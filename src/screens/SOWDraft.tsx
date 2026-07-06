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

const aiStages = [
  'Reading RFP document...',
  'Extracting requirements...',
  'Creating SOW structure...',
  'Generating draft content...',
  'Preparing editable document...'
];

export function SOWDraft() {
  const [activeTab, setActiveTab] = useState<'rfp' | 'sow'>('sow');
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  
  useEffect(() => {
    if (!isGenerating) return;
    
    // Total generation time ~ 12 seconds
    const intervalTime = 120; // updates every 120ms
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setProgress(currentStep);
      
      const newStageIndex = Math.min(Math.floor((currentStep / 100) * aiStages.length), aiStages.length - 1);
      setStageIndex(newStageIndex);
      
      if (currentStep >= 100) {
        clearInterval(timer);
        setTimeout(() => setIsGenerating(false), 500);
      }
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [isGenerating]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="screen-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="screen-title" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: 'var(--app-color-primary)' }}>
            SOW Draft
          </h1>
          <p className="screen-description" style={{ margin: 0, fontSize: '15px', color: 'var(--app-color-text-muted)' }}>
            Review, edit, and finalize the generated Statement of Work.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost" disabled={isGenerating}>
            <Icon name="upload-cloud" size={16} /> Share
          </Button>
          <Button variant="secondary">
            <Icon name="file" size={16} /> Save Draft
          </Button>
          <Button variant="accent">
            <Icon name="arrow-right" size={16} /> Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
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

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '16px', border: '1px solid var(--app-color-border)', marginTop: '40px' }}>
        {activeTab === 'sow' && (
          <>
            {/* TOC Sidebar */}
            <div style={{ width: '280px', borderRight: '1px solid var(--app-color-border)', padding: '24px', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--app-color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Table of Contents</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tocItems.map((item, idx) => {
                  // Determine status based on stage index
                  const stageThreshold = (idx / tocItems.length) * aiStages.length;
                  const isCompleted = !isGenerating || stageIndex > stageThreshold;
                  const isCurrent = isGenerating && Math.floor(stageThreshold) === stageIndex;
                  
                  return (
                    <li key={idx} 
                      className={`toc-tab-item ${!isGenerating && activeSectionIndex === idx ? 'active' : ''}`}
                      style={{
                        color: isGenerating ? (isCompleted ? 'var(--app-color-text)' : isCurrent ? 'var(--app-color-accent)' : 'var(--app-color-text-muted)') : undefined,
                        cursor: isGenerating ? 'default' : 'pointer',
                        opacity: (isGenerating && !isCompleted && !isCurrent) ? 0.5 : 1
                      }}
                      onClick={() => {
                        if (!isGenerating) {
                          setActiveSectionIndex(idx);
                        }
                      }}
                    >
                      {isGenerating ? (
                        isCompleted ? <Icon name="check-circle" size={14} style={{ color: 'var(--app-color-success)' }} /> :
                        isCurrent ? <Icon name="loader" size={14} className="icon-spin" /> :
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid var(--app-color-border)' }} />
                      ) : (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--app-color-accent)' }} />
                      )}
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <RichEditor 
                tocItems={tocItems} 
                activeSectionIndex={activeSectionIndex}
                isGenerating={isGenerating}
              >
                {isGenerating && (
                  <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                      <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Icon name="loader" size={24} className="icon-spin" />
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--app-color-primary)', marginBottom: '8px' }}>Generating SOW Draft</h2>
                      <p style={{ color: 'var(--app-color-text-muted)', fontSize: '14px' }}>AI is analysing the uploaded RFP and preparing your editable draft.</p>
                    </div>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: 'var(--app-color-text-muted)' }}>
                        <span>{aiStages[stageIndex]}</span>
                        <span style={{ fontWeight: 600, color: 'var(--app-color-primary)' }}>{progress}%</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: 'var(--app-color-accent)', width: `${progress}%`, transition: 'width 0.2s linear' }} />
                      </div>
                    </div>

                    <div className="skeleton-container">
                      <div className="skeleton-title" style={{ width: '60%', marginBottom: '24px', height: '24px' }} />
                      <div className="skeleton-text" style={{ width: '100%', height: '12px', marginBottom: '12px' }} />
                      <div className="skeleton-text" style={{ width: '100%', height: '12px', marginBottom: '12px' }} />
                      <div className="skeleton-text" style={{ width: '80%', height: '12px', marginBottom: '32px' }} />
                      
                      <div className="skeleton-title" style={{ width: '40%', marginBottom: '16px', height: '20px' }} />
                      <div className="skeleton-text" style={{ width: '100%', height: '12px', marginBottom: '12px' }} />
                      <div className="skeleton-text" style={{ width: '90%', height: '12px', marginBottom: '12px' }} />
                      <div className="skeleton-text" style={{ width: '95%', height: '12px', marginBottom: '12px' }} />
                    </div>
                  </div>
                )}
              </RichEditor>
            </div>
          </>
        )}
        
        {activeTab === 'rfp' && (
          <div style={{ padding: '32px', width: '100%', height: '100%', display: 'flex', gap: '32px', overflowY: 'auto' }}>
             <div style={{ width: '320px', flexShrink: 0 }}>
               <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--app-color-primary)' }}>Primary RFP</h3>
               <div className="file-item" style={{ width: '100%', flex: 'none' }}>
                  <div className="file-item__icon-wrapper">
                    <Icon name="file-text" size={20} />
                  </div>
                  <div className="file-item__main">
                    <div className="file-item__name">Project_Requirements_v2.pdf</div>
                    <div className="file-item__meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>4.2 MB</span>
                      <span>•</span>
                      <span style={{ color: 'var(--app-color-success)' }}>Uploaded</span>
                    </div>
                  </div>
               </div>
             </div>
             
             <div style={{ flex: 1, backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '8px', border: '1px dashed var(--app-color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Icon name="file" size={48} style={{ color: 'var(--app-color-border)', marginBottom: '16px' }} />
                <div style={{ color: 'var(--app-color-text-muted)', fontSize: '14px', fontWeight: 500 }}>Preview not available in draft mode</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
