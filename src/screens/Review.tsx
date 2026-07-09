import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Card } from '../components/ui/Card';
import { AlertModal } from '../components/ui/AlertModal';

interface ReviewProps {
  onTransitionToDraft?: () => void;
}

const dummyData = Array(10).fill(null).map((_, i) => ({
  id: `SOW-2026-00${i + 1}`,
  name: i % 2 === 0 ? 'Cloud Migration Initiative' : 'Data Center Modernization',
  client: i % 2 === 0 ? 'Acme Corp' : 'Globex Inc',
  createdBy: 'Ashika Sharma',
  creationDate: 'Jul 08, 2026',
  version: 'v1.0',
  status: 'In Progress'
}));

function FilterDropdown({ label, options }: { label: string, options: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
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
              onClick={() => { setSelected(opt === selected ? null : opt); setIsOpen(false); }}
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

export function Review({ onTransitionToDraft }: ReviewProps) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isV1SearchFocused, setIsV1SearchFocused] = useState(false);
  const [exportToastMessage, setExportToastMessage] = useState('');

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

  const tabs = [
    { label: 'All', count: 87 },
    { label: 'In Progress', count: 20 },
    { label: 'Pending Review', count: 18 },
    { label: 'In Review', count: 6 },
    { label: 'Changes Requested', count: 9 },
    { label: 'Approved', count: 52 }
  ];

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
          <Button variant="accent" onClick={handleExportExcel} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="download" size={16} /> Export to Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
        <div style={{ padding: '8px 0', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>
          
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="filter" size={16} /> Filter By:
          </div>

          {[
            { id: 'v2-status', label: 'Status', options: ['In Progress', 'Pending Review', 'In Review', 'Changes Requested', 'Approved'] },
            { id: 'v2-client', label: 'Client', options: ['Acme Corp', 'Globex Inc', 'Initech', 'Stark Industries'] },
            { id: 'v2-created', label: 'Created By', options: ['Ashika Sharma', 'Sujith Thomas', 'Narendra Patel', 'Gopika Nair', 'Dipali Patil'] }
          ].map(filter => (
            <FilterDropdown key={filter.id} label={filter.label} options={filter.options} />
          ))}

          <button style={{
            background: 'transparent',
            border: 'none',
            fontSize: '13px',
            color: 'var(--app-color-primary)',
            cursor: 'pointer',
            fontWeight: 600,
            textDecoration: 'underline'
          }}>
            Clear All
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
                {['SOW ID', 'SOW Name', 'Client', 'Created By', 'Creation Date', 'Status', 'Action'].map(col => (
                  <th key={col} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text-muted)', whiteSpace: 'nowrap', position: 'sticky', top: 0, backgroundColor: 'var(--app-color-surface-muted)', zIndex: 10 }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dummyData.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--app-color-border)', transition: 'background-color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--app-color-bg)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-primary)', fontWeight: 600 }}>{row.id}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{row.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{row.client}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text)' }}>{row.createdBy}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--app-color-text-muted)' }}>{row.creationDate}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <Badge tone="info">
                      In Progress
                    </Badge>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => onTransitionToDraft?.()}
                      style={{ 
                        background: 'transparent', border: 'none', color: 'var(--app-color-accent)', 
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
                        display: 'flex', alignItems: 'center', gap: '4px', padding: 0
                      }}
                    >
                      Review <Icon name="arrow-right" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--app-color-border)' }}>
          <div style={{ fontSize: '14px', color: 'var(--app-color-text-muted)' }}>
            Showing 1 to 5 of 87 entries
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
