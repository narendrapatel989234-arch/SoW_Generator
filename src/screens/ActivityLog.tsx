import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Icon, type IconName } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AlertModal } from '../components/ui/AlertModal';
import { Drawer } from '../components/ui/Drawer';
import { IconButton } from '../components/ui/IconButton';

interface Activity {
  id: string;
  date: string;
  time: string;
  user: string;
  avatar: string;
  isAI?: boolean;
  type: string;
  category: string;
  sectionName: string | null;
  sectionNumber: string | null;
  description: string;
  actionSummary: string;
  documentId: string;
  documentName: string;
  documentVersion: string;
  clientName: string;
  status: string | null;
  role: string;
  assignedReviewer?: string;
  previousReviewer?: string;
  newReviewer?: string;
  previousValue?: string;
  newValue?: string;
  previousState?: string;
  currentState?: string;
  relatedFiles?: { name: string; type: string }[];
  reviewStatus?: string;
  reviewComment?: string;
  dueDate?: string;
  createdAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
}

const dummyActivities: Activity[] = [
  {
    id: 'act-1',
    date: '13 Jul 2026',
    time: '10:42 AM',
    user: 'Narendra Patel',
    avatar: 'NP',
    role: 'PMO',
    category: 'Configuration',
    type: 'Reviewer Assigned',
    sectionName: 'Project Scope',
    sectionNumber: '1.2',
    description: 'Assigned a new reviewer for the Project Scope section to ensure technical alignment.',
    actionSummary: 'Anna Marie Pinto was assigned as reviewer for Project Scope.',
    documentId: 'SOW-2026-001',
    documentName: 'Cloud Migration Initiative',
    documentVersion: 'v1.0',
    clientName: 'Acme Corp',
    status: 'Configuration Saved',
    assignedReviewer: 'Anna Marie Pinto',
    createdAt: '12 Jul 2026, 09:00 AM',
    lastUpdatedAt: '13 Jul 2026, 10:42 AM'
  },
  {
    id: 'act-2',
    date: '13 Jul 2026',
    time: '10:15 AM',
    user: 'AI',
    avatar: 'AI',
    isAI: true,
    role: 'AI System',
    category: 'AI',
    type: 'Section Regenerated',
    sectionName: 'Commercial Terms',
    sectionNumber: '3.0',
    description: 'The section was regenerated to match the latest tag extractions.',
    actionSummary: 'Commercial Terms section was regenerated using AI.',
    documentId: 'SOW-2026-001',
    documentName: 'Cloud Migration Initiative',
    documentVersion: 'v1.0',
    clientName: 'Acme Corp',
    status: 'Completed',
    createdAt: '12 Jul 2026, 09:00 AM',
    lastUpdatedAt: '13 Jul 2026, 10:15 AM',
    completedAt: '13 Jul 2026, 10:15 AM',
    relatedFiles: [{ name: 'Generated SOW', type: 'doc' }]
  },
  {
    id: 'act-3',
    date: '13 Jul 2026',
    time: '09:55 AM',
    user: 'Narendra Patel',
    avatar: 'NP',
    role: 'PMO',
    category: 'Uploads',
    type: 'RFP Uploaded',
    sectionName: null,
    sectionNumber: null,
    description: 'Initial upload of the client RFP document.',
    actionSummary: 'Healthcare_RFP.pdf was uploaded successfully.',
    documentId: 'SOW-2026-001',
    documentName: 'Cloud Migration Initiative',
    documentVersion: 'v1.0',
    clientName: 'Acme Corp',
    status: 'Completed',
    createdAt: '13 Jul 2026, 09:50 AM',
    lastUpdatedAt: '13 Jul 2026, 09:55 AM',
    completedAt: '13 Jul 2026, 09:55 AM',
    relatedFiles: [{ name: 'Healthcare_RFP.pdf', type: 'pdf' }, { name: 'Supporting Documents', type: 'zip' }]
  },
  {
    id: 'act-4',
    date: '12 Jul 2026',
    time: '04:30 PM',
    user: 'Ashika Sharma',
    avatar: 'AS',
    role: 'PMO',
    category: 'Export',
    type: 'Document Exported',
    sectionName: null,
    sectionNumber: null,
    description: 'Exported the finalized document for client delivery.',
    actionSummary: 'The approved SOW was exported as PDF.',
    documentId: 'SOW-2026-002',
    documentName: 'Data Center Modernization',
    documentVersion: 'v2.1',
    clientName: 'Globex Inc',
    status: 'Exported',
    createdAt: '01 Jul 2026, 10:00 AM',
    lastUpdatedAt: '12 Jul 2026, 04:30 PM',
    completedAt: '12 Jul 2026, 04:30 PM'
  },
  {
    id: 'act-5',
    date: '12 Jul 2026',
    time: '02:15 PM',
    user: 'Sujith Thomas',
    avatar: 'ST',
    role: 'Reviewer',
    category: 'Review',
    type: 'Changes Requested',
    sectionName: 'Commercial Terms',
    sectionNumber: '3.0',
    description: 'Reviewer found issues with the payment milestones and requested updates.',
    actionSummary: 'Sujith Thomas requested changes to Commercial Terms.',
    documentId: 'SOW-2026-003',
    documentName: 'Network Upgrades',
    documentVersion: 'v1.2',
    clientName: 'Initech',
    status: 'Changes Requested',
    assignedReviewer: 'Sujith Thomas',
    reviewStatus: 'Rejected',
    reviewComment: 'Please update the payment milestones to be 50/30/20 instead of 40/40/20.',
    dueDate: '15 Jul 2026',
    createdAt: '10 Jul 2026, 11:00 AM',
    lastUpdatedAt: '12 Jul 2026, 02:15 PM'
  },
  {
    id: 'act-6',
    date: '10 Jul 2026',
    time: '11:00 AM',
    user: 'Dipali Patil',
    avatar: 'DP',
    role: 'PMO',
    category: 'Review',
    type: 'Review Request Sent',
    sectionName: null,
    sectionNumber: null,
    description: 'Initiated the formal review cycle for the document.',
    actionSummary: 'The document was submitted to assigned reviewers.',
    documentId: 'SOW-2026-003',
    documentName: 'Network Upgrades',
    documentVersion: 'v1.2',
    clientName: 'Initech',
    status: 'Pending Review',
    createdAt: '08 Jul 2026, 09:00 AM',
    lastUpdatedAt: '10 Jul 2026, 11:00 AM'
  },
  {
    id: 'act-7',
    date: '10 Jul 2026',
    time: '09:20 AM',
    user: 'Dipali Patil',
    avatar: 'DP',
    role: 'PMO',
    category: 'Editing',
    type: 'Content Updated',
    sectionName: 'Commercial Terms',
    sectionNumber: '3.1',
    description: 'Manually updated the pricing table to reflect the new discount.',
    actionSummary: 'The pricing table was updated manually.',
    documentId: 'SOW-2026-003',
    documentName: 'Network Upgrades',
    documentVersion: 'v1.1',
    clientName: 'Initech',
    status: 'In Review',
    previousValue: 'Pricing Model v1 ($45,000)',
    newValue: 'Pricing Model v2 ($48,500)',
    createdAt: '08 Jul 2026, 09:00 AM',
    lastUpdatedAt: '10 Jul 2026, 09:20 AM'
  },
  {
    id: 'act-8',
    date: '09 Jul 2026',
    time: '11:15 AM',
    user: 'Narendra Patel',
    avatar: 'NP',
    role: 'PMO',
    category: 'Configuration',
    type: 'Reviewer Updated',
    sectionName: 'Technical Architecture',
    sectionNumber: '2.0',
    description: 'Reassigned section to a different technical lead.',
    actionSummary: 'Reviewer for Technical Architecture was updated.',
    documentId: 'SOW-2026-003',
    documentName: 'Network Upgrades',
    documentVersion: 'v1.0',
    clientName: 'Initech',
    status: 'Configuration Saved',
    previousReviewer: 'Anna Marie Pinto',
    newReviewer: 'Sagar Patel',
    createdAt: '08 Jul 2026, 09:00 AM',
    lastUpdatedAt: '09 Jul 2026, 11:15 AM'
  }
];

function FilterDropdown({ label, options, selected, onChange }: { label: string, options: string[], selected: string | null, onChange: (val: string | null) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '6px 28px 6px 14px',
          border: '1px solid var(--app-color-border)',
          borderRadius: '24px',
          fontSize: '13px',
          backgroundColor: 'var(--app-color-surface)',
          color: selected ? 'var(--app-color-primary)' : 'var(--app-color-text)',
          cursor: 'pointer',
          fontWeight: 500,
          outline: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {selected || label}
        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: isOpen || selected ? 'var(--app-color-primary)' : 'var(--app-color-text-muted)', display: 'flex', alignItems: 'center' }}>
          <Icon name="chevron-down" size={14} />
        </div>
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 100,
          backgroundColor: 'var(--app-color-surface)',
          border: '1px solid var(--app-color-border)',
          borderRadius: '12px',
          padding: '8px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', gap: '4px',
          minWidth: '180px',
          maxHeight: '300px',
          overflowY: 'auto'
        }} className="custom-scrollbar">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt === selected ? null : opt); setIsOpen(false); }}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: selected === opt ? 'var(--app-color-primary-soft)' : 'transparent',
                color: selected === opt ? 'var(--app-color-primary)' : 'var(--app-color-text)',
                fontSize: '13px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontWeight: selected === opt ? 600 : 500
              }}
              onMouseEnter={e => { if (selected !== opt) e.currentTarget.style.backgroundColor = 'var(--app-color-surface-muted)'; }}
              onMouseLeave={e => { if (selected !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [exportToastMessage, setExportToastMessage] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleExportLogs = () => {
    setExportToastMessage('Activity logs export started...');
    setTimeout(() => {
      setExportToastMessage('Activity logs exported successfully.');
    }, 1500);
  };

  const renderDocumentStatus = (status: string | null) => {
    if (!status) return null;
    let tone = 'info';
    switch (status) {
      case 'Changes Requested': tone = 'danger'; break;
      case 'In Review': tone = 'info'; break;
      case 'Pending Review': tone = 'warning'; break;
      case 'Approved': tone = 'success'; break;
      case 'Completed': tone = 'success'; break;
      case 'Exported': tone = 'success'; break;
      case 'Configuration Saved': tone = 'success'; break;
    }
    return <Badge tone={tone as any}>{status}</Badge>;
  };

  const filteredData = dummyActivities.filter(activity => {
    if (filters['category'] && activity.category !== filters['category']) return false;
    if (filters['user'] && activity.user !== filters['user']) return false;
    if (filters['date'] && activity.date !== filters['date']) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !activity.documentName.toLowerCase().includes(q) &&
        !activity.documentId.toLowerCase().includes(q) &&
        !activity.user.toLowerCase().includes(q) &&
        !(activity.sectionName && activity.sectionName.toLowerCase().includes(q)) &&
        !activity.description.toLowerCase().includes(q) &&
        !activity.type.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '64px', height: '100%', flex: 1 }}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
        <div style={{ padding: '8px 0', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ position: 'relative', width: '360px', minWidth: '250px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isSearchFocused ? 'var(--app-color-primary)' : 'var(--app-color-text-muted)', pointerEvents: 'none', transition: 'all 0.2s ease' }}>
              <Icon name="search" size={14} />
            </div>
            <input
              type="text"
              placeholder="Search by SOW ID, document, section, user or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                padding: '8px 12px 8px 32px',
                border: '1px solid var(--app-color-border)',
                borderRadius: '24px',
                fontSize: '13px',
                outline: 'none',
                width: '100%',
                backgroundColor: isSearchFocused ? 'var(--app-color-surface)' : 'var(--app-color-surface-muted)',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="filter" size={16} /> Filters:
            </div>

            {[
              { id: 'category', label: 'Activity Type', options: ['Uploads', 'Configuration', 'AI', 'Editing', 'Review', 'Approval', 'Export'] },
              { id: 'user', label: 'User', options: ['Narendra Patel', 'Ashika Sharma', 'Sujith Thomas', 'Dipali Patil', 'AI'] },
              { id: 'date', label: 'Date Range', options: ['Today', 'Yesterday', '13 Jul 2026', '12 Jul 2026', '10 Jul 2026'] }
            ].map(filter => (
              <FilterDropdown
                key={filter.id}
                label={filter.label}
                options={filter.options}
                selected={filters[filter.id] || null}
                onChange={(val) => setFilters(prev => ({ ...prev, [filter.id]: val }))}
              />
            ))}

            <button
              onClick={() => { setFilters({}); setSearchQuery(''); }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: 500,
                textDecoration: 'underline',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Clear All
            </button>
            
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--app-color-border)', margin: '0 4px' }}></div>
            
            <Button variant="accent" onClick={handleExportLogs} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="download" size={16} /> Export Logs
            </Button>
          </div>

        </div>
      </div>

      {/* Table Card */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: 'var(--app-color-surface-muted)' }}>
                {['Date & Time', 'SOW ID', 'Document Name', 'Activity', 'Section', 'Performed By', 'Status', 'Action'].map(col => (
                  <th key={col} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', whiteSpace: 'nowrap', position: 'sticky', top: 0, backgroundColor: 'var(--app-color-surface-muted)', zIndex: 10 }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: '1px solid var(--app-color-border)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--app-color-bg)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{row.date}</div>
                    <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', marginTop: '4px' }}>{row.time}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#3b82f6', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {row.documentId}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#3b82f6', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}>
                    {row.documentName}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 500 }}>
                    {row.type}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text-muted)' }}>
                    {row.sectionName || '—'}
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        backgroundColor: row.isAI ? 'var(--app-color-accent-soft)' : 'var(--app-color-primary-soft)',
                        color: row.isAI ? 'var(--app-color-accent)' : 'var(--app-color-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 600, flexShrink: 0
                      }}>
                        {row.isAI ? <Icon name="sparkles" size={12} /> : row.avatar}
                      </div>
                      <span style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{row.user}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {renderDocumentStatus(row.status)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <IconButton 
                      label="View Activity Details" 
                      onClick={() => setSelectedActivity(row)}
                    >
                      <Icon name="eye" size={16} />
                    </IconButton>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--app-color-text-muted)' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--app-color-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <Icon name="search" size={24} />
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--app-color-text)', marginBottom: '8px' }}>
                        No Activity Found
                      </div>
                      <div style={{ fontSize: '14px', maxWidth: '300px' }}>
                        Activity history will appear here once users start working on documents.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--app-color-border)' }}>
          <div style={{ fontSize: '14px', color: 'var(--app-color-text-muted)' }}>
            Showing {filteredData.length > 0 ? 1 : 0} to {filteredData.length} of {filteredData.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button variant="ghost" style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }} disabled>
              <Icon name="chevron-left" size={14} /> Previous
            </Button>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1].map(page => (
                <button
                  key={page}
                  style={{
                    width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: page === 1 ? '1px solid var(--app-color-primary)' : '1px solid var(--app-color-border)',
                    borderRadius: '4px',
                    backgroundColor: page === 1 ? 'var(--app-color-primary)' : 'var(--app-color-surface)',
                    color: page === 1 ? '#fff' : 'var(--app-color-text)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button variant="ghost" style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }} disabled>
              Next <Icon name="chevron-right" size={14} />
            </Button>
          </div>
        </div>
      </Card>

      <AlertModal
        isOpen={!!exportToastMessage}
        onClose={() => setExportToastMessage('')}
        title={exportToastMessage}
        type={exportToastMessage.includes('Failed') ? 'error' : 'success'}
        autoCloseDuration={3000}
        hideCloseButton={true}
      />

      <Drawer
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title="Activity Details"
      >
        {selectedActivity && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Activity Information */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>Activity Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Activity Type</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 500 }}>{selectedActivity.type}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Status</div>
                  <div>{renderDocumentStatus(selectedActivity.status)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Date</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Time</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.time}</div>
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>Document Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>SOW ID</div>
                  <div style={{ fontSize: '14px', color: '#3b82f6', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}>{selectedActivity.documentId}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Document Name</div>
                  <div style={{ fontSize: '14px', color: '#3b82f6', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}>{selectedActivity.documentName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Document Version</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.documentVersion}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Client Name</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.clientName}</div>
                </div>
              </div>
            </div>

            {/* Section Information */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>Section Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Section Name</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.sectionName || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Section Number</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.sectionNumber || '-'}</div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>User Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Performed By</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      backgroundColor: selectedActivity.isAI ? 'var(--app-color-accent-soft)' : 'var(--app-color-primary-soft)',
                      color: selectedActivity.isAI ? 'var(--app-color-accent)' : 'var(--app-color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 600, flexShrink: 0
                    }}>
                      {selectedActivity.isAI ? <Icon name="sparkles" size={10} /> : selectedActivity.avatar}
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--app-color-text)', fontWeight: 500 }}>{selectedActivity.user}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Role</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.role}</div>
                </div>
                {selectedActivity.assignedReviewer && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Assigned Reviewer</div>
                    <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.assignedReviewer}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Summary */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>Action Summary</div>
              <div style={{ fontSize: '14px', color: 'var(--app-color-text)', lineHeight: '1.5', padding: '12px', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '8px' }}>
                {selectedActivity.actionSummary}
              </div>
            </div>

            {/* Change Details */}
            {(selectedActivity.previousReviewer || selectedActivity.previousValue || selectedActivity.previousState) && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>Change Details</div>
                
                {selectedActivity.previousReviewer && selectedActivity.newReviewer && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Previous Reviewer</div>
                      <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.previousReviewer}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>New Reviewer</div>
                      <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.newReviewer}</div>
                    </div>
                  </div>
                )}

                {selectedActivity.previousState && selectedActivity.currentState && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Previous</div>
                      <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.previousState}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Current</div>
                      <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.currentState}</div>
                    </div>
                  </div>
                )}

                {selectedActivity.previousValue && selectedActivity.newValue && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)' }}>Previous Value</div>
                    <div style={{ padding: '8px 12px', backgroundColor: 'color-mix(in srgb, var(--app-color-danger) 10%, transparent)', borderLeft: '3px solid var(--app-color-danger)', borderRadius: '4px', fontSize: '13px', color: 'var(--app-color-text)', fontFamily: 'monospace' }}>
                      - {selectedActivity.previousValue}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginTop: '4px' }}>New Value</div>
                    <div style={{ padding: '8px 12px', backgroundColor: 'color-mix(in srgb, var(--app-color-success) 10%, transparent)', borderLeft: '3px solid var(--app-color-success)', borderRadius: '4px', fontSize: '13px', color: 'var(--app-color-text)', fontFamily: 'monospace' }}>
                      + {selectedActivity.newValue}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Related Files */}
            {selectedActivity.relatedFiles && selectedActivity.relatedFiles.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>Related Files</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedActivity.relatedFiles.map((file, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' }}>
                      <Icon name="file-text" size={16} style={{ color: 'var(--app-color-text-muted)' }} />
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Information */}
            {(selectedActivity.reviewStatus || selectedActivity.reviewComment || selectedActivity.dueDate) && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>Review Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {selectedActivity.assignedReviewer && (
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Assigned Reviewer</div>
                      <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.assignedReviewer}</div>
                    </div>
                  )}
                  {selectedActivity.reviewStatus && (
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Review Status</div>
                      <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.reviewStatus}</div>
                    </div>
                  )}
                  {selectedActivity.dueDate && (
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Due Date</div>
                      <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.dueDate}</div>
                    </div>
                  )}
                  {selectedActivity.reviewComment && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Review Comment</div>
                      <div style={{ fontSize: '14px', color: 'var(--app-color-text)', padding: '12px', backgroundColor: 'var(--app-color-surface-muted)', borderRadius: '8px', fontStyle: 'italic' }}>
                        "{selectedActivity.reviewComment}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '4px' }}>Timeline</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Created</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.createdAt}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Last Updated</div>
                  <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.lastUpdatedAt}</div>
                </div>
                {selectedActivity.completedAt && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', marginBottom: '4px' }}>Completed</div>
                    <div style={{ fontSize: '14px', color: 'var(--app-color-text)' }}>{selectedActivity.completedAt}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Actions */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', marginTop: 'auto', borderTop: '1px solid var(--app-color-border)', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setSelectedActivity(null)}>Close</Button>
              <Button variant="primary">Open Document</Button>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  );
}
