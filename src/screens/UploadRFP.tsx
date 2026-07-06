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
  const [rfpError, setRfpError] = useState('');
  const [supportError, setSupportError] = useState('');


  const handleRfpFileSelect = (files: File[]) => {
    setRfpError('');
    if (files.length > 0) setRfpFiles([files[0]]);
  };
  const handleRfpFileRemove = (index: number) => {
    setRfpError('');
    setRfpFiles(prev => prev.filter((_, i) => i !== index));
  };
  const handleRfpFileReplace = (_index: number, file: File) => {
    setRfpError('');
    setRfpFiles([file]);
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

  const handleSupportFileReplace = (index: number, file: File) => {
    setSupportError('');
    const isDuplicate = supportFiles.some((existing, i) => i !== index && existing.name === file.name && existing.size === file.size);
    if (isDuplicate) {
      setSupportError('This file has already been uploaded.');
      return;
    }
    setSupportFiles(prev => {
      const newArr = [...prev];
      newArr[index] = file;
      return newArr;
    });
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
    
    setTimeout(() => {
      onTransitionToDraft?.();
    }, 2000);
  };

  return (
    <>
      <div className="screen-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '24px' }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 className="screen-title" style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px', color: 'var(--app-color-primary)' }}>
            Upload RFP
          </h1>
          <p className="screen-description" style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', color: 'var(--app-color-text-muted)' }}>
            Provide your main RFP and any supporting documents. Our system will analyze them to instantly generate a contextual SOW draft.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', paddingBottom: '32px' }}>
        <Card title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="card-number-badge">1</span>
            <div>Primary RFP Document <span style={{ color: 'var(--app-color-danger)' }}>*</span></div>
          </div>
        }>
          <div style={{ marginBottom: '16px', color: 'var(--app-color-text-muted)', fontSize: '14px' }}>
            Upload the main RFP file (PDF, DOCX up to 10MB)
          </div>
          <FileUpload 
            multiple={false} 
            hint="Drag and drop your file here"
            description="or click to browse"
            supportedFormats={['PDF', 'DOCX']}
            maxSize="10MB"
            onFileSelect={handleRfpFileSelect}
            files={rfpFiles}
            onFileRemove={handleRfpFileRemove}
            onFileReplace={handleRfpFileReplace}
            disabled={rfpFiles.length >= 1}
            disabledMessage="Only one Primary RFP document can be uploaded. Remove or replace the existing file to upload another."
            showReplace={true}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="card-number-badge">2</span>
            Supporting Documents
          </div>
        }>
          <div style={{ marginBottom: '16px', color: 'var(--app-color-text-muted)', fontSize: '14px' }}>
            Upload annexures, guidelines or supporting documents. (Up to 5 files, 10MB each)
          </div>
          <FileUpload 
            multiple={true} 
            hint="Drag and drop files here"
            description="or click to browse"
            maxFiles={5}
            maxSize="10MB"
            supportedFormats={['PDF', 'DOCX', 'TXT', 'Excel', 'PPT', 'Images']}
            onFileSelect={handleSupportFileSelect}
            files={supportFiles}
            onFileRemove={handleSupportFileRemove}
            onFileReplace={handleSupportFileReplace}
            disabled={supportFiles.length >= 5}
            disabledMessage="Maximum of 5 supporting documents uploaded. Remove an existing document to upload another."
            showReplace={true}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="card-number-badge">3</span>
            Project Keywords
          </div>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--app-color-text-muted)', marginBottom: '16px' }}>
                Add project keywords manually or extract them automatically from the uploaded RFP to improve SOW generation.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  flex: 1,
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '12px 16px', 
                  border: '1px solid var(--app-color-border)', 
                  borderRadius: 'var(--app-radius-sm)',
                  backgroundColor: 'var(--app-color-surface)'
                }}>
                  <input 
                    type="text" 
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type and press Enter to add a tag"
                    style={{ 
                      border: 'none', 
                      outline: 'none', 
                      flex: 1, 
                      backgroundColor: 'transparent',
                      color: 'var(--app-color-text)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <Button variant="primary" onClick={handleExtractTags} disabled={isExtracting || rfpFiles.length === 0}>
                  {isExtracting ? (
                    <><Icon name="loader" size={16} className="icon-spin" /> Extracting...</>
                  ) : (
                    <><Icon name="tag" size={16} /> Extract Keywords</>
                  )}
                </Button>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="help-circle" size={14} /> Suggested tags will appear here automatically.
              </div>

              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                alignItems: 'center'
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
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="sticky-bottom-bar">
        <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginRight: 'auto' }}>
          Submit will be enabled once RFP is uploaded
        </div>
        <Button variant="ghost" onClick={handleClear} disabled={isSubmitting} style={{ color: 'var(--app-color-text)', border: '1px solid var(--app-color-border)' }}>
          <Icon name="trash" size={16} /> Clear
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
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--app-color-surface)',
          border: '1px solid var(--app-color-success)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          padding: '16px 24px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1000,
          animation: 'slideUpFade 0.3s ease-out forwards'
        }}>
          <div style={{ color: 'var(--app-color-success)' }}>
            <Icon name="check-circle" size={24} />
          </div>
          <div style={{ color: 'var(--app-color-text)', fontWeight: 500, fontSize: '14px' }}>
            RFP uploaded successfully. SOW extraction is in progress.
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  );
}
