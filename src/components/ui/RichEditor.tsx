import React, { useRef, useEffect, useState } from 'react';
import { Icon, type IconName } from './Icon';

interface RichEditorProps {
  tocItems: string[];
  activeSectionIndex: number;
  isGenerating?: boolean;
  readOnly?: boolean;
  children?: React.ReactNode;
  onSectionChange?: (index: number) => void;
}

export function RichEditor({ tocItems, activeSectionIndex, isGenerating, readOnly, children, onSectionChange }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  const [contentHtml, setContentHtml] = useState<string>(() => {
    return tocItems.map((item, idx) => {
      let html = `<div id="sow-section-${idx}" class="sow-section"><h2 style="color: var(--app-color-primary); margin-bottom: 16px;">${item}</h2>`;
      switch (item) {
        case 'Executive Summary':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">This Scope of Work defines the proposed approach, scope, responsibilities, deliverables, and implementation roadmap for the digital transformation initiative described in the submitted RFP. The engagement is designed to modernize the client’s existing technology environment, improve operational efficiency, reduce technical debt, and create a scalable foundation for future business growth.</p>
          <p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The proposed solution focuses on migrating legacy capabilities into a more resilient, cloud-ready, and modular architecture. It includes discovery, solution design, implementation planning, system integration, validation, deployment support, and post-go-live stabilization. The delivery approach will be structured in phases to ensure transparency, measurable progress, and clear alignment between business goals, technical outcomes, and stakeholder expectations.</p>
          <p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">Throughout the engagement, the delivery team will collaborate closely with the client’s business, technology, security, and operations stakeholders. This collaboration will help validate requirements, confirm assumptions, identify risks early, and ensure that the final solution is practical, secure, maintainable, and aligned with enterprise standards.</p>
          <p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The expected outcome of this engagement is a well-defined and executable Scope of Work that provides clarity on scope, timelines, deliverables, dependencies, acceptance criteria, and governance. The generated draft should serve as a strong starting point for review, negotiation, and final approval between both parties.</p>`;
          break;
        case 'Objectives':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The primary objectives of this engagement are carefully structured to address the core business challenges identified during the discovery phase. By executing on these objectives, we aim to deliver measurable improvements in performance, scalability, and cost efficiency.</p>
          <p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">Key technical and business objectives include:</p>
          <ul style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li><strong>Cost Optimization:</strong> Reduce operational expenditure by approximately 30% through dynamic cloud scaling, resource right-sizing, and decommissioning of legacy on-premises hardware.</li>
            <li><strong>High Availability & Resilience:</strong> Improve overall system reliability to achieve a 99.99% uptime SLA by implementing cross-region active-active failover mechanisms and automated disaster recovery protocols.</li>
            <li><strong>Application Modernization:</strong> Transition the current monolithic application structure into a robust, decoupled microservices architecture utilizing Docker containers orchestrated via Kubernetes.</li>
            <li><strong>Operational Agility:</strong> Establish zero-touch CI/CD pipelines to enable continuous integration, automated testing, and seamless zero-downtime deployments.</li>
            <li><strong>Security Posture:</strong> Achieve SOC2 and ISO 27001 compliance for the new infrastructure layer by integrating automated vulnerability scanning and strict identity access management (IAM) policies.</li>
          </ul>`;
          break;
        case 'Project Scope':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The scope of work is explicitly bounded to the backend infrastructure migration, API Gateway deployment, and database modernization. Clear demarcation of boundaries ensures that the project delivery remains strictly on schedule and within the agreed budget constraints.</p>
          <p style="margin-bottom: 8px; line-height: 1.6; color: var(--app-color-text);"><strong>In-Scope Activities:</strong></p>
          <ul style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li>Migration of 5 core relational databases (MySQL/PostgreSQL) to a fully managed cloud SQL environment featuring automated daily snapshots and point-in-time recovery.</li>
            <li>Design and implementation of an enterprise-grade API Gateway featuring advanced rate limiting, robust JWT-based authentication, and granular analytics tracking.</li>
            <li>Containerization of 12 legacy backend services into optimized, scalable Docker images.</li>
            <li>Deployment of a comprehensive observability stack (monitoring, logging, and alerting) using industry-standard tools like Prometheus, Grafana, and ELK.</li>
            <li>Structured knowledge transfer sessions and comprehensive documentation handover to the client's internal operations team.</li>
          </ul>
          <p style="margin-bottom: 8px; line-height: 1.6; color: var(--app-color-text);"><strong>Out of Scope:</strong></p>
          <ul style="margin-bottom: 12px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li>Frontend application redesign, web portal enhancements, or any UI/UX modifications.</li>
            <li>Native mobile application development or updates for iOS and Android platforms.</li>
            <li>Integration with third-party legacy ERP/CRM systems that were not explicitly listed in the initial RFP documentation.</li>
            <li>Data cleansing or manual data remediation prior to database migration.</li>
          </ul>`;
          break;
        case 'Solution Architecture':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The proposed solution architecture is designed around a highly decoupled, event-driven microservices pattern hosted on a managed Kubernetes environment. This design prioritizes fault tolerance, horizontal scalability, and strict security compliance.</p>
          <p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The architectural framework consists of several critical layers working in tandem:</p>
          <ul style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li><strong>Edge & Ingress Layer:</strong> A highly available Cloud Load Balancer integrated with a Web Application Firewall (WAF) to defend against DDoS attacks and OWASP Top 10 vulnerabilities. Traffic is then routed through an API Gateway for request validation and throttling.</li>
            <li><strong>Compute Layer:</strong> Auto-scaling Kubernetes clusters spanning multiple availability zones. Workloads will be distributed dynamically based on CPU/Memory utilization metrics, ensuring optimal performance during peak traffic spikes.</li>
            <li><strong>Data & Caching Layer:</strong> A primary managed PostgreSQL database cluster with read-replicas configured across zones for high availability. A distributed Redis caching layer will be deployed to reduce database load and accelerate read-heavy operations.</li>
            <li><strong>Event Streaming:</strong> Apache Kafka will be utilized as the central nervous system for asynchronous communication between microservices, ensuring reliable event delivery and data consistency.</li>
          </ul>`;
          break;
        case 'Technical Requirements':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">To successfully implement the proposed architecture, specific technical prerequisites and environment configurations must be established. Both parties will collaborate to ensure these requirements are met prior to the commencement of the execution phase.</p>
          <ul style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li><strong>Cloud Infrastructure:</strong> An active enterprise account with the selected cloud provider (AWS/GCP/Azure) with sufficient quota limits and billing configured.</li>
            <li><strong>Network Configuration:</strong> A dedicated Virtual Private Cloud (VPC) with appropriately configured public and private subnets, NAT gateways, and strict Security Group rules.</li>
            <li><strong>Identity & Access:</strong> Implementation of Role-Based Access Control (RBAC) via Azure AD or Okta integration for seamless Single Sign-On (SSO) across all infrastructure components.</li>
            <li><strong>Development Tooling:</strong> Access to a Git-based version control system (e.g., GitHub Enterprise or GitLab) and a CI/CD orchestration tool (e.g., Jenkins or GitHub Actions).</li>
          </ul>`;
          break;
        case 'Deliverables':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The engagement will yield a series of concrete, verifiable deliverables across the project lifecycle. Acceptance of these deliverables will trigger subsequent project phases and associated commercial milestones.</p>
          <ol style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li><strong>Architecture Design Document (ADD) [Week 2]:</strong> A comprehensive blueprint detailing network topology, component interactions, security protocols, and data flow diagrams.</li>
            <li><strong>Infrastructure as Code (IaC) Scripts [Week 4]:</strong> Fully parameterized Terraform and Ansible scripts for automated provisioning of the foundational cloud environments (Dev, QA, Prod).</li>
            <li><strong>Containerized Services [Week 8]:</strong> Delivery of the 12 migrated backend services, packaged as Docker containers, deployed and functioning in the QA environment.</li>
            <li><strong>Performance & Security Testing Report [Week 10]:</strong> Detailed documentation of load testing results, penetration testing findings, and remediation steps taken.</li>
            <li><strong>Final Handover Package [Week 12]:</strong> Complete runbooks, operational manuals, disaster recovery procedures, and a formal sign-off document.</li>
          </ol>`;
          break;
        case 'Timeline':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The project is estimated to be completed over a period of 12 weeks, divided into four distinct sprints. This timeline is contingent upon timely approvals and resource availability from the client.</p>
          <ul style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li><strong>Phase 1: Discovery & Design (Weeks 1-2):</strong> Requirements gathering, architecture finalization, and approval of the ADD.</li>
            <li><strong>Phase 2: Infrastructure Provisioning (Weeks 3-4):</strong> Execution of IaC scripts, network setup, and CI/CD pipeline configuration.</li>
            <li><strong>Phase 3: Migration & Development (Weeks 5-8):</strong> Containerization of legacy services, database migration, and API Gateway deployment.</li>
            <li><strong>Phase 4: Testing & Deployment (Weeks 9-12):</strong> UAT, performance tuning, security audits, production deployment, and project handover.</li>
          </ul>`;
          break;
        case 'Commercial Proposal':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The total estimated cost for this project is based on a Time & Materials (T&M) model with a capped maximum budget of <strong>$145,000 USD</strong>. This covers all engineering, project management, and specialized architectural consulting hours required over the 12-week period.</p>
          <p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">Payment milestones are strategically aligned with the delivery of key project artifacts to ensure mutual accountability:</p>
          <ul style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li><strong>Milestone 1 (20% - $29,000):</strong> Invoiced upon project kickoff and formal signing of this Scope of Work.</li>
            <li><strong>Milestone 2 (30% - $43,500):</strong> Invoiced upon delivery and formal client approval of the Architecture Design Document (ADD).</li>
            <li><strong>Milestone 3 (30% - $43,500):</strong> Invoiced upon successful completion of User Acceptance Testing (UAT) in the staging environment.</li>
            <li><strong>Milestone 4 (20% - $29,000):</strong> Invoiced upon final go-live, successful production deployment, and completion of the knowledge transfer phase.</li>
          </ul>
          <p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);"><em>Important Note: Cloud infrastructure consumption costs (e.g., AWS/GCP hosting fees, software licenses) are explicitly excluded from this proposal and will be billed directly to the client's corporate accounts.</em></p>`;
          break;
        case 'Risks & Assumptions':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">To accurately scope this engagement, several assumptions have been made. Deviation from these assumptions may result in changes to the project timeline or budget, subject to the formal Change Request process.</p>
          <ul style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li><strong>Assumption 1:</strong> Client subject matter experts (SMEs) will be available for a minimum of 4 hours per week to clarify business logic and validate migration strategies.</li>
            <li><strong>Assumption 2:</strong> The existing legacy source code is fully accessible, accurately documented, and can be compiled without proprietary third-party dependencies that are unavailable.</li>
            <li><strong>Assumption 3:</strong> Access credentials for all necessary staging and production environments will be provided within 3 business days of project kickoff.</li>
            <li><strong>Risk:</strong> Delays in UAT sign-off by client stakeholders may push the final go-live date. <strong>Mitigation:</strong> Weekly status reports and early, frequent testing cycles will be employed to ensure alignment.</li>
          </ul>`;
          break;
        case 'Acceptance Criteria':
          html += `<p style="margin-bottom: 12px; line-height: 1.6; color: var(--app-color-text);">The project will be deemed complete and ready for final sign-off when the following acceptance criteria have been demonstrably met in the production environment:</p>
          <ul style="margin-bottom: 16px; padding-left: 24px; line-height: 1.6; color: var(--app-color-text);">
            <li>All 12 backend services are successfully containerized, deployed to the Kubernetes cluster, and passing all automated health checks.</li>
            <li>The API Gateway is routing traffic correctly, enforcing JWT authentication, and applying configured rate limits without measurable latency degradation.</li>
            <li>The migrated cloud databases are fully synchronized with legacy data, and automated backup routines have been verified via a successful restore test.</li>
            <li>Performance tests demonstrate that the new infrastructure handles 200% of current peak load with sub-200ms API response times.</li>
            <li>The client operations team has formally signed off on the receipt and adequacy of the handover documentation and runbooks.</li>
          </ul>`;
          break;
        default:
          html += `<p style="margin-bottom: 16px; line-height: 1.6; color: var(--app-color-text);">This is auto-generated detailed content for the <strong>${item}</strong> section based on the extracted requirements from your RFP document. Our AI analysis indicates that this section requires further manual review to align perfectly with your internal compliance standards. Please review and modify as needed to ensure it meets your exact specifications.</p>`;
          break;
      }
      html += '</div>';
      return html;
    }).join('\n');
  });

  // Set initial content when not generating
  useEffect(() => {
    if (editorRef.current && !isGenerating) {
      if (editorRef.current.innerHTML === '') {
        editorRef.current.innerHTML = contentHtml;
      }
    }
  }, [isGenerating, contentHtml]);

  // Scroll to section when TOC item is clicked
  useEffect(() => {
    if (!onSectionChange) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const index = parseInt(id.replace('sow-section-', ''), 10);
          if (!isNaN(index)) {
            onSectionChange(index);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-150px 0px -50% 0px',
      threshold: 0
    });

    tocItems.forEach((_, idx) => {
      const el = document.getElementById(`sow-section-${idx}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems.length, onSectionChange]);

  const handleContentChange = () => {
    if (editorRef.current && !isGenerating) {
      const currentHtml = editorRef.current.innerHTML;
      setContentHtml(currentHtml);
      updateActiveFormats();
    }
  };

  const updateActiveFormats = () => {
    const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];
    const formats: Record<string, boolean> = {};
    commands.forEach(cmd => {
      try {
        formats[cmd] = document.queryCommandState(cmd);
      } catch (e) {
        formats[cmd] = false;
      }
    });
    setActiveFormats(formats);
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (isGenerating) return;

    if (command === 'fontSize') {
      if (!value) return;
      document.execCommand('fontSize', false, '7');
      const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
      if (fontElements) {
        fontElements.forEach(el => {
          el.removeAttribute('size');
          (el as HTMLElement).style.fontSize = `${value}px`;
        });
      }
      updateActiveFormats();
      if (editorRef.current) {
        editorRef.current.focus();
      }
      return;
    }

    if (command === 'createLink') {
      const url = prompt('Enter link URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else if (command === 'insertImage') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
              document.execCommand(command, false, readerEvent.target.result as string);
              updateActiveFormats();
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else if (command === 'insertTable') {
      const tableHTML = '<table border="1" style="width:100%; border-collapse:collapse; margin-bottom:16px;"><tr><td style="padding:8px;">Row 1, Cell 1</td><td style="padding:8px;">Row 1, Cell 2</td></tr><tr><td style="padding:8px;">Row 2, Cell 1</td><td style="padding:8px;">Row 2, Cell 2</td></tr></table>';
      document.execCommand('insertHTML', false, tableHTML);
    } else if (command === 'clearFormat') {
      document.execCommand('removeFormat', false, undefined);
    } else {
      document.execCommand(command, false, value);
    }
    
    updateActiveFormats();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const ToolbarButton = ({ icon, command, value, title, isActive }: { icon: IconName, command: string, value?: string, title: string, isActive?: boolean }) => (
    <button 
      title={title}
      className={`toolbar-button ${isActive ? 'active' : ''}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault();
        execCmd(command, value);
      }}
      disabled={isGenerating}
    >
      <Icon name={icon} size={16} />
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: 'transparent', position: 'relative', containerType: 'inline-size' }}>
      
      {/* Toolbar */}
      <div className={`editor-toolbar ${isGenerating ? 'disabled' : ''}`} style={{ flexWrap: 'nowrap', whiteSpace: 'nowrap', overflowX: 'auto', opacity: readOnly ? 0.5 : 1, pointerEvents: readOnly ? 'none' : 'auto' }}>
        
        <ToolbarButton icon="undo" command="undo" title="Undo" />
        <ToolbarButton icon="redo" command="redo" title="Redo" />

        <div className="toolbar-separator" />

        <select 
          className="toolbar-select"
          onChange={(e) => execCmd('fontSize', e.target.value)}
          defaultValue="15"
          disabled={isGenerating}
          title="Font Size"
        >
          <option value="15" disabled hidden>Size</option>
          {[8, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        <div className="toolbar-separator" />
        
        <select 
          className="toolbar-select"
          onChange={(e) => execCmd('formatBlock', e.target.value)}
          defaultValue="P"
          disabled={isGenerating}
          title="Paragraph Style"
        >
          <option value="P">Normal</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
          <option value="H4">Heading 4</option>
          <option value="H5">Heading 5</option>
          <option value="H6">Heading 6</option>
        </select>

        <div className="toolbar-separator" />
        
        <ToolbarButton icon="list" command="insertUnorderedList" title="Bullet List" isActive={activeFormats['insertUnorderedList']} />
        <ToolbarButton icon="list-ordered" command="insertOrderedList" title="Numbered List" isActive={activeFormats['insertOrderedList']} />
        <ToolbarButton icon="indent" command="indent" title="Indent" />
        <ToolbarButton icon="outdent" command="outdent" title="Outdent" />
        
        <div className="toolbar-separator" />

        <ToolbarButton icon="bold" command="bold" title="Bold" isActive={activeFormats['bold']} />
        <ToolbarButton icon="italic" command="italic" title="Italic" isActive={activeFormats['italic']} />
        <ToolbarButton icon="underline" command="underline" title="Underline" isActive={activeFormats['underline']} />
        <ToolbarButton icon="strikethrough" command="strikeThrough" title="Strikethrough" isActive={activeFormats['strikeThrough']} />
        <ToolbarButton icon="quote" command="formatBlock" value="BLOCKQUOTE" title="Blockquote" />

        
        <div className="toolbar-separator" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 4px' }} title="Text Color">
          <input type="color" className="toolbar-color-picker" defaultValue="#1E293B" onChange={(e) => execCmd('foreColor', e.target.value)} disabled={isGenerating} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 4px' }} title="Highlight Color">
          <input type="color" className="toolbar-color-picker" defaultValue="#FFFFFF" onChange={(e) => execCmd('hiliteColor', e.target.value)} disabled={isGenerating} />
        </div>

        <div className="toolbar-separator" />

        <ToolbarButton icon="align-left" command="justifyLeft" title="Align Left" isActive={activeFormats['justifyLeft']} />
        <ToolbarButton icon="align-center" command="justifyCenter" title="Align Center" isActive={activeFormats['justifyCenter']} />
        <ToolbarButton icon="align-right" command="justifyRight" title="Align Right" isActive={activeFormats['justifyRight']} />
        <ToolbarButton icon="align-justify" command="justifyFull" title="Justify" isActive={activeFormats['justifyFull']} />
        
        <div className="toolbar-separator" />

        <ToolbarButton icon="link" command="createLink" title="Insert Link" />
        <ToolbarButton icon="image" command="insertImage" title="Insert Image" />
        <ToolbarButton icon="grid" command="insertTable" title="Insert Table" />
        
        <div className="toolbar-separator" />
        
        <ToolbarButton icon="remove-formatting" command="clearFormat" title="Clear Formatting" />

      </div>

      {/* Editor Content Area */}
      <div id="sow-editor-scroll-area" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        backgroundColor: 'var(--app-color-surface-muted)',
        padding: '32px 24px 64px 24px',
        display: 'block'
      }}>
        {/* Document Card */}
        <div style={{
          margin: '0 auto 64px auto',
          maxWidth: '850px',
          width: '100%',
          backgroundColor: 'var(--app-color-surface)',
          minHeight: '1056px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderRadius: '4px',
          padding: '64px 80px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {isGenerating ? (
            children
          ) : (
            <div 
              className="smooth-enter"
              ref={editorRef}
              contentEditable={!isGenerating && !readOnly}
              onInput={handleContentChange}
              onBlur={handleContentChange}
              onKeyUp={updateActiveFormats}
              onMouseUp={updateActiveFormats}
              style={{
                outline: 'none',
                fontSize: '15px',
                height: 'auto',
                minHeight: '100%',
                overflow: 'visible',
                display: 'block'
              }}
            />
          )}
        </div>
        
        {/* Bottom spacer to prevent margin collapse and ensure scrolling gap */}
        <div style={{ height: '64px', width: '100%' }}></div>
      </div>
    </div>
  );
}
