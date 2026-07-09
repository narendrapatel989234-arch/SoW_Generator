import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';

interface Section {
  id: string;
  no: string;
  name: string;
  description: string;
  included: boolean;
  approver: string;
}

const mockSections: Section[] = [
  { id: '1', no: '1.0', name: 'Project Introduction', description: 'Overview of the project, objectives and background information.', included: true, approver: 'Anna Marie Pinto' },
  { id: '2', no: '2.0', name: 'Project Scope', description: 'Defines the in-scope and out-of-scope items for the project.', included: true, approver: 'Himanshu Khandelwal' },
  { id: '3', no: '3.0', name: 'Business Requirements', description: 'Detailed business requirements and expectations.', included: true, approver: 'Sagar' },
  { id: '4', no: '4.0', name: 'Solution Approach', description: 'Proposed solution, methodology and approach.', included: true, approver: 'Anna Marie Pinto' },
  { id: '5', no: '5.0', name: 'Deliverables', description: 'List of deliverables and acceptance criteria.', included: true, approver: 'Himanshu Khandelwal' },
  { id: '6', no: '6.0', name: 'Roles & Responsibilities', description: 'Roles and responsibilities of both parties.', included: true, approver: 'Sagar' },
  { id: '7', no: '7.0', name: 'Project Timeline', description: 'High-level project timeline and milestones.', included: false, approver: '' },
  { id: '8', no: '8.0', name: 'Commercial Terms', description: 'Pricing, payment terms and commercial conditions.', included: true, approver: 'Anna Marie Pinto' },
  { id: '9', no: '9.0', name: 'Assumptions', description: 'Key assumptions and constraints for the project.', included: false, approver: '' },
  { id: '10', no: '10.0', name: 'Risks & Mitigation', description: 'Potential risks and mitigation strategies.', included: true, approver: 'Sagar' },
  { id: '11', no: '11.0', name: 'Service Level Agreement', description: 'Service levels and performance metrics.', included: false, approver: '' },
  { id: '12', no: '12.0', name: 'Appendices', description: 'Supporting documents and additional information.', included: true, approver: 'Himanshu Khandelwal' },
];

const approvers = ['Anna Marie Pinto', 'Himanshu Khandelwal', 'Sagar'];

interface ValidateSOWProps {
  onProceed: (enabledSectionNames: string[]) => void;
  onCancel: () => void;
}

export function ValidateSOW({ onProceed, onCancel }: ValidateSOWProps) {
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching sections from document
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) {
        const nextIncluded = !s.included;
        return { ...s, included: nextIncluded, approver: nextIncluded ? s.approver : '' };
      }
      return s;
    }));
  };

  const changeApprover = (id: string, approver: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, approver } : s));
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <style>{`
        @keyframes simpleFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--app-color-text)', marginBottom: '8px', marginTop: 0 }}>Review & Validate SOW Sections</h1>
        <p style={{ color: 'var(--app-color-text-muted)', fontSize: '14px', margin: 0 }}>Review and select the sections to include in the SOW. Assign approvers for each section.</p>
      </div>

      <Card style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)' }}>Section No.</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)' }}>Section Name</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)' }}>Description</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', textAlign: 'center' }}>Include in SOW</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)' }}>Approver</th>
            </tr>
          </thead>
          <tbody style={{ animation: 'simpleFade 0.3s ease-in' }}>
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <tr key={i} style={{ borderBottom: i === 7 ? 'none' : '1px solid var(--app-color-border)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ height: '16px', width: '30px', backgroundColor: '#f3f4f6', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ height: '16px', width: '150px', backgroundColor: '#f3f4f6', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ height: '16px', width: '250px', backgroundColor: '#f3f4f6', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                  </td>
                  <td style={{ padding: '16px 24px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ height: '24px', width: '44px', backgroundColor: '#f3f4f6', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ height: '34px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '6px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                  </td>
                </tr>
              ))
            ) : (
              sections.map((section, idx) => (
                <tr key={section.id} style={{ 
                  borderBottom: idx === sections.length - 1 ? 'none' : '1px solid var(--app-color-border)', 
                  backgroundColor: 'white'
                }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: section.included ? 'var(--app-color-text)' : 'var(--app-color-text-muted)', fontWeight: 500 }}>{section.no}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 500, color: section.included ? 'var(--app-color-text)' : 'var(--app-color-text-muted)' }}>{section.name}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--app-color-text-muted)', maxWidth: '280px', lineHeight: 1.5 }}>{section.description}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div 
                      onClick={() => toggleSection(section.id)}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        width: '44px', height: '24px', 
                        borderRadius: '12px', 
                        backgroundColor: section.included ? 'var(--app-color-accent)' : '#e5e7eb',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{
                        width: '20px', height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: section.included ? '22px' : '2px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }} />
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <select 
                      value={section.approver} 
                      onChange={(e) => changeApprover(section.id, e.target.value)}
                      disabled={!section.included}
                      style={{ 
                        width: '100%', 
                        padding: '8px 32px 8px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--app-color-border)', 
                        backgroundColor: section.included ? 'white' : '#f9fafb',
                        color: section.approver ? 'var(--app-color-text)' : 'var(--app-color-text-muted)',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: section.included ? 'pointer' : 'not-allowed',
                        opacity: section.included ? 1 : 0.6,
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '14px'
                      }}
                    >
                      <option value="" disabled>Select Approver</option>
                      {approvers.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <div className="sticky-bottom-bar" style={{ justifyContent: 'flex-end', gap: '12px', marginTop: 'auto' }}>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          <Icon name="x" size={16} /> Cancel
        </Button>
        <Button variant="accent" onClick={() => onProceed(sections.filter(s => s.included).map(s => s.name))} disabled={isLoading}>
          Proceed to SOW Draft <Icon name="arrow-right" size={16} />
        </Button>
      </div>

      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px 32px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <Icon name="loader" size={32} className="icon-spin" style={{ color: 'var(--app-color-accent)' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--app-color-text)' }}>
              Analyzing Document
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--app-color-text-muted)' }}>
              Extracting SOW sections from the uploaded RFP...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
