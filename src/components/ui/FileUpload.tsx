import React, { useRef, useState } from 'react';
import { Icon } from './Icon';

interface FileUploadProps {
  multiple?: boolean;
  hint?: string;
  description?: string;
  maxFiles?: number;
  maxSize?: string;
  supportedFormats?: string[];
  files?: File[];
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  onFilePreview?: (index: number) => void;
  className?: string;
  disabled?: boolean;
  disabledMessage?: string;
  onDisabledClick?: () => void;
  statusText?: string;
}

export function FileUpload({ 
  multiple = false, 
  hint = 'Drag and drop your file here', 
  description = 'or click to browse',
  maxFiles,
  maxSize,
  supportedFormats,
  files = [], 
  onFileSelect, 
  onFileRemove,
  onFilePreview,
  className = '',
  disabled = false,
  disabledMessage,
  onDisabledClick,
  statusText
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleContainerClick = () => {
    if (disabled) {
      if (onDisabledClick) onDisabledClick();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFileSelect?.(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) {
      if (onDisabledClick) onDisabledClick();
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      onFileSelect?.(newFiles);
    }
  };

  const hasFooter = supportedFormats || maxSize || maxFiles;

  const dropZone = (
    <div 
      className="file-upload" 
      onClick={handleContainerClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-drag={isDragging}
      style={{ ...(disabled ? { opacity: 0.6, cursor: 'not-allowed', backgroundColor: 'var(--app-color-surface-hover)', position: 'relative' } : {}), height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      onMouseEnter={() => disabled && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {disabled && showTooltip && disabledMessage && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--app-color-text)',
          color: 'var(--app-color-surface)',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          width: 'max-content',
          maxWidth: '280px',
          textAlign: 'center',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          pointerEvents: 'none',
          lineHeight: '1.4'
        }}>
          {disabledMessage}
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--app-color-text)'
          }} />
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        className="file-upload__input"
      />
      
      <div className="file-upload__drop-icon">
        <Icon name="upload-cloud" size={24} />
      </div>
      
      <div className="file-upload__drop-title">{hint}</div>
      <div className="file-upload__drop-hint" style={{ marginBottom: hasFooter ? '16px' : '0' }}>
        {description.split('click to browse').map((part, i, arr) => (
          <React.Fragment key={i}>
            {part}
            {i < arr.length - 1 && <span className="file-upload__browse-link">click to browse</span>}
          </React.Fragment>
        ))}
      </div>
      
      {hasFooter && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--app-color-text-muted)',
          marginTop: '8px'
        }}>
          {supportedFormats && (
            <span>Supported formats: {supportedFormats.join(', ')}</span>
          )}
          {maxSize && (
            <span>Max file size: {maxSize}{maxFiles ? ' each' : ''}</span>
          )}
          {maxFiles && (
            <span>Max files: {maxFiles}</span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={`file-upload-wrapper ${className} ${files.length > 0 ? 'file-upload-wrapper--has-files' : ''}`}>
      <div>
        {dropZone}
      </div>
      
      {files.length > 0 && (
        <div className="file-upload__files-section">
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: 'var(--app-color-text)', 
            marginBottom: '16px',
            marginTop: 0
          }}>
            Uploaded Files
          </h3>
          <div className="file-upload__grid">
            {files.map((f, i) => (
              <div 
                key={i} 
                className="file-item" 
                onClick={() => onFilePreview?.(i)}
                style={{ cursor: onFilePreview ? 'pointer' : 'default', margin: 0 }}
              >
                <div className="file-item__icon-wrapper">
                  <Icon name="file-text" size={20} />
                </div>
                <div className="file-item__main">
                  <div className="file-item__name">{f.name}</div>
                  <div className="file-item__meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                    {statusText && (
                      <>
                        <span>•</span>
                        <span style={{ color: 'var(--app-color-success)' }}>{statusText}</span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {onFilePreview && (
                    <button 
                      className="icon-button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFilePreview(i);
                      }}
                      aria-label="Preview file"
                      title="Preview file"
                    >
                      <Icon name="eye" size={16} />
                    </button>
                  )}
                  {onFileRemove && (
                    <button 
                      className="icon-button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileRemove(i);
                      }}
                      aria-label="Remove file"
                      title="Remove file"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
