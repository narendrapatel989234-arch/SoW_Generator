import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';

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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewFile) {
        setPreviewFile(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewFile]);

  const handleRfpFileSelect = (files: File[]) => {
    setRfpError('');
    if (files.length > 0) setRfpFiles([files[0]]);
  };
  const handleRfpFileRemove = (index: number) => {
    setRfpError('');
    setRfpFiles(prev => prev.filter((_, i) => i !== index));
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
    setSupportError('');
    setSupportFiles(prev => prev.filter((_, i) => i !== index));
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
    
    // Show toast for a short duration to let the user read it, then transition
    setTimeout(() => {
      onTransitionToDraft?.();
    }, 1500);
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
            supportedFormats={['PDF', 'DOCX']}
            maxSize="10MB"
            files={rfpFiles}
            onFileSelect={handleRfpFileSelect}
            onFileRemove={handleRfpFileRemove}
            onFilePreview={(i) => setPreviewFile(rfpFiles[i])}
            disabled={rfpFiles.length >= 1}
            disabledMessage="Only one RFP document can be uploaded. Delete the current file to upload another."
            statusText="Uploaded"
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
            hint="Drag and drop files here"
            description="or click to browse"
            maxFiles={5}
            maxSize="10MB"
            supportedFormats={['PDF', 'DOCX']}
            files={supportFiles}
            onFileSelect={handleSupportFileSelect}
            onFileRemove={handleSupportFileRemove}
            onFilePreview={(i) => setPreviewFile(supportFiles[i])}
            disabled={supportFiles.length >= 5}
            disabledMessage="Maximum of 5 supporting documents uploaded. Remove an existing document to upload another."
            statusText="Uploaded"
          />
          {supportError && (
            <div className="error-text">
              <Icon name="alert-circle" size={16} />
              {supportError}
            </div>
          )}
        </Card>

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
                    <Badge key={i} tone="info" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#F0FDF4', color: '#166534', border: 'none' }}>
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
                    <><Icon name="loader" size={16} className="icon-spin" /> Extracting...</>
                  ) : (
                    <>✨ Extract from RFP</>
                  )}
                </Button>
              </div>


            </div>
          </div>
        </Card>
      </div>

      <div className="sticky-bottom-bar">
        <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginRight: 'auto' }}>
          Submit will be enabled once RFP is uploaded
        </div>
        <Button variant="ghost" onClick={handleClear} disabled={isSubmitting} style={{ color: 'var(--app-color-text)', border: '1px solid var(--app-color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="x" size={16} /> <span>Clear</span>
        </Button>
        <Button variant="accent" onClick={handleSubmit} disabled={rfpFiles.length === 0 || isSubmitting} style={{ padding: '10px 24px' }}>
          {isSubmitting ? (
            <><Icon name="loader" size={16} className="icon-spin" /> Processing...</>
          ) : (
            <>Submit <Icon name="arrow-right" size={16} /></>
          )}
        </Button>
      </div>

      {showToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          backgroundColor: 'var(--app-color-surface)',
          border: '1px solid var(--app-color-border)',
          borderLeft: '4px solid var(--app-color-success)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
          padding: '16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          zIndex: 1000,
          animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div style={{ color: 'var(--app-color-success)', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            <Icon name="check-circle" size={20} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ color: 'var(--app-color-text)', fontWeight: 600, fontSize: '14px' }}>
              RFP uploaded successfully
            </div>
            <div style={{ color: 'var(--app-color-text-muted)', fontSize: '13px' }}>
              Your RFP has been uploaded successfully. We are preparing your Scope of Work.
            </div>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--app-color-text-muted)', 
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            aria-label="Close notification"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--app-color-surface)',
            width: '100%',
            height: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            borderRadius: 'var(--app-radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
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
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--app-color-text-muted)'
                }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <div style={{
              flex: 1,
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              padding: '32px',
              overflow: 'auto',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '800px',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>File Name</div>
                  <div style={{ fontWeight: 500 }}>{previewFile?.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>File Type</div>
                  <div style={{ fontWeight: 500 }}>{previewFile?.name.split('.').pop()?.toUpperCase() || 'Document'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>File Size</div>
                  <div style={{ fontWeight: 500 }}>{previewFile ? (previewFile.size / 1024 / 1024).toFixed(2) : 0} MB</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</div>
                  <div style={{ fontWeight: 500, color: 'var(--app-color-success)' }}>Uploaded</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Upload Time</div>
                  <div style={{ fontWeight: 500 }}>Just now</div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '800px',
                flex: 1,
                padding: '48px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                color: '#334155',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                lineHeight: '1.6'
              }}>
                <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '8px' }}>
                  <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#0f172a' }}>RFP Document Preview</h1>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Generated Preview for {previewFile.name}</p>
                </div>
                
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
      


      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
