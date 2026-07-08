import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { AlertModal } from '../components/ui/AlertModal';

const mockPreviousSOWs = [
  {
    id: 'sow-1',
    name: 'Cloud Migration & Infrastructure Modernization - Phase 1',
    matchScore: 92,
    tags: ['Cloud', 'Azure', 'Migration', 'DevOps', 'Data', 'Networking', 'Storage'],
    relatedTags: ['Infrastructure', 'Security', 'Compliance', 'Audit', 'Governance', 'Operations'],
    matchTags: ['Cloud', 'Migration']
  },
  {
    id: 'sow-2',
    name: 'Enterprise Healthcare Platform Azure Migration',
    matchScore: 85,
    tags: ['Healthcare', 'Azure', 'Security'],
    relatedTags: ['Compliance', 'Cloud'],
    matchTags: ['Healthcare', 'Azure']
  },
  {
    id: 'sow-3',
    name: 'Data Center Lift and Shift to Azure',
    matchScore: 78,
    tags: ['Migration', 'IT Infrastructure', 'Azure'],
    relatedTags: ['Data Center', 'Lift and Shift'],
    matchTags: ['Migration', 'Azure']
  },
  {
    id: 'sow-4',
    name: 'Security & Compliance Audit for Cloud Infrastructure',
    matchScore: 45,
    tags: ['Security', 'Compliance', 'Audit'],
    relatedTags: ['Azure', 'Infrastructure'],
    matchTags: ['Security']
  }
];

interface UploadRFPProps {
  onTransitionToDraft?: () => void;
}

export function UploadRFP({ onTransitionToDraft }: UploadRFPProps) {
  const [rfpFiles, setRfpFiles] = useState<File[]>([]);
  const [supportFiles, setSupportFiles] = useState<File[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [rfpError, setRfpError] = useState('');
  const [supportError, setSupportError] = useState('');
  const [fileToDelete, setFileToDelete] = useState<{type: 'rfp' | 'support', index: number} | null>(null);
  const [deleteToast, setDeleteToast] = useState(false);
  const [showSOWSection, setShowSOWSection] = useState(false);
  const [isFindingSOWs, setIsFindingSOWs] = useState(false);
  const [selectedSOWs, setSelectedSOWs] = useState<string[]>([]);
  const [tagError, setTagError] = useState('');
  const [refreshMessage, setRefreshMessage] = useState('');
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (previewFile || isExtracting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewFile) {
        setPreviewFile(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewFile, isExtracting]);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (showSOWSection && tags.length > 0) {
      setIsFindingSOWs(true);
      setRefreshMessage('Previous SOWs have been updated to match your new tags.');
      const timer1 = setTimeout(() => setIsFindingSOWs(false), 1500);
      const timer2 = setTimeout(() => setRefreshMessage(''), 4000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (tags.length === 0) {
      setShowSOWSection(false);
    }
  }, [tags]);

  const handleExtractTags = () => {
    setIsExtracting(true);
    setTimeout(() => {
      const dummyTags = ['Healthcare', 'Security', 'Cloud', 'Azure', 'Migration', 'IT Infrastructure'];
      setTags(prev => {
        const newTags = dummyTags.filter(t => !prev.includes(t));
        return [...prev, ...newTags];
      });
      setIsExtracting(false);
    }, 1500);
  };

  const handleRfpFileSelect = (files: File[]) => {
    setRfpError('');
    if (files.length > 0) {
      setRfpFiles([files[0]]);
    }
  };
  const handleRfpFileRemove = (index: number) => {
    setFileToDelete({ type: 'rfp', index });
  };

  const handleSupportFileSelect = (files: File[]) => {
    setSupportError('');
    let hasDuplicate = false;
    const newFiles: File[] = [];
    
    files.forEach(f => {
      // Check for duplicate by name and size
      const isDuplicate = supportFiles.some(existing => existing.name === f.name && existing.size === f.size) ||
                          newFiles.some(existing => existing.name === f.name && existing.size === f.size);
      if (isDuplicate) {
        hasDuplicate = true;
      } else {
        newFiles.push(f);
      }
    });

    if (hasDuplicate) {
      setSupportError('One or more files were not added because they have already been uploaded.');
    }
    
    if (newFiles.length > 0) {
      setSupportFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSupportFileRemove = (index: number) => {
    setFileToDelete({ type: 'support', index });
  };

  const confirmDeleteFile = () => {
    if (!fileToDelete) return;
    if (fileToDelete.type === 'rfp') {
      setRfpError('');
      setRfpFiles(prev => prev.filter((_, i) => i !== fileToDelete.index));
    } else {
      setSupportError('');
      setSupportFiles(prev => prev.filter((_, i) => i !== fileToDelete.index));
    }
    setFileToDelete(null);
    setDeleteToast(true);
    setTimeout(() => setDeleteToast(false), 3000);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagsInput.trim()) {
      e.preventDefault();
      const newTag = tagsInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagsInput('');
    }
  };


  const handleFindSOWs = () => {
    setShowSOWSection(true);
    setIsFindingSOWs(true);
    setTimeout(() => {
      setIsFindingSOWs(false);
    }, 2000);
  };

  const toggleSOWSelection = (id: string) => {
    setSelectedSOWs(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleRemoveTag = (indexToRemove: number) => {
    if (tags.length === 1) {
      setTagError('At least one applicable tag is required.');
      setTimeout(() => setTagError(''), 3000);
      return;
    }
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleClear = () => {
    setRfpFiles([]);
    setSupportFiles([]);
    setTags([]);
    setTagsInput('');
    setHasTriedSubmit(false);
    setIsSubmitting(false);

    setRfpError('');
    setSupportError('');
  };

  const handleSubmit = () => {
    setHasTriedSubmit(true);
    if (rfpFiles.length === 0) return;
    
    setIsSubmitting(true);
    onTransitionToDraft?.();
  };

  return (
    <>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '100%', paddingBottom: '32px' }}>
        <Card title={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>RFP Document <span style={{ color: 'var(--app-color-danger)' }}>*</span></div>
            </div>
            <div style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', fontWeight: 400 }}>
              Upload the main RFP document that will be used to generate the Scope of Work.
            </div>
          </div>
        }>
          <FileUpload 
            multiple={false} 
            hint="Drag and drop"
            description="or click to browse"
            supportedFormats={['PDF', 'DOC', 'PPT']}
            maxSize="10MB"
            files={rfpFiles}
            onFileSelect={handleRfpFileSelect}
            onFileRemove={handleRfpFileRemove}
            onFilePreview={(i) => setPreviewFile(rfpFiles[i])}
            disabled={rfpFiles.length >= 1}
            disabledMessage="Only one RFP document can be uploaded. Delete the current file to upload another."
          />
          {rfpError && (
            <div className="error-text">
              <Icon name="alert-circle" size={16} />
              {rfpError}
            </div>
          )}
          {hasTriedSubmit && rfpFiles.length === 0 && (
            <div className="error-text">
              <Icon name="alert-circle" size={16} />
              Please upload the primary RFP document to proceed.
            </div>
          )}
        </Card>

        <Card title={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              Supporting Documents
            </div>
            <div style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', fontWeight: 400 }}>
              Add annexures, guidelines, reference files, or supporting material related to the RFP.
            </div>
          </div>
        }>
          <FileUpload 
            multiple={true} 
            hint="Drag and drop"
            description="or click to browse"
            maxFiles={5}
            maxSize="10MB"
            supportedFormats={['PDF', 'DOC', 'PPT']}
            files={supportFiles}
            onFileSelect={handleSupportFileSelect}
            onFileRemove={handleSupportFileRemove}
            onFilePreview={(i) => setPreviewFile(supportFiles[i])}
            disabled={supportFiles.length >= 5}
            disabledMessage="Maximum of 5 supporting documents uploaded. Remove an existing document to upload another."
          />
          {supportError && (
            <div className="error-text">
              <Icon name="alert-circle" size={16} />
              {supportError}
            </div>
          )}
          </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              Applicable Tags <span style={{ color: 'var(--app-color-danger)', fontSize: '18px', lineHeight: 1, marginLeft: '-8px' }}>*</span>
            </div>
            <div style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', fontWeight: 400 }}>
              Add tags manually or extract them from the uploaded RFP to guide SOW generation.
            </div>
          </div>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  flex: 1,
                  display: 'flex', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '12px 16px', 
                  border: '1px solid var(--app-color-border)', 
                  borderRadius: 'var(--app-radius-sm)',
                  backgroundColor: 'var(--app-color-surface)'
                }}>
                  {tags.map((tag, i) => (
                    <span key={i} className="tag-chip" style={{ gap: '6px' }}>
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(i)} 
                        style={{ border: 'none', background: 'transparent', color: 'inherit', padding: 0, opacity: 0.6, cursor: 'pointer', display: 'flex' }}
                        aria-label="Remove tag"
                      >
                        <Icon name="x" size={12} />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Enter to add tag..."
                    style={{ 
                      border: 'none', 
                      outline: 'none', 
                      flex: 1, 
                      minWidth: '150px',
                      backgroundColor: 'transparent',
                      color: 'var(--app-color-text)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                {isExtracting ? (
                  <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--app-color-primary)', fontSize: '13px', fontWeight: 500 }}>
                    <Icon name="loader" size={16} className="icon-spin" /> Extracting tags from RFP...
                  </div>
                ) : (
                  <Button 
                    variant="secondary"
                    onClick={handleExtractTags}
                    disabled={rfpFiles.length === 0}
                    style={{ whiteSpace: 'nowrap', alignSelf: 'flex-start' }}
                  >
                    <Icon name="sparkles" size={16} /> Extract from RFP
                  </Button>
                )}
              </div>
              
              {tagError && <div style={{ color: 'var(--app-color-danger)', fontSize: '13px', marginTop: '-8px', marginBottom: '8px', fontWeight: 500 }}>{tagError}</div>}
              
            </div>
          </div>
        </Card>

        {!showSOWSection && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button 
              variant="secondary" 
              onClick={handleFindSOWs} 
              disabled={tags.length === 0}
              style={{ backgroundColor: 'white' }}
            >
              <Icon name="file-text" size={16} /> View Previous SOWs
            </Button>
          </div>
        )}
        </div>

        {/* Previous SOW match section */}
        {showSOWSection && (
          <Card title={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                Previous SOW Matches
              </div>
              <div style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', fontWeight: 400 }}>
                We found similar SOWs based on your applicable tags
              </div>
              {refreshMessage && (
                <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <Icon name="check-circle" size={14} /> {refreshMessage}
                </div>
              )}
            </div>
          }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isFindingSOWs ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      backgroundColor: 'var(--app-color-surface)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid var(--app-color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      animation: 'pulse 1.5s infinite ease-in-out'
                    }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: 'var(--app-color-surface-muted)' }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ height: '20px', width: '60%', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '4px' }} />
                          <div style={{ height: '16px', width: '40%', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '4px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid var(--app-color-border)', paddingTop: '16px' }}>
                        <div style={{ height: '24px', width: '20%', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '4px' }} />
                        <div style={{ height: '24px', width: '30%', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mockPreviousSOWs
                    .map(sow => {
                      const dynamicMatchTags = sow.tags.filter(t => tags.includes(t));
                      let dynamicMatchScore = sow.matchScore;
                      if (dynamicMatchTags.length > 0) {
                        const matchRatio = dynamicMatchTags.length / sow.tags.length;
                        const baseScore = sow.matchScore > 70 ? 80 : sow.matchScore;
                        dynamicMatchScore = Math.min(95, Math.round(baseScore + (matchRatio * 15)));
                      }
                      return { ...sow, dynamicMatchTags, dynamicMatchScore };
                    })
                    .sort((a, b) => b.dynamicMatchScore - a.dynamicMatchScore)
                    .map(sow => {
                    const isSelected = selectedSOWs.includes(sow.id);
                    const isHighMatch = sow.dynamicMatchScore >= 60;
                      return (
                        <div key={sow.id} 
                          onClick={() => toggleSOWSelection(sow.id)}
                          style={{
                          backgroundColor: isSelected ? '#f4fbfa' : 'var(--app-color-surface)',
                          borderRadius: '12px',
                          padding: '20px 24px',
                          border: `1px solid ${isSelected ? 'var(--app-color-accent)' : 'var(--app-color-border)'}`,
                          boxShadow: isSelected ? '0 4px 12px rgba(54, 192, 201, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                              <div 
                                style={{ 
                                width: '22px', height: '22px', 
                                borderRadius: '6px', 
                                border: `2px solid ${isSelected ? 'var(--app-color-accent)' : 'var(--app-color-border)'}`,
                                backgroundColor: isSelected ? 'var(--app-color-accent)' : 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}>
                                {isSelected && <Icon name="check" size={14} style={{ color: 'white' }} />}
                              </div>
                              <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--app-color-text)', lineHeight: 1.4 }}>
                                  {sow.name}
                                </h3>
                              </div>
                            </div>
                            
                            <div style={{ 
                              display: 'flex', alignItems: 'center', gap: '6px', 
                              padding: '4px 12px', backgroundColor: isHighMatch ? 'var(--app-color-success-soft)' : 'var(--app-color-warning-soft)', 
                              color: isHighMatch ? 'var(--app-color-success)' : 'var(--app-color-warning)', borderRadius: '20px', fontWeight: 600, fontSize: '13px',
                            }}>
                              Match Score: {sow.dynamicMatchScore}%
                            </div>
                          </div>
  
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginLeft: '38px' }}>
                            <div>
                              <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '6px', fontWeight: 500 }}>Tags</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {sow.tags.slice(0, 4).map(t => (
                                  <span key={t} className="tag-chip" style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>{t}</span>
                                ))}
                                {sow.tags.length > 4 && (
                                  <span title={sow.tags.slice(4).join(', ')} className="tag-chip" style={{ cursor: 'default', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>
                                    + {sow.tags.length - 4}
                                  </span>
                                )}
                              </div>
                            </div>

                            {sow.dynamicMatchTags.length > 0 && (
                              <div>
                                <div style={{ fontSize: '12px', color: 'var(--app-color-success)', marginBottom: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Icon name="check-circle" size={12} /> Matching Tags
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {sow.dynamicMatchTags.slice(0, 4).map(t => (
                                    <span key={t} className="tag-chip">{t}</span>
                                  ))}
                                  {sow.dynamicMatchTags.length > 4 && (
                                    <span title={sow.dynamicMatchTags.slice(4).join(', ')} className="tag-chip" style={{ cursor: 'default' }}>
                                      + {sow.dynamicMatchTags.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                  })}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      <div className="sticky-bottom-bar">
        <div style={{ 
          fontSize: '13px', 
          color: (rfpFiles.length > 0 && tags.length > 0 && selectedSOWs.length > 0) ? 'var(--app-color-success)' : 'var(--app-color-text-muted)', 
          marginRight: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 500
        }}>
          <Icon name={(rfpFiles.length > 0 && tags.length > 0 && selectedSOWs.length > 0) ? "check-circle" : "alert-circle"} size={14} />
          {rfpFiles.length === 0 
            ? 'Please upload an RFP document to proceed.' 
            : tags.length === 0 
              ? 'Please add or extract tags to find reference SOWs.' 
              : selectedSOWs.length === 0 
                ? 'Select a reference SOW to enable Generate SOW button.'
                : 'Ready to generate SOW draft.'}
        </div>
        <Button variant="secondary" onClick={handleClear} disabled={isSubmitting}>
          <Icon name="x" size={16} /> Clear
        </Button>
        <Button variant="accent" onClick={handleSubmit} disabled={rfpFiles.length === 0 || tags.length === 0 || selectedSOWs.length === 0 || isSubmitting}>
          {isSubmitting ? (
            <><Icon name="loader" size={16} className="icon-spin" /> Generating...</>
          ) : (
            <><Icon name="sparkles" size={16} /> Generate SOW <Icon name="arrow-right" size={16} /></>
          )}
        </Button>
      </div>


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
            maxWidth: '950px',
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
              flexDirection: 'column',
              alignItems: 'center',
              padding: '32px 24px',
              overflow: 'auto',
              gap: '32px'
            }}>
              {[
                {
                  id: 1,
                  content: (
                    <>
                      <section>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1e293b' }}>1. Project Overview & Executive Summary</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>This Request for Proposal (RFP) outlines the requirement for a comprehensive cloud migration and infrastructure modernization project. The selected vendor will be responsible for end-to-end delivery including assessment, planning, and execution.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Our organization currently operates a hybrid infrastructure model, heavily reliant on legacy on-premise data centers that have reached the end of their hardware lifecycle. The primary objective of this migration initiative is to transition our core applications to a scalable, secure, and highly available cloud-native architecture. By doing so, we aim to reduce our total cost of ownership (TCO) by an estimated 35% over the next five years, while significantly increasing our speed to market for new digital products.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The successful partner will demonstrate deep expertise in enterprise cloud migrations, specifically within the AWS or Azure ecosystems, and will bring a proven methodology that minimizes downtime and risk. We expect the partner to not only execute a "lift and shift" where necessary, but to proactively identify opportunities for refactoring applications to fully leverage cloud-native services such as serverless computing, managed databases, and advanced analytics capabilities.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Furthermore, this project serves as a catalyst for a broader organizational transformation. We are seeking a partner who can provide strategic guidance on adopting DevOps culture, implementing automated CI/CD pipelines, and establishing robust cloud governance and FinOps practices to ensure long-term sustainability and cost control.</p>
                      </section>
                      <section>
                        <h3 style={{ margin: '32px 0 12px 0', fontSize: '18px', color: '#1e293b' }}>2. Business Objectives & Drivers</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The organization seeks to reduce operational costs by 30% while improving system availability to 99.99%. The new architecture must support dynamic scaling during peak business hours without manual intervention.</p>
                        <ul style={{ margin: '0 0 16px 0', paddingLeft: '24px', fontSize: '14px' }}>
                          <li style={{ marginBottom: '8px' }}><strong>Agility & Speed:</strong> Accelerate the software delivery lifecycle from monthly releases to daily deployments.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Global Scale:</strong> Support our planned expansion into European and APAC markets with low-latency infrastructure.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Security & Compliance:</strong> Achieve continuous compliance with SOC2 Type II, HIPAA, and GDPR through automated policy enforcement.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Resilience:</strong> Eliminate single points of failure across all mission-critical applications and establish multi-region disaster recovery capabilities.</li>
                        </ul>
                      </section>
                    </>
                  )
                },
                {
                  id: 2,
                  content: (
                    <>
                      <section>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1e293b' }}>3. Scope of Work & Current Environment</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The scope includes migrating 45 legacy on-premise applications to a modern cloud-native environment. This covers database migration, refactoring of core monolithic services into microservices, and setting up CI/CD pipelines.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Currently, our application portfolio consists of a mix of monolithic Java (Spring Boot v1.5) and .NET (Framework 4.7) applications running on bare-metal servers. The database tier is primarily Oracle 12c and Microsoft SQL Server 2016, with several standalone MySQL instances. Storage is handled via an aging SAN infrastructure that is reaching capacity.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The migration scope is broadly divided into three phases:</p>
                        <ul style={{ margin: '0 0 16px 0', paddingLeft: '24px', fontSize: '14px' }}>
                          <li style={{ marginBottom: '8px' }}><strong>Phase 1: Assessment & Discovery:</strong> Comprehensive audit of all workloads, dependencies, network topologies, and security configurations. Creation of the target architecture and a detailed migration roadmap.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Phase 2: Foundation & Pilot:</strong> Establishment of the Cloud Center of Excellence (CCoE), Landing Zone setup, networking (VPC/VNet), IAM configuration, and the migration of 3 low-risk pilot applications.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Phase 3: Mass Migration & Modernization:</strong> Execution of the migration waves based on the 6R strategy (Rehost, Replatform, Repurchase, Refactor, Retire, Retain), focusing heavily on Replatforming databases to PaaS solutions.</li>
                        </ul>
                      </section>
                      <section>
                        <h3 style={{ margin: '32px 0 12px 0', fontSize: '18px', color: '#1e293b' }}>4. Technical & Architectural Requirements</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The proposed solution must strictly adhere to the following technical guidelines and industry best practices:</p>
                        <ul style={{ margin: '0 0 16px 0', paddingLeft: '24px', fontSize: '14px' }}>
                          <li style={{ marginBottom: '8px' }}><strong>Compute:</strong> Implementation of Kubernetes (K8s) via managed services (EKS/AKS) for container orchestration, supplemented by serverless functions for event-driven workloads.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Data:</strong> Migration of Oracle/SQL Server to PostgreSQL (Aurora/Azure SQL) where feasible. NoSQL solutions (DynamoDB/CosmosDB) should be proposed for new microservices.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Security:</strong> Integration with our existing Identity Provider (IdP) using OAuth 2.0 / OIDC. Zero-trust network architecture must be implemented by default.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Infrastructure as Code (IaC):</strong> All infrastructure must be provisioned and managed using Terraform or AWS CDK. Manual configuration in the cloud console is strictly prohibited.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Observability:</strong> Centralized logging, distributed tracing, and monitoring must be implemented using the ELK stack, Prometheus, and Grafana.</li>
                        </ul>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Vendors must include detailed architectural diagrams in their response, illustrating how network traffic will flow from end-users through WAFs, load balancers, application tiers, and down to the data tier, including cross-region replication strategies.</p>
                      </section>
                    </>
                  )
                },
                {
                  id: 3,
                  content: (
                    <>
                      <section>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1e293b' }}>5. Expected Deliverables</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The vendor must provide comprehensive documentation and tangible artifacts at each stage of the project lifecycle. These deliverables are tied to project milestones and payment schedules.</p>
                        <ul style={{ margin: '0 0 16px 0', paddingLeft: '24px', fontSize: '14px' }}>
                          <li style={{ marginBottom: '8px' }}><strong>Strategy & Design:</strong> Detailed Architecture Design Document (ADD), Migration Strategy Document, Security & Compliance Framework Document, and a FinOps Cost Optimization Plan.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Implementation:</strong> Fully configured staging and production environments built entirely via IaC. Automated CI/CD pipelines integrated with security scanning (SAST/DAST).</li>
                          <li style={{ marginBottom: '8px' }}><strong>Operations & Handoff:</strong> Comprehensive API documentation, standard operating procedures (SOPs), incident response runbooks, and disaster recovery execution plans.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Training:</strong> A minimum of 40 hours of hands-on training for our internal DevOps, Security, and Cloud Engineering teams, including knowledge transfer workshops.</li>
                        </ul>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>All documentation must be delivered in editable formats (Confluence, Markdown, Visio/Draw.io) and handed over with full intellectual property rights transferred to our organization.</p>
                      </section>
                      <section>
                        <h3 style={{ margin: '32px 0 12px 0', fontSize: '18px', color: '#1e293b' }}>6. Project Timeline & Milestones</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The project is expected to kick off in Q3 and reach production go-live within 6 months. Milestone reviews will occur bi-weekly, with UAT scheduled for Month 5.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>A high-level proposed schedule is as follows:</p>
                        <ul style={{ margin: '0 0 16px 0', paddingLeft: '24px', fontSize: '14px' }}>
                          <li style={{ marginBottom: '8px' }}><strong>Month 1:</strong> Discovery phase completion, finalizing the ADD, and setup of the foundational cloud Landing Zone.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Month 2:</strong> Deployment of CI/CD infrastructure and successful migration of the 3 pilot applications to the staging environment.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Month 3-4:</strong> Execution of Waves 1 and 2 (Bulk migration of remaining applications and databases). Initial performance tuning and security hardening.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Month 5:</strong> Comprehensive User Acceptance Testing (UAT), penetration testing, and disaster recovery simulation drills.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Month 6:</strong> Production Go-Live (phased rollout), hypercare support period, and final knowledge transfer.</li>
                        </ul>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Vendors must submit a detailed Gantt chart with their proposal, clearly highlighting critical path dependencies, resource allocations, and risk mitigation buffers.</p>
                      </section>
                    </>
                  )
                },
                {
                  id: 4,
                  content: (
                    <>
                      <section>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1e293b' }}>7. Compliance, Security, and Governance</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Security is our paramount concern. All proposed solutions must adhere strictly to SOC 2 Type II compliance standards, PCI-DSS guidelines for payment processing systems, and GDPR data protection regulations.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The vendor must implement a "Security by Design" approach. Data must be encrypted both at rest using industry-standard AES-256 encryption managed via a KMS, and in transit using TLS 1.3 or higher. All infrastructure access must be managed via temporary, least-privilege credentials utilizing role-based access control (RBAC).</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Continuous compliance monitoring must be implemented using native cloud security posture management (CSPM) tools. The vendor must provide evidence of automated remediation capabilities for common misconfigurations (e.g., publicly accessible storage buckets, unencrypted databases).</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Prior to go-live, a third-party penetration test will be conducted. The vendor is responsible for remediating all critical and high-severity vulnerabilities discovered during this test at no additional cost.</p>
                      </section>
                      <section>
                        <h3 style={{ margin: '32px 0 12px 0', fontSize: '18px', color: '#1e293b' }}>8. Budget & Commercial Models</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Vendors must provide a detailed breakdown of costs in a separate commercial proposal document. We prefer a fixed-price engagement model tied to specific delivery milestones, rather than a time-and-materials (T&M) approach.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>The pricing breakdown must clearly delineate:</p>
                        <ul style={{ margin: '0 0 16px 0', paddingLeft: '24px', fontSize: '14px' }}>
                          <li style={{ marginBottom: '8px' }}>Professional services fees (Implementation, Migration, Consulting).</li>
                          <li style={{ marginBottom: '8px' }}>Licensing costs for any third-party tools or platforms proposed as part of the solution.</li>
                          <li style={{ marginBottom: '8px' }}>Estimated monthly cloud consumption costs (AWS/Azure) based on the proposed target architecture.</li>
                          <li style={{ marginBottom: '8px' }}>Ongoing managed services or support fees for Year 1 and Year 2 post go-live (optional but recommended).</li>
                        </ul>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Proposals that include innovative commercial structures, such as risk/reward sharing or milestone payments tied to actual TCO reduction metrics, will be viewed favorably during the evaluation process.</p>
                      </section>
                    </>
                  )
                },
                {
                  id: 5,
                  content: (
                    <>
                      <section>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1e293b' }}>9. Vendor Evaluation Criteria</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Proposals will be evaluated by a cross-functional selection committee based on a weighted scoring model. The primary criteria include:</p>
                        <ul style={{ margin: '0 0 16px 0', paddingLeft: '24px', fontSize: '14px' }}>
                          <li style={{ marginBottom: '8px' }}><strong>Technical Competence (40%):</strong> Depth of experience in similar enterprise migrations, quality of the proposed architecture, alignment with modern cloud-native practices, and security approach.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Commercial Viability (30%):</strong> Total cost of the engagement, clarity of the pricing model, and the projected ROI/TCO savings of the target architecture.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Methodology & Timeline (20%):</strong> Realism of the project plan, clarity of the migration methodology (e.g., handling rollbacks, minimizing downtime), and risk mitigation strategies.</li>
                          <li style={{ marginBottom: '8px' }}><strong>Cultural Fit & References (10%):</strong> Demonstrated ability to partner effectively with internal teams, quality of the proposed project management structure, and feedback from at least three provided client references.</li>
                        </ul>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Shortlisted vendors will be invited to present an oral defense of their proposal and conduct a technical deep-dive whiteboard session with our engineering leadership.</p>
                      </section>
                      <section>
                        <h3 style={{ margin: '32px 0 12px 0', fontSize: '18px', color: '#1e293b' }}>10. Submission Guidelines & Contact</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Proposals must be submitted electronically via the secure procurement portal in PDF format. The technical proposal and commercial proposal must be submitted as separate documents.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}><strong>Deadline:</strong> All submissions must be received no later than Friday, October 15th at 5:00 PM EST. Late submissions will not be considered under any circumstances.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}><strong>Q&A Process:</strong> Vendors may submit written questions for clarification until October 1st. All questions and anonymized responses will be distributed to all participating vendors via an addendum on October 5th.</p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>For technical inquiries or access issues with the portal, please contact the primary procurement officer: <em>procurement@organization.com</em>.</p>
                      </section>
                    </>
                  )
                }
              ].map(page => (
                <div key={page.id} style={{
                  backgroundColor: 'var(--app-color-surface)',
                  width: '100%',
                  maxWidth: '850px',
                  minHeight: '1100px', // Standard page height
                  padding: '40px 64px 64px 64px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  color: 'var(--app-color-text)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  lineHeight: '1.6',
                  position: 'relative'
                }}>
                  {/* Content area */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {page.content}
                  </div>
                  
                  {/* Page number footer */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '32px', 
                    left: 0, 
                    right: 0, 
                    textAlign: 'center', 
                    fontSize: '12px', 
                    color: 'var(--app-color-text-muted)',
                    borderTop: '1px solid var(--app-color-border)',
                    paddingTop: '16px',
                    margin: '0 64px'
                  }}>
                    Page {page.id} of 5
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setFileToDelete(null)}
        >
          <div style={{
            backgroundColor: 'var(--app-color-surface)',
            width: 'min(360px, calc(100vw - 32px))',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '24px 20px',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Icon name="trash" size={24} />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: 'var(--app-color-primary)' }}>Remove uploaded file?</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
              This file will be removed from the upload list. You can upload it again if needed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', width: '100%' }}>
              <Button variant="ghost" onClick={() => setFileToDelete(null)} style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteFile} style={{ flex: 1, justifyContent: 'center' }}>
                Remove File
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Toast */}
      {deleteToast && (
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
          File removed successfully.
        </div>
      )}



      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
