import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Badge } from '../components/ui/Badge';
import { MultiSelect } from '../components/ui/MultiSelect';
import { Toast } from '../components/ui/Toast';
import { AlertModal } from '../components/ui/AlertModal';
import { IconButton } from '../components/ui/IconButton';

interface TemplatesProps {
  globalReviewers: string[];
  activeView: 'list' | 'details' | 'configuration';
  onViewChange: (view: 'list' | 'details' | 'configuration') => void;
}

export function Templates({ globalReviewers, activeView, onViewChange }: TemplatesProps) {
  // Configuration State
  const [showConfigToast, setShowConfigToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({ type: 'success' as 'success' | 'error', title: '', description: '' });
  const [configValidationError, setConfigValidationError] = useState('');
  
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Actions Menu State
  const [openMenuIndex, setOpenMenuIndex] = useState<string | null>(null);

  const templateData = { 
    id: 'TPL-SOW', 
    name: 'Statement of Work (SOW)', 
    type: 'SOW', 
    description: 'Standard template for Statement of Work generation. Defines project structure, scope, deliverables, and commercial terms.', 
    version: 'v1.0', 
    totalSections: 8, 
    lastUpdated: 'Jul 12, 2026', 
    status: 'Active' 
  };

  const [configSectionsData, setConfigSectionsData] = useState([
    { no: '1.0', name: 'Project Introduction', desc: 'Overview of the project context and objectives.', mandatory: true, reviewers: ['Anna Marie Pinto'] },
    { no: '2.0', name: 'Project Scope', desc: 'Detailed breakdown of in-scope and out-of-scope items.', mandatory: true, reviewers: ['Anna Marie Pinto', 'Himanshu Khandelwal'] },
    { no: '3.0', name: 'Business Requirements', desc: 'Functional and non-functional requirements.', mandatory: true, reviewers: [] },
    { no: '4.0', name: 'Solution Approach', desc: 'Technical and architectural approach proposed.', mandatory: true, reviewers: ['Sagar'] },
    { no: '5.0', name: 'Deliverables', desc: 'List of tangible artifacts to be delivered.', mandatory: true, reviewers: [] },
    { no: '6.0', name: 'Commercial Terms', desc: 'Pricing, payment milestones, and terms.', mandatory: false, reviewers: [] },
    { no: '7.0', name: 'Risks & Mitigation', desc: 'Identified risks and their mitigation strategies.', mandatory: false, reviewers: [] },
    { no: '8.0', name: 'Appendices', desc: 'Supporting information and documents.', mandatory: false, reviewers: [] }
  ]);
  
  const handleReviewerChange = (index: number, newReviewers: string[]) => {
    const newSections = [...configSectionsData];
    newSections[index].reviewers = newReviewers;
    setConfigSectionsData(newSections);
    setIsDirty(true);
  };

  const handleSaveConfig = () => {
    // Validate: Every section must have at least one default reviewer
    const hasInvalid = configSectionsData.some(s => s.reviewers.length === 0);
    if (hasInvalid) {
      setConfigValidationError('Assign at least one default reviewer to each section.');
      setTimeout(() => setConfigValidationError(''), 4000);
      return;
    }
    
    setConfigValidationError('');
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        setIsSaving(false);
        setSaveStatus('saved');
        setIsDirty(false);
        setToastConfig({
          type: 'success',
          title: 'Configuration saved successfully',
          description: 'Default reviewer assignments have been updated. These reviewers will be automatically preselected during document generation.'
        });
        setShowConfigToast(true);
        
        setTimeout(() => {
          setSaveStatus('idle');
        }, 1000);
      } catch (e) {
        setIsSaving(false);
        setToastConfig({
          type: 'error',
          title: 'Unable to save configuration',
          description: 'Please try again.'
        });
        setShowConfigToast(true);
      }
    }, 1500);
  };

  const handleDelete = () => {
    // Cannot delete active templates in Phase 1
    if (templateData.status === 'Active') {
      alert('Active templates cannot be deleted.');
      return;
    }
    setShowDeleteModal(true);
  };

  if (activeView === 'details') {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', gap: '24px' }}>
        
        {/* Section 1: Template Information */}
        <Card title="Template Information">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Template Name</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{templateData.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Document Type</div>
              <div style={{ fontSize: '14px' }}>{templateData.type}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Version</div>
              <div style={{ fontSize: '14px' }}>{templateData.version}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Status</div>
              <div style={{ fontSize: '14px' }}>
                <Badge tone="success">{templateData.status}</Badge>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Last Updated</div>
              <div style={{ fontSize: '14px' }}>{templateData.lastUpdated}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Description</div>
              <div style={{ fontSize: '14px' }}>{templateData.description}</div>
            </div>
          </div>
        </Card>

        {/* Section 2: Template Sections */}
        <Card title="Template Sections">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: 'var(--app-color-surface-muted)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)' }}>Section No.</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)' }}>Section Name</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)' }}>Description</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {configSectionsData.map((sec, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--app-color-border)' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{sec.no}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-primary)', fontWeight: 500 }}>{sec.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text-muted)' }}>{sec.desc}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <Badge tone={sec.mandatory ? 'info' : 'default'}>{sec.mandatory ? 'Mandatory' : 'Optional'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section 3: Default Reviewer Configuration */}
        <Card title="Default Reviewer Configuration">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: 'var(--app-color-surface-muted)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)' }}>Section Name</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)' }}>Default Reviewers</th>
                </tr>
              </thead>
              <tbody>
                {configSectionsData.map((sec, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--app-color-border)' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{sec.name}</td>
                    <td style={{ padding: '16px' }}>
                      {sec.reviewers.length > 0 ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {sec.reviewers.map(r => (
                            <span key={r} className="multi-select__chip">
                              {r}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--app-color-danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icon name="alert-circle" size={14} /> Unassigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', gap: '16px' }}>
      
      <div className="screen-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--app-color-border)' }}>
        <div className="tabs-container" style={{ margin: 0, borderBottom: 'none' }}>
          <button
            className={`tab-item ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
          >
            Templates
          </button>
          <button
            className={`tab-item ${activeView === 'configuration' ? 'active' : ''}`}
            onClick={() => onViewChange('configuration')}
          >
            Configuration
          </button>
        </div>
      </div>

      {activeView === 'list' && (
        <Card className="card-flex-column">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--app-color-text-muted)' }}>
                  <Icon name="search" size={14} />
                </div>
                <input type="text" placeholder="Search Template..." style={{ padding: '8px 12px 8px 32px', border: '1px solid var(--app-color-border)', borderRadius: '24px', fontSize: '13px', width: '100%' }} />
              </div>
            </div>
            <Button variant="accent" onClick={() => {}} style={{ padding: '8px 16px', fontSize: '13px' }}>
              <Icon name="plus" size={14} /> Create New Template
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: 'var(--app-color-surface-muted)' }}>
                  {['Template Name', 'Version', 'Total Sections', 'Last Updated', 'Status', 'Actions'].map(col => (
                    <th key={col} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', textAlign: col === 'Actions' ? 'right' : 'left' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--app-color-border)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#3b82f6', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }} onClick={() => onViewChange('details')}>
                    {templateData.name}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{templateData.version}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{templateData.totalSections}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text-muted)' }}>{templateData.lastUpdated}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <Badge tone="success">{templateData.status}</Badge>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text-muted)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <IconButton 
                        label="Edit Template" 
                        onClick={(e) => { e.stopPropagation(); /* open edit template flow */ }}
                        style={{ color: 'var(--app-color-success)', transition: 'opacity 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Icon name="edit" size={16} />
                      </IconButton>
                      
                      <IconButton 
                        label="Delete Template" 
                        onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                        style={{ color: 'var(--app-color-danger)', transition: 'opacity 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Icon name="trash" size={16} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeView === 'configuration' && (
        <Card className="card-flex-column card-gap-24">

          {configValidationError && (
            <div style={{ color: 'var(--app-color-danger)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="alert-circle" size={14} /> {configValidationError}
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: 'var(--app-color-surface-muted)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', width: '80px' }}>No.</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)' }}>Section Name</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', width: '120px' }}>Mandatory</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', width: '400px' }}>Default Reviewers</th>
                </tr>
              </thead>
              <tbody>
                {configSectionsData.map((sec, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--app-color-border)' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{sec.no}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{sec.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <Badge tone={sec.mandatory ? 'info' : 'default'}>{sec.mandatory ? 'Yes' : 'No'}</Badge>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <MultiSelect 
                        options={globalReviewers}
                        value={sec.reviewers}
                        onChange={(val) => handleReviewerChange(idx, val)}
                        placeholder="Select reviewers"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeView === 'configuration' && (
        <div className="sticky-bottom-bar" style={{ justifyContent: 'flex-end', marginTop: 'auto' }}>
          <Button 
            variant="accent" 
            onClick={handleSaveConfig} 
            disabled={!isDirty || isSaving || saveStatus === 'saved'}
            style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
          >
            {isSaving ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Icon name="check" size={16} /> Saved
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </div>
      )}

      <Toast 
        isOpen={showConfigToast}
        onClose={() => setShowConfigToast(false)}
        title={toastConfig.title}
        description={toastConfig.description}
        type={toastConfig.type}
        duration={6000}
      />

      <AlertModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Template?"
        description="Are you sure you want to delete this template? This action cannot be undone."
        type="error"
        showOkButton={true}
        okButtonText="Delete"
      />
    </div>
  );
}
