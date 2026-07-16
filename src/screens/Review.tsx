import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Card } from '../components/ui/Card';
import { AlertModal } from '../components/ui/AlertModal';

interface ReviewProps {
  userRole?: string | null;
  onTransitionToDraft?: (docId: string, status: string) => void;
}

const dummyData = [
  { id: 'SOW-2026-001', name: 'Cloud Migration Initiative', client: 'Acme Corp', createdBy: 'Ashika Sharma', creationDate: 'Jul 08, 2026', lastActivity: '5 min ago', version: 'v1.0', status: 'In Review', reviewCounts: { withReviewers: 3, awaitingPMO: 2, rework: 1 } },
  { id: 'SOW-2026-002', name: 'Data Center Modernization', client: 'Globex Inc', createdBy: 'Ashika Sharma', creationDate: 'Jul 08, 2026', lastActivity: '30 min ago', version: 'v1.0', status: 'Draft' },
  { id: 'SOW-2026-003', name: 'Cloud Migration Strategy', client: 'Stark Industries', createdBy: 'Sujith Thomas', creationDate: 'Jul 05, 2026', lastActivity: 'Today, 10:45 AM', version: 'v2.1', status: 'Approved' },
  { id: 'SOW-2026-004', name: 'Network Security Upgrade', client: 'Wayne Enterprises', createdBy: 'Narendra Patel', creationDate: 'Jun 28, 2026', lastActivity: 'Yesterday, 4:20 PM', version: 'v1.2', status: 'Draft' },
  { id: 'SOW-2026-005', name: 'ERP Implementation', client: 'Oscorp', createdBy: 'Gopika Nair', creationDate: 'Jun 15, 2026', lastActivity: 'Jul 08, 2026', version: 'v3.0', status: 'Approved' },
  { id: 'SOW-2026-006', name: 'Data Center Modernization', client: 'Globex Inc', createdBy: 'Ashika Sharma', creationDate: 'Jul 08, 2026', lastActivity: '5 min ago', version: 'v1.0', status: 'Draft' },
  { id: 'SOW-2026-007', name: 'Cloud Migration Strategy', client: 'Stark Industries', createdBy: 'Sujith Thomas', creationDate: 'Jul 05, 2026', lastActivity: '30 min ago', version: 'v2.1', status: 'In Review', reviewCounts: { withReviewers: 2, awaitingPMO: 0, rework: 0 } },
  { id: 'SOW-2026-008', name: 'Network Security Upgrade', client: 'Wayne Enterprises', createdBy: 'Narendra Patel', creationDate: 'Jun 28, 2026', lastActivity: 'Today, 10:45 AM', version: 'v1.2', status: 'Draft' },
  { id: 'SOW-2026-009', name: 'ERP Implementation', client: 'Oscorp', createdBy: 'Gopika Nair', creationDate: 'Jun 15, 2026', lastActivity: 'Yesterday, 4:20 PM', version: 'v3.0', status: 'Approved' },
  { id: 'SOW-2026-0010', name: 'Data Center Modernization', client: 'Globex Inc', createdBy: 'Ashika Sharma', creationDate: 'Jul 08, 2026', lastActivity: 'Jul 08, 2026', version: 'v1.0', status: 'In Review', reviewCounts: { withReviewers: 0, awaitingPMO: 1, rework: 2 } }
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
          minWidth: '180px'
        }}>
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

export function Review({ userRole = 'PMO', onTransitionToDraft }: ReviewProps) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isV1SearchFocused, setIsV1SearchFocused] = useState(false);
  const [exportToastMessage, setExportToastMessage] = useState('');
  const [filters, setFilters] = useState<Record<string, string | null>>({});

  const displayData = dummyData.filter(d => d.status === 'In Review' || d.status === 'Approved');

  const handleExportExcel = () => {
    setExportToastMessage('Excel export started...');

    try {
      const headers = ['SOW ID', 'SOW Name', 'Client', 'Created By', 'Creation Date', 'Status'];
      const csvContent = [
        headers.join(','),
        ...dummyData.map(row =>
          [row.id, `"${row.name}"`, `"${row.client}"`, `"${row.createdBy}"`, `"${row.creationDate}"`, row.status].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Reviews_Export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setExportToastMessage('Excel export completed successfully.');
    } catch (error) {
      setExportToastMessage('Failed to export Excel document.');
    }
  };

  const getCount = (status: string) => displayData.filter(d => d.status === status).length;

  const tabs = [
    { label: 'All', count: displayData.length },
    { label: 'In Review', count: getCount('In Review') },
    { label: 'Approved', count: getCount('Approved') }
  ];

  const filteredData = displayData.filter(row => {
    if (activeTab !== 'All' && row.status !== activeTab) return false;
    if (filters['v2-status'] && row.status !== filters['v2-status']) return false;
    if (filters['v2-client'] && row.client !== filters['v2-client']) return false;
    if (filters['v2-created'] && row.createdBy !== filters['v2-created']) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!row.name.toLowerCase().includes(q) && !row.client.toLowerCase().includes(q) && !row.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

function StatusBadgeCell({ status, reviewCounts }: { status: string, reviewCounts?: any }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  let tone = 'neutral';
  switch (status) {
    case 'Draft': tone = 'neutral'; break;
    case 'In Review': tone = 'warning'; break;
    case 'Approved': tone = 'success'; break;
  }

  const updateTooltipPosition = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2
      });
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice && status === 'In Review') {
      updateTooltipPosition();
      setShowTooltip(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isTouchDevice && status === 'In Review') setShowTooltip(false);
  };

  const handleFocus = () => {
    if (status === 'In Review') {
      updateTooltipPosition();
      setShowTooltip(true);
    }
  };

  const handleBlur = () => {
    if (status === 'In Review') setShowTooltip(false);
  };

  return (
    <div 
      ref={badgeRef}
      style={{ display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={status === 'In Review' ? 0 : undefined}
    >
      <Badge tone={tone as any}>
        {status}
      </Badge>

      {showTooltip && createPortal(
        <div style={{
          position: 'fixed',
          top: tooltipPos.top,
          left: tooltipPos.left,
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--app-color-surface)',
          border: '1px solid var(--app-color-border)',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 9999,
          width: 'max-content',
          minWidth: '220px',
          maxWidth: '260px',
          color: 'var(--app-color-text)',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', borderBottom: '1px solid var(--app-color-border)', paddingBottom: '8px' }}>
            In Review
          </div>
          {reviewCounts ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <span style={{ color: 'var(--app-color-text-muted)' }}>👥 With Reviewers :</span>
                <span style={{ fontWeight: 600 }}>{reviewCounts.withReviewers || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <span style={{ color: 'var(--app-color-text-muted)' }}>📥 Awaiting PMO :</span>
                <span style={{ fontWeight: 600 }}>{reviewCounts.awaitingPMO || 0}</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--app-color-text-muted)' }}>
              No review details available.
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '64px', height: '100%', flex: 1 }}>

      {/* Header & Tabs */}
      <div className="screen-header" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--app-color-border)' }}>
        <div className="tabs-container" style={{ margin: 0, borderBottom: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab.label}
              className={`tab-item ${activeTab === tab.label ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.label ? 'var(--app-color-primary-soft)' : 'var(--app-color-surface-muted)',
                color: activeTab === tab.label ? 'var(--app-color-primary)' : 'var(--app-color-text-muted)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                marginLeft: '8px'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
          {userRole !== 'Reviewer' && (
            <Button variant="accent" onClick={handleExportExcel} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="download" size={16} /> Export to Excel
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
        <div style={{ padding: '8px 0', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>

          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="filter" size={16} /> Filter By:
          </div>

          {[
            { id: 'v2-status', label: 'Status', options: ['In Review', 'Approved'] },
            { id: 'v2-client', label: 'Client', options: ['Acme Corp', 'Globex Inc', 'Initech', 'Stark Industries'] },
            { id: 'v2-created', label: 'Created By', options: ['Ashika Sharma', 'Sujith Thomas', 'Narendra Patel', 'Gopika Nair', 'Dipali Patil'] }
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
            <Icon name="x" size={14} /> Clear All
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--app-color-border)', margin: '0 4px' }}></div>

          <div style={{ position: 'relative', width: '220px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isSearchFocused ? 'var(--app-color-primary)' : 'var(--app-color-text-muted)', pointerEvents: 'none', transition: 'all 0.2s ease' }}>
              <Icon name="search" size={14} />
            </div>
            <input
              type="text"
              placeholder="Search SOW / Client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                padding: '6px 12px 6px 32px',
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
        </div>
      </div>

      {/* Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: 'var(--app-color-surface-muted)' }}>
                {['SOW ID', 'SOW Name', 'Client', 'Created By', 'Creation Date', 'Last Activity', 'Status', 'Action'].map(col => (
                  <th key={col} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', whiteSpace: 'nowrap', position: 'sticky', top: 0, backgroundColor: 'var(--app-color-surface-muted)', zIndex: 10, textAlign: col === 'Action' ? 'center' : 'left' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: '1px solid var(--app-color-border)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--app-color-bg)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td 
                    onClick={() => onTransitionToDraft?.(row.id, row.status)}
                    style={{ padding: '16px', fontSize: '14px', color: '#3b82f6', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {row.id}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{row.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{row.client}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{row.createdBy}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text-muted)' }}>{row.creationDate}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text-muted)' }}>{row.lastActivity || '—'}</td>
                  <td style={{ padding: '16px', fontSize: '14px', verticalAlign: 'middle', overflow: 'visible' }}>
                    <StatusBadgeCell status={row.status} reviewCounts={row.reviewCounts} />
                  </td>
                  <td style={{ padding: '16px', verticalAlign: 'middle', textAlign: 'center', width: '80px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {row.status === 'Draft' && (
                        <Button variant="ghost" onClick={() => onTransitionToDraft?.(row.id, row.status)} style={{ padding: '8px', color: 'var(--app-color-primary)', borderRadius: '50%' }} title="Continue Draft">
                          <Icon name="edit" size={18} />
                        </Button>
                      )}
                      {row.status === 'In Review' && (
                        <Button variant="ghost" onClick={() => onTransitionToDraft?.(row.id, row.status)} style={{ padding: '8px', color: 'var(--app-color-warning)', borderRadius: '50%' }} title="Review Document">
                          <Icon name="file-text" size={18} />
                        </Button>
                      )}
                      {row.status === 'Approved' && (
                        <Button variant="ghost" onClick={() => onTransitionToDraft?.(row.id, row.status)} style={{ padding: '8px', color: 'var(--app-color-text-muted)', borderRadius: '50%' }} title="View Document">
                          <Icon name="eye" size={18} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--app-color-text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'var(--app-color-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="file-text" size={24} />
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--app-color-text)' }}>
                        {activeTab === 'Draft' ? 'No draft documents available.' :
                         activeTab === 'In Review' ? 'No documents are currently under review.' :
                         activeTab === 'Approved' ? 'No approved documents found.' :
                         'No reviews found matching the selected filters.'}
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
              {[1, 2, 3, 4, 5].map(page => (
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
            <Button variant="ghost" style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Next <Icon name="chevron-right" size={14} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Export Toast Modal */}
      <AlertModal
        isOpen={!!exportToastMessage}
        onClose={() => setExportToastMessage('')}
        title={exportToastMessage}
        type={exportToastMessage.includes('Failed') ? 'error' : 'success'}
        autoCloseDuration={3000}
        hideCloseButton={true}
      />
    </div>
  );
}
