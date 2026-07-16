import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Badge } from '../components/ui/Badge';
import { IconButton } from '../components/ui/IconButton';
import { Button } from '../components/ui/Button';
import { MultiSelect } from '../components/ui/MultiSelect';

interface TemplatesProps {
  globalReviewers: string[];
  activeView: 'list' | 'details';
  onViewChange: (view: 'list' | 'details') => void;
}

export function Templates({ globalReviewers, activeView, onViewChange }: TemplatesProps) {
  const [detailsTab, setDetailsTab] = useState<'overview' | 'configuration' | 'activity-log'>('overview');
  const [reviewerPopupSection, setReviewerPopupSection] = useState<string | null>(null);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<{name: string, role: string, email: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [reviewerNote, setReviewerNote] = useState('');

  useEffect(() => {
    if (reviewerPopupSection !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [reviewerPopupSection]);

  // Mock global users for suggestions
  const globalUsers = [
    { name: 'Anna Marie Pinto', role: 'Project Manager', email: 'anna@example.com' },
    { name: 'Sagar', role: 'Technical Lead', email: 'sagar@example.com' },
    { name: 'Himanshu Khandelwal', role: 'Solution Architect', email: 'himanshu@example.com' },
    { name: 'John Doe', role: 'Developer', email: 'john@example.com' },
    { name: 'Jane Doe', role: 'Designer', email: 'jane@example.com' },
    { name: 'Narendra Patel', role: 'Engineer', email: 'narendra@example.com' },
    { name: 'Dipali Balkrishna Patil', role: 'Designer', email: 'dipali@example.com' }
  ];

  const filteredSuggestions = globalUsers.filter(u => 
    u.name.toLowerCase().includes(recipientSearch.toLowerCase()) &&
    !selectedRecipients.find(sr => sr.name === u.name)
  );

  const handleAddReviewerToSection = () => {
    if (selectedRecipients.length > 0 && reviewerPopupSection) {
      setConfigSections(prev => prev.map(sec => {
        if (sec.name === reviewerPopupSection) {
          const newReviewers = [...sec.reviewers];
          selectedRecipients.forEach(r => {
            if (!newReviewers.includes(r.name)) newReviewers.push(r.name);
          });
          return { ...sec, reviewers: newReviewers };
        }
        return sec;
      }));
    }
    setReviewerPopupSection(null);
    setSelectedRecipients([]);
    setRecipientSearch('');
    setReviewerNote('');
  };
  
  const [configSections, setConfigSections] = useState([
    { no: '1.0', name: 'Project Introduction', mandatory: true, reviewers: ['Anna Marie Pinto'] },
    { no: '2.0', name: 'Project Scope', mandatory: true, reviewers: ['Anna Marie Pinto', 'Himanshu Khandelwal'] },
    { no: '3.0', name: 'Business Requirements', mandatory: true, reviewers: ['Sagar'] },
    { no: '4.0', name: 'Solution Approach', mandatory: true, reviewers: [] },
    { no: '5.0', name: 'Deliverables', mandatory: true, reviewers: ['Sagar', 'John Doe'] },
    { no: '6.0', name: 'Commercial Terms', mandatory: false, reviewers: ['Jane Doe'] },
    { no: '7.0', name: 'Risks & Mitigation', mandatory: false, reviewers: [] },
    { no: '8.0', name: 'Appendices', mandatory: false, reviewers: [] }
  ]);

  const activityLogData = [
    { id: 1, action: 'Added Reviewer', target: 'Mike', details: 'Added to Business Requirements section.', date: 'Jul 14, 10:30 AM', icon: 'sparkles', color: '#0ea5e9', user: 'System Admin' },
    { id: 2, action: 'Changed Reviewer', target: 'Jane Doe', details: 'Replaced John Doe for Commercial Terms section.', date: 'Jul 13, 04:15 PM', icon: 'sparkles', color: '#0ea5e9', user: 'Dipali Balkrishna Patil' },
    { id: 3, action: 'Removed Section', target: 'Old Pricing', details: 'Section removed from template structure.', date: 'Jul 12, 02:00 PM', icon: 'sparkles', color: '#0ea5e9', user: 'Project Sponsor' },
    { id: 4, action: 'Added Section', target: 'Project Timeline', details: 'New mandatory section added to template.', date: 'Jul 11, 09:45 AM', icon: 'sparkles', color: '#0ea5e9', user: 'Finance Reviewer' }
  ];
  const [toastMsg, setToastMsg] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  const templateList = [
    { 
      id: 'TPL-SOW', 
      name: 'Statement of Work (SOW)', 
      type: 'SOW', 
      description: 'This is the standard Statement of Work (SOW) template used for defining project scope, deliverables, timelines, and commercial terms. It provides a comprehensive framework to ensure all project expectations are clearly documented and agreed upon by both internal teams and external clients.\n\nUse this template to establish a legally binding agreement for new engagements. It includes mandatory sections such as Business Requirements and Commercial Terms, alongside optional sections for specific service offerings. The template is regularly updated to comply with the latest organizational policies and industry standards.', 
      version: 'v1.0', 
      totalSections: 12, 
      lastUpdated: 'Jul 10, 2026', 
      status: 'Active',
      disabled: false
    },
    { 
      id: 'TPL-PC', 
      name: 'Project Charter', 
      type: 'PC', 
      description: 'Formal document that authorizes a project and defines its objectives and stakeholders.', 
      version: 'v0.1', 
      totalSections: 5, 
      lastUpdated: 'Jul 14, 2026', 
      status: 'Draft',
      disabled: true
    },
    { 
      id: 'TPL-PROP', 
      name: 'Proposal', 
      type: 'Proposal', 
      description: 'Standard proposal template for new client engagements and services.', 
      version: 'v1.2', 
      totalSections: 12, 
      lastUpdated: 'Jul 01, 2026', 
      status: 'Draft',
      disabled: true
    },
    { 
      id: 'TPL-BXT', 
      name: 'BXT Document', 
      type: 'BXT', 
      description: 'Business, Experience, and Technology strategy document framework.', 
      version: 'v0.5', 
      totalSections: 10, 
      lastUpdated: 'Jun 28, 2026', 
      status: 'Draft',
      disabled: true
    },
    { 
      id: 'TPL-BRD', 
      name: 'Business Requirements', 
      type: 'BRD', 
      description: 'Business Requirements Document (BRD) template for capturing functional needs.', 
      version: 'v2.0', 
      totalSections: 15, 
      lastUpdated: 'May 15, 2026', 
      status: 'Draft',
      disabled: true
    }
  ];

  const templateData = templateList[0];

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert('This template is reserved for future use.');
  };

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    alert(`${action} action triggered.`);
  };

  if (activeView === 'details') {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', gap: '24px' }}>
        
        {/* Header removed based on user request */}

        {/* Tabs */}
        <div className="tabs-container" style={{ margin: 0, borderBottom: '1px solid var(--app-color-border)' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'configuration', label: 'Configure Section' },
            { id: 'activity-log', label: 'Activity Log' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-item ${detailsTab === tab.id ? 'active' : ''}`}
              onClick={() => setDetailsTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab Content */}
        {detailsTab === 'overview' && (
          <Card title="Template Information">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Template Name</div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--app-color-text)' }}>{templateData.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Current Version</div>
                <div style={{ fontSize: '15px', color: 'var(--app-color-text)' }}>{templateData.version}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Total Sections</div>
                <div style={{ fontSize: '15px', color: 'var(--app-color-text)' }}>{templateData.totalSections}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Category</div>
                <div style={{ fontSize: '15px', color: 'var(--app-color-text)' }}>Legal / Contracting</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Target Audience</div>
                <div style={{ fontSize: '15px', color: 'var(--app-color-text)' }}>External Clients, Internal Stakeholders</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Language</div>
                <div style={{ fontSize: '15px', color: 'var(--app-color-text)' }}>English (US)</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Created By</div>
                <div style={{ fontSize: '15px', color: 'var(--app-color-text)' }}>System Admin</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Status</div>
                <div style={{ fontSize: '15px' }}>
                  <Badge tone="success">{templateData.status}</Badge>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Last Updated</div>
                <div style={{ fontSize: '15px', color: 'var(--app-color-text)' }}>{templateData.lastUpdated}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginBottom: '6px' }}>Description</div>
                <div style={{ fontSize: '15px', color: 'var(--app-color-text)', lineHeight: 1.6 }}>
                  {templateData.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} style={{ margin: '0 0 12px 0' }}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Configuration Tab Content */}
        {detailsTab === 'configuration' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--app-color-text)', margin: '0 0 4px 0' }}>Sections & Reviewers</h3>
                <p style={{ fontSize: '14px', color: 'var(--app-color-text-muted)', margin: 0 }}>Manage the sections included in this template and their assigned reviewers.</p>
              </div>
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid var(--app-color-border)', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: 'var(--app-color-surface-muted)' }}>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', width: '60px' }}>No.</th>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)' }}>Section Name</th>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', width: '120px' }}>Mandatory</th>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', width: '350px' }}>Assigned Reviewers</th>
                  </tr>
                </thead>
                <tbody>
                  {configSections.map((sec, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === configSections.length - 1 ? 'none' : '1px solid var(--app-color-border)' }}>
                      <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text-muted)' }}>{sec.no}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 500 }}>{sec.name}</td>
                      <td style={{ padding: '16px' }}>
                        <Badge tone={sec.mandatory ? 'info' : 'default'}>{sec.mandatory ? 'Yes' : 'No'}</Badge>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <MultiSelect 
                          options={globalReviewers}
                          value={sec.reviewers}
                          onChange={(val) => {
                            const newSections = [...configSections];
                            newSections[idx].reviewers = val;
                            setConfigSections(newSections);
                          }}
                          placeholder="Select reviewers"
                          actionLabel="Add Reviewer"
                          onActionClick={() => setReviewerPopupSection(sec.name)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Activity Log Tab Content */}
        {detailsTab === 'activity-log' && (
          <div style={{ marginTop: '0px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--app-color-text)', margin: '0 0 8px 0' }}>Activity Log</h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--app-color-text-muted)' }}>A complete audit trail of all actions performed on this template.</p>
            </div>
            
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              {/* Vertical Timeline Line */}
              <div style={{ position: 'absolute', top: '16px', bottom: '16px', left: '23px', width: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {activityLogData.map((log) => {
                  return (
                    <div key={log.id} style={{ position: 'relative', display: 'flex', gap: '16px', zIndex: 1 }}>
                      {/* Timeline Badge */}
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: '#ffffff', color: log.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid #bfdbfe', marginLeft: '-16px', zIndex: 2
                      }}>
                        <Icon name={log.icon as any} size={16} />
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
                                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)' }}>{log.action}</h3>
                              </div>
                              <p style={{ margin: 0, fontSize: '13px', color: 'var(--app-color-text-muted)', lineHeight: 1.5 }}>
                                {log.details}
                              </p>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', whiteSpace: 'nowrap', textAlign: 'right' }}>
                              <div style={{ fontWeight: 500, color: 'var(--app-color-text)' }}>{log.date}</div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                                <Icon name="user" size={12} /> {log.user}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Add Reviewer Modal */}
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
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Information Card */}
                <div style={{ 
                  width: '100%', padding: '16px', backgroundColor: 'var(--app-color-surface-muted)', 
                  borderRadius: '8px', border: '1px solid var(--app-color-border)',
                  display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', fontWeight: 500 }}>Section Name:</span>
                    <span style={{ fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 600 }}>{reviewerPopupSection}</span>
                  </div>
                </div>

                {/* Recipient Search */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--app-color-text)', marginBottom: '8px' }}>
                    Reviewer <span style={{ color: 'var(--app-color-danger)' }}>*</span>
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
                        borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10,
                        maxHeight: '200px', overflowY: 'auto'
                      }}>
                        {filteredSuggestions.map((user, i) => {
                          const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                          return (
                            <div 
                              key={i}
                              onClick={() => {
                                setSelectedRecipients(prev => [...prev, user]);
                                setRecipientSearch('');
                                setShowSuggestions(false);
                              }}
                              style={{ 
                                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                                cursor: 'pointer', borderBottom: i < filteredSuggestions.length - 1 ? '1px solid var(--app-color-border)' : 'none'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#cffafe', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>
                                {initials}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--app-color-text)' }}>{user.name}</span>
                                <span style={{ fontSize: '12px', color: 'var(--app-color-text-muted)' }}>{user.email}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviewer Note */}
                <textarea 
                  placeholder="Add a note for the reviewer"
                  value={reviewerNote}
                  onChange={(e) => setReviewerNote(e.target.value)}
                  style={{
                    width: '100%', minHeight: '120px', padding: '12px',
                    border: '1px solid var(--app-color-border)', borderRadius: '8px',
                    backgroundColor: 'var(--app-color-surface)', color: 'var(--app-color-text)',
                    fontSize: '14px', fontFamily: 'inherit', resize: 'vertical'
                  }}
                />
              </div>
              
              {/* Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--app-color-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: 'var(--app-color-surface)' }}>
                <Button variant="ghost" onClick={() => setReviewerPopupSection(null)}>Cancel</Button>
                <Button variant="accent" onClick={handleAddReviewerToSection} disabled={selectedRecipients.length === 0} style={{ opacity: selectedRecipients.length === 0 ? 0.6 : 1, backgroundColor: '#86d9d4', color: 'white', border: 'none' }}>Add Reviewer</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', gap: '24px' }}>
      
      {/* Template Library Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '24px' 
        }}
      >
        {templateList.filter(tpl => tpl.name === 'Statement of Work (SOW)').map((tpl) => (
          <div 
            key={tpl.id}
            role="button"
            tabIndex={0}
            onClick={(e) => tpl.disabled ? handleDisabledClick(e) : onViewChange('details')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (tpl.disabled) {
                  handleDisabledClick(e as any);
                } else {
                  onViewChange('details');
                }
              }
            }}
            title={tpl.disabled ? 'This template is reserved for future use.' : `Open template ${tpl.name}`}
            aria-label={`Open template ${tpl.name}`}
            style={{
              backgroundColor: 'var(--app-color-surface)',
              border: '1px solid var(--app-color-border)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              cursor: tpl.disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              height: '100%',
              opacity: tpl.disabled ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!tpl.disabled) {
                e.currentTarget.style.borderColor = 'var(--app-color-primary-soft)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                const arrow = e.currentTarget.querySelector('.card-arrow') as HTMLElement;
                if (arrow) arrow.style.transform = 'translateX(4px)';
              } else {
                e.currentTarget.style.borderColor = 'var(--app-color-border)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--app-color-border)';
              e.currentTarget.style.boxShadow = 'none';
              const arrow = e.currentTarget.querySelector('.card-arrow') as HTMLElement;
              if (arrow) arrow.style.transform = 'translateX(0)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid var(--app-color-focus)';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--app-color-surface-muted)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--app-color-primary)'
              }}>
                <Icon name="file-text" size={20} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <IconButton 
                    label="Edit Template" 
                    onClick={(e) => handleAction(e, 'Edit')}
                    style={{ color: 'var(--app-color-text-muted)', width: '28px', height: '28px', opacity: tpl.disabled ? 0.5 : 1 }}
                  >
                    <Icon name="edit" size={14} />
                  </IconButton>
                </div>
                <Badge tone={tpl.status === 'Active' ? 'success' : 'default'}>{tpl.status}</Badge>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--app-color-text)', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                {tpl.name}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--app-color-text-muted)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {tpl.description}
              </p>
              
              {/* Metadata */}
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--app-color-text-muted)', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="tag" size={14} /> <span style={{ fontWeight: 500 }}>Version {tpl.version}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="list" size={14} /> <span style={{ fontWeight: 500 }}>{tpl.totalSections} Sections</span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginTop: '8px' }}>
                Last updated {tpl.lastUpdated}
              </div>
            </div>

            {/* Card Footer / Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--app-color-border)', fontSize: '14px', fontWeight: 600, color: tpl.disabled ? 'var(--app-color-text-muted)' : 'var(--app-color-primary)' }}>
              <span>Open Template</span>
              {!tpl.disabled && (
                <span className="card-arrow" style={{ transition: 'transform 0.2s ease', display: 'flex' }}>
                  <Icon name="arrow-right" size={16} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
