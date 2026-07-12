import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { Stepper } from '../components/ui/Stepper';

import { MultiSelect } from '../components/ui/MultiSelect';
import { Toast } from '../components/ui/Toast';

export interface Section {
  id: string;
  no: string;
  name: string;
  description: string;
  included: boolean;
  reviewers: string[];
  reviewerStatuses?: Record<string, string>;
}

export const mockSections: Section[] = [
  { id: '1', no: '1.0', name: 'Project Introduction', description: 'Overview of the project, objectives and background information.', included: true, reviewers: ['Anna Marie Pinto'], reviewerStatuses: { 'Anna Marie Pinto': 'Approved' } },
  { id: '2', no: '2.0', name: 'Project Scope', description: 'Defines the in-scope and out-of-scope items for the project.', included: true, reviewers: ['Himanshu Khandelwal'], reviewerStatuses: { 'Himanshu Khandelwal': 'Review Pending' } },
  { id: '3', no: '3.0', name: 'Business Requirements', description: 'Detailed business requirements and expectations.', included: true, reviewers: ['Sagar'], reviewerStatuses: { 'Sagar': 'In Review' } },
  { id: '4', no: '4.0', name: 'Solution Approach', description: 'Proposed solution, methodology and approach.', included: true, reviewers: ['Anna Marie Pinto'], reviewerStatuses: { 'Anna Marie Pinto': 'Changes Requested' } },
  { id: '5', no: '5.0', name: 'Deliverables', description: 'List of deliverables and acceptance criteria.', included: true, reviewers: ['Himanshu Khandelwal'], reviewerStatuses: { 'Himanshu Khandelwal': 'Approved' } },
  { id: '6', no: '6.0', name: 'Roles & Responsibilities', description: 'Roles and responsibilities of both parties.', included: true, reviewers: ['Sagar'], reviewerStatuses: { 'Sagar': 'Review Pending' } },
  { id: '7', no: '7.0', name: 'Project Timeline', description: 'High-level project timeline and milestones.', included: false, reviewers: [], reviewerStatuses: {} },
  { id: '8', no: '8.0', name: 'Commercial Terms', description: 'Pricing, payment terms and commercial conditions.', included: true, reviewers: ['Anna Marie Pinto'], reviewerStatuses: { 'Anna Marie Pinto': 'In Review' } },
  { id: '9', no: '9.0', name: 'Assumptions', description: 'Key assumptions and constraints for the project.', included: false, reviewers: [], reviewerStatuses: {} },
  { id: '10', no: '10.0', name: 'Risks & Mitigation', description: 'Potential risks and mitigation strategies.', included: true, reviewers: ['Sagar'], reviewerStatuses: { 'Sagar': 'Approved' } },
  { id: '11', no: '11.0', name: 'Service Level Agreement', description: 'Service levels and performance metrics.', included: false, reviewers: [], reviewerStatuses: {} },
  { id: '12', no: '12.0', name: 'Appendices', description: 'Supporting documents and additional information.', included: true, reviewers: ['Himanshu Khandelwal'], reviewerStatuses: { 'Himanshu Khandelwal': 'Review Pending' } },
];

interface ValidateSOWProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  globalReviewers: string[];
  setGlobalReviewers: React.Dispatch<React.SetStateAction<string[]>>;
  onProceed: (enabledSectionNames: string[]) => void;
  onCancel: () => void;
}

export function ValidateSOW({ sections, setSections, globalReviewers, setGlobalReviewers, onProceed, onCancel }: ValidateSOWProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [failedReviewers, setFailedReviewers] = useState<string[]>([]);
  const [assignResult, setAssignResult] = useState<'partial' | 'error' | null>(null);

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
        return { ...s, included: nextIncluded, reviewers: nextIncluded ? s.reviewers : [], reviewerStatuses: nextIncluded ? s.reviewerStatuses : {} };
      }
      return s;
    }));
  };

  const changeReviewers = (id: string, newReviewers: string[]) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) {
        const updatedStatuses = { ...s.reviewerStatuses };
        newReviewers.forEach(r => {
          if (!updatedStatuses[r]) {
            updatedStatuses[r] = 'Not Submitted';
          }
        });
        Object.keys(updatedStatuses).forEach(r => {
          if (!newReviewers.includes(r)) {
            delete updatedStatuses[r];
          }
        });
        return { ...s, reviewers: newReviewers, reviewerStatuses: updatedStatuses };
      }
      return s;
    }));
  };

  const handleProceed = () => {
    const invalidSections = sections.filter(s => s.included && s.reviewers.length === 0);
    if (invalidSections.length > 0) {
      setValidationError('At least one reviewer must be assigned for every enabled section.');
      setTimeout(() => setValidationError(''), 4000);
      return;
    }
    setValidationError('');

    const enabledSections = sections.filter(s => s.included);
    const assignments: Record<string, string[]> = {};
    
    enabledSections.forEach(section => {
      section.reviewers.forEach(reviewer => {
        if (!assignments[reviewer]) {
          assignments[reviewer] = [];
        }
        assignments[reviewer].push(section.name);
      });
    });

    setIsAssigning(true);

    setTimeout(() => {
      // Simulate sending emails
      Object.entries(assignments).forEach(([reviewer, sectionNames]) => {
        console.log(`
Subject: Review Assignment – Acme Corp Web Redesign

Hello ${reviewer},

You have been assigned as a reviewer for the following section(s) in "Acme Corp Web Redesign":
${sectionNames.map(name => `- ${name}`).join('\n')}

The document is currently being prepared. You will be able to access it from the Reviews section once it is available.

Assigned by: PMO Admin
        `);
      });
      // We keep isAssigning true to prevent user interaction while the toast is visible.
      // The navigation will be triggered when the toast closes (either automatically or manually).
      setShowToast(true);

    }, 2500);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <style>{`
        @keyframes simpleFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <Stepper 
        steps={[
          { id: 'analyze', label: 'Analyze' },
          { id: 'configure', label: 'Configure' },
          { id: 'generate', label: 'Generate' }
        ]} 
        currentStepId="configure" 
      />

      <Card title={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>Configure Sections</div>
          <div style={{ color: 'var(--app-color-text-muted)', fontSize: '13px', fontWeight: 400 }}>
            Review the sections and select the ones to include in the generated document.
          </div>
        </div>
      }>
        <div style={{ padding: '0px 0px 20px' }}>
          <div style={{
            backgroundColor: 'var(--app-color-surface-muted)',
            border: '1px solid var(--app-color-border)',
            borderRadius: '6px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '4px'
          }}>
            <div style={{ color: 'var(--app-color-text-muted)', display: 'flex', alignItems: 'center' }}>
              <Icon name="info" size={16} />
            </div>
            <div style={{ color: 'var(--app-color-text)', fontSize: '13px', lineHeight: '1.4' }}>
              Default reviewers are preassigned from the selected template. Additional reviewers can be added later from the Configure Sections tab in the SOW Draft.
            </div>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ margin: '-24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--app-color-border)', backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', width: '120px' }}>Section No.</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', width: '200px' }}>Section Name</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', width: '280px' }}>Description</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', textAlign: 'center', width: '130px' }}>Include in SOW</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--app-color-text)', width: '380px' }}>Reviewer</th>
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
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--app-color-text-muted)', maxWidth: '240px', lineHeight: 1.5 }}>{section.description}</td>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <MultiSelect 
                        options={globalReviewers}
                        value={section.reviewers}
                        onChange={(val) => changeReviewers(section.id, val)}
                        disabled={!section.included}
                        placeholder="Select Reviewers..."
                      />
                      {section.included && section.reviewers.length === 0 && (
                        <div style={{ color: 'var(--app-color-danger)', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Icon name="alert-circle" size={12} /> Reviewer required
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
          </div>
        </div>
      </Card>

      <div className="sticky-bottom-bar" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            <Icon name="arrow-left" size={16} /> Back
          </Button>
          {validationError && (
            <div className="error-text" style={{ margin: 0 }}>
              <Icon name="alert-circle" size={16} />
              {validationError}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading || isAssigning}>
            <Icon name="x" size={16} /> Cancel
          </Button>
          <Button variant="accent" onClick={handleProceed} disabled={isLoading || isAssigning}>
            {isAssigning ? 'Continuing...' : 'Continue'}
          </Button>
        </div>
      </div>

      {(isLoading || isAssigning) && !showToast && (
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
              {isAssigning ? 'Assigning Reviewers' : 'Analyzing Document'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--app-color-text-muted)' }}>
              {isAssigning ? 'Assigning reviewers and sending notifications...' : 'Extracting SOW sections from the uploaded RFP...'}
            </p>
          </div>
        </div>
      )}

      <Toast
        isOpen={showToast}
        onClose={() => {
          setShowToast(false);
          setIsAssigning(false);
          onProceed(sections.filter(s => s.included).map(s => s.name));
        }}
        title="Reviewers assigned successfully"
        description="Your section configuration has been saved and the selected reviewers have been notified."
        type="success"
        duration={6000}
      />

      {assignResult === 'partial' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'var(--app-color-surface)',
            width: '420px',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex', flexDirection: 'column', gap: '24px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--app-color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="alert-circle" size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--app-color-text)' }}>Partial Notification Failure</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--app-color-text-muted)' }}>
                Reviewers were assigned, but some notifications could not be sent to:
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {failedReviewers.map(r => (
                  <li key={r} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--app-color-danger)' }}>• {r}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setAssignResult(null)}>
                Retry Notifications
              </Button>
              <Button variant="accent" onClick={() => {
                setAssignResult(null);
                onProceed(sections.filter(s => s.included).map(s => s.name));
              }}>
                Continue Anyway
              </Button>
            </div>
          </div>
        </div>
      )}

      {assignResult === 'error' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 33, 44, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'var(--app-color-surface)',
            width: '400px',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex', flexDirection: 'column', gap: '24px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            alignItems: 'center', textAlign: 'center'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--app-color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="alert-circle" size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: 'var(--app-color-text)' }}>Notification Failed</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--app-color-text-muted)', lineHeight: '1.5' }}>
                We couldn’t assign and notify the reviewers. Please try again.
              </p>
            </div>
            <Button variant="accent" onClick={() => setAssignResult(null)} style={{ padding: '8px 32px' }}>
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
