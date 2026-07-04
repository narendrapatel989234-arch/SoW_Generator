import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { StepProgress, type Step } from '../components/ui/StepProgress';

export function UploadRFP() {
  const [rfpFiles, setRfpFiles] = useState<File[]>([]);
  const [supportFiles, setSupportFiles] = useState<File[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const steps: Step[] = [
    { id: 'upload', title: 'Upload', status: 'pending' },
    { id: 'review', title: 'Review', status: 'pending' },
    { id: 'sow', title: 'SOW Draft', status: 'pending' },
  ];

  const handleRfpFileSelect = (files: File[]) => {
    if (files.length > 0) setRfpFiles([files[0]]);
  };
  const handleRfpFileRemove = (index: number) => {
    setRfpFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSupportFileSelect = (files: File[]) => setSupportFiles(prev => [...prev, ...files]);
  const handleSupportFileRemove = (index: number) => {
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
  };

  const handleSubmit = () => {
    setHasTriedSubmit(true);
    if (rfpFiles.length === 0) return;
    console.log("Submitting:", { rfpFiles, supportFiles, tags });
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
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingLeft: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--app-color-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Step 1 of 3
          </div>
          <StepProgress steps={steps} activeStep="upload" />
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
          />
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
          />
        </Card>

        <Card title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="card-number-badge">3</span>
            Tags & Context
          </div>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--app-color-text-muted)', marginBottom: '16px' }}>
                Add context tags to guide the SOW generation (press Enter to add).
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
                <Button variant="secondary" onClick={handleExtractTags} disabled={isExtracting}>
                  {isExtracting ? (
                    <><Icon name="loader" size={16} className="icon-spin" /> Extracting...</>
                  ) : (
                    <><Icon name="tag" size={16} /> Extract from RFP</>
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
        <Button variant="ghost" onClick={handleClear} style={{ color: 'var(--app-color-text)', border: '1px solid var(--app-color-border)' }}>
          <Icon name="trash" size={16} /> Clear
        </Button>
        <Button variant="accent" onClick={handleSubmit} disabled={rfpFiles.length === 0} style={{ padding: '10px 24px' }}>
          Submit <Icon name="arrow-right" size={16} />
        </Button>
      </div>
    </>
  );
}
