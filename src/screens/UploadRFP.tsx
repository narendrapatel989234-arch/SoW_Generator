import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { AlertModal } from '../components/ui/AlertModal';

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
  const [showToast, setShowToast] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [rfpError, setRfpError] = useState('');
  const [supportError, setSupportError] = useState('');
  const [fileToDelete, setFileToDelete] = useState<{type: 'rfp' | 'support', index: number} | null>(null);
  const [deleteToast, setDeleteToast] = useState(false);

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

  const handleRfpFileSelect = (files: File[]) => {
    setRfpError('');
    if (files.length > 0) setRfpFiles([files[0]]);
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

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleClear = () => {
    setRfpFiles([]);
    setSupportFiles([]);
    setTags([]);
    setTagsInput('');
    setHasTriedSubmit(false);
    setIsSubmitting(false);
    setShowToast(false);
    setRfpError('');
    setSupportError('');
  };

  const handleSubmit = () => {
    setHasTriedSubmit(true);
    if (rfpFiles.length === 0) return;
    
    setIsSubmitting(true);
    setShowToast(true);
  };

  return (
    <>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', paddingBottom: '32px' }}>
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
            hint="Drag and drop your file here"
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

        <div style={{ opacity: rfpFiles.length === 0 ? 0.5 : 1, pointerEvents: rfpFiles.length === 0 ? 'none' : 'auto', transition: 'all 0.3s ease' }}>
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
            hint="Drag and drop files here"
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
        </div>

        <div style={{ opacity: rfpFiles.length === 0 ? 0.5 : 1, pointerEvents: rfpFiles.length === 0 ? 'none' : 'auto', transition: 'all 0.3s ease' }}>
          <Card title={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              Applicable Tags
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
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px', 
                  border: '1px solid var(--app-color-border)', 
                  borderRadius: 'var(--app-radius-sm)',
                  backgroundColor: 'var(--app-color-surface)'
                }}>
                  {tags.map((tag, i) => (
                    <Badge key={i} tone="info" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'var(--app-color-accent-soft)', color: 'var(--app-color-primary)', borderRadius: '24px', border: 'none', fontWeight: 500 }}>
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(i)} 
                        style={{ border: 'none', background: 'transparent', color: 'inherit', padding: 0, opacity: 0.6, cursor: 'pointer', display: 'flex' }}
                        aria-label="Remove tag"
                      >
                        <Icon name="x" size={12} />
                      </button>
                    </Badge>
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
                <Button variant="ghost" onClick={handleExtractTags} disabled={isExtracting || rfpFiles.length === 0} style={{ alignSelf: 'flex-start', border: '1px solid var(--app-color-border)' }}>
                  {isExtracting ? (
                    <><Icon name="loader" size={16} className="icon-spin" style={{ color: 'var(--app-color-primary)' }} /> Extracting...</>
                  ) : (
                    <><span style={{ color: 'var(--app-color-primary)' }}>✨</span> Extract from RFP</>
                  )}
                </Button>
              </div>


            </div>
          </div>
          </Card>
        </div>
      </div>

      <div className="sticky-bottom-bar">
        <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginRight: 'auto' }}>
          Submit will be enabled once RFP is uploaded
        </div>
        <Button variant="secondary" onClick={handleClear} disabled={isSubmitting}>
          <Icon name="x" size={16} /> Clear
        </Button>
        <Button variant="accent" onClick={handleSubmit} disabled={rfpFiles.length === 0 || isSubmitting} style={{ padding: '10px 24px' }}>
          {isSubmitting ? (
            <><Icon name="loader" size={16} className="icon-spin" /> Processing...</>
          ) : (
            <>Submit <Icon name="arrow-right" size={16} /></>
          )}
        </Button>
      </div>

      <AlertModal 
        isOpen={showToast}
        onClose={() => {
          setShowToast(false);
          onTransitionToDraft?.();
        }}
        title="RFP uploaded successfully"
        description="Your RFP has been uploaded successfully. We are preparing your Scope of Work. Please wait a moment while we process your documents."
        type="success"
        hideCloseButton={true}
        autoCloseDuration={10000}
      />

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
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>1. Project Overview</h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>This Request for Proposal (RFP) outlines the requirement for a comprehensive cloud migration and infrastructure modernization project. The selected vendor will be responsible for end-to-end delivery including assessment, planning, and execution.</p>
                </section>
                
                <section>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>2. Business Requirements</h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>The organization seeks to reduce operational costs by 30% while improving system availability to 99.99%. The new architecture must support dynamic scaling during peak business hours without manual intervention.</p>
                </section>
                
                <section>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>3. Scope Summary</h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>The scope includes migrating 45 legacy on-premise applications to a modern cloud-native environment. This covers database migration, refactoring of core monolithic services into microservices, and setting up CI/CD pipelines.</p>
                </section>
                
                <section>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>4. Technical Requirements</h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    <li>Implementation of Kubernetes (K8s) for container orchestration.</li>
                    <li>PostgreSQL as the primary relational database system.</li>
                    <li>Integration with existing Identity Provider (IdP) using OAuth 2.0 / SAML.</li>
                  </ul>
                </section>
                
                <section>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>5. Deliverables</h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    <li>Detailed Architecture Design Document (ADD).</li>
                    <li>Fully configured staging and production environments.</li>
                    <li>Comprehensive API documentation and runbooks for operations.</li>
                  </ul>
                </section>
                
                <section>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>6. Timeline Expectations</h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>The project is expected to kick off in Q3 and reach production go-live within 6 months. Milestone reviews will occur bi-weekly, with UAT scheduled for Month 5.</p>
                </section>
                
                <section>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>7. Compliance / Security Notes</h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>All proposed solutions must adhere strictly to SOC 2 Type II compliance standards and GDPR data protection regulations. Data must be encrypted both at rest (AES-256) and in transit (TLS 1.3).</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {fileToDelete && (
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
        onClick={() => setFileToDelete(null)}
        >
          <div style={{
            backgroundColor: 'var(--app-color-surface)',
            width: '100%',
            maxWidth: '400px',
            borderRadius: 'var(--app-radius-md)',
            border: '1px solid var(--app-color-border)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--app-shadow-soft)',
            overflow: 'hidden',
            padding: '24px'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--app-color-text)' }}>Remove uploaded file?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
              This file will be removed from the upload list. You can upload it again if needed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="ghost" onClick={() => setFileToDelete(null)} style={{ border: '1px solid var(--app-color-border)' }}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteFile} style={{ backgroundColor: 'var(--app-color-danger)', color: 'white' }}>
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
      `}</style>
    </>
  );
}
