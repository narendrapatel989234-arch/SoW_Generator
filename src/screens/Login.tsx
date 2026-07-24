import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';

interface LoginProps {
  onLogin: (role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<'PMO' | 'Reviewer' | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = () => {
    if (selectedRole) {
      setIsAuthenticating(true);
      // Simulate SSO delay
      setTimeout(() => {
        onLogin(selectedRole);
      }, 1500);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--app-color-bg)', overflow: 'hidden' }}>
      
      {/* Left Column: Branding */}
      <div className="login-branding" style={{ 
        flex: '0 0 45%', 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        padding: '48px',
        backgroundColor: 'var(--app-color-primary-soft)',
        overflow: 'hidden'
      }}>
        {/* Subtle branded background using pseudo-elements/gradients */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--app-color-accent-soft) 0%, transparent 100%)',
          filter: 'blur(80px)',
          opacity: 0.8,
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, var(--app-color-primary) 0%, transparent 100%)',
          filter: 'blur(100px)',
          opacity: 0.05,
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: 'var(--app-color-primary)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '18px'
            }}>
              M42
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--app-color-primary)', margin: 0, letterSpacing: '-0.5px' }}>
              Document Creator
            </h1>
          </div>

          <div style={{ marginBottom: '48px', maxWidth: '480px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--app-color-text)', lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-1px' }}>
              Intelligent business documents powered by AI.
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--app-color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Create structured Statement of Work (SOW) documents from RFPs using AI with a streamlined review workflow.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: 'var(--app-radius-md)', 
                backgroundColor: 'var(--app-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--app-color-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0
              }}>
                <Icon name="sparkles" size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--app-color-text)', margin: '0 0 4px 0' }}>AI Powered Creation</h3>
                <p style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', margin: 0 }}>Create document drafts in minutes using advanced language models.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: 'var(--app-radius-md)', 
                backgroundColor: 'var(--app-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--app-color-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0
              }}>
                <Icon name="check" size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--app-color-text)', margin: '0 0 4px 0' }}>Collaborative Review</h3>
                <p style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', margin: 0 }}>Assign reviewers, track statuses, and manage approvals effortlessly.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: 'var(--app-radius-md)', 
                backgroundColor: 'var(--app-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--app-color-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0
              }}>
                <Icon name="file" size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--app-color-text)', margin: '0 0 4px 0' }}>Enterprise Security</h3>
                <p style={{ fontSize: '13px', color: 'var(--app-color-text-muted)', margin: 0 }}>Secure authentication with Single Sign-On and role-based access.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="login-form-container" style={{ 
        flex: '1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '24px',
        position: 'relative'
      }}>
        
        <Card>
          <div style={{ 
            width: '100%', 
            maxWidth: '400px', 
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--app-color-text)', margin: '0 0 8px 0', textAlign: 'center' }}>
              Welcome
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--app-color-text-muted)', margin: '0 0 24px 0', textAlign: 'center' }}>
              Sign in using your organization account.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--app-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Select your role
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* PMO Card */}
                <div 
                  onClick={() => setSelectedRole('PMO')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--app-radius-md)',
                    border: selectedRole === 'PMO' ? '2px solid var(--app-color-primary)' : '1px solid var(--app-color-border)',
                    backgroundColor: selectedRole === 'PMO' ? 'rgba(13, 33, 44, 0.02)' : 'var(--app-color-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRole === 'PMO' ? '0 2px 8px rgba(13, 33, 44, 0.05)' : 'none'
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedRole('PMO'); }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedRole === 'PMO'}
                >
                  <div style={{ color: selectedRole === 'PMO' ? 'var(--app-color-primary)' : 'var(--app-color-text-muted)', marginTop: '2px' }}>
                    <Icon name="settings" size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)', marginBottom: '2px' }}>PMO</div>
                    <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', lineHeight: 1.4 }}>
                      Manage document creation, configuration, reviewers and approvals.
                    </div>
                  </div>
                </div>

                {/* Reviewer Card */}
                <div 
                  onClick={() => setSelectedRole('Reviewer')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--app-radius-md)',
                    border: selectedRole === 'Reviewer' ? '2px solid var(--app-color-primary)' : '1px solid var(--app-color-border)',
                    backgroundColor: selectedRole === 'Reviewer' ? 'rgba(13, 33, 44, 0.02)' : 'var(--app-color-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRole === 'Reviewer' ? '0 2px 8px rgba(13, 33, 44, 0.05)' : 'none'
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedRole('Reviewer'); }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedRole === 'Reviewer'}
                >
                  <div style={{ color: selectedRole === 'Reviewer' ? 'var(--app-color-primary)' : 'var(--app-color-text-muted)', marginTop: '2px' }}>
                    <Icon name="edit" size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--app-color-text)', marginBottom: '2px' }}>Reviewer</div>
                    <div style={{ fontSize: '12px', color: 'var(--app-color-text-muted)', lineHeight: 1.4 }}>
                      Review assigned sections, approve content and request regeneration.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className={!selectedRole ? 'disabled-button-styles' : ''}
              variant="primary" 
              style={{ width: '100%', height: '48px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: !selectedRole ? 'var(--app-color-primary-soft)' : '', color: !selectedRole ? 'var(--app-color-primary)' : '', opacity: !selectedRole ? 0.6 : 1 }}
              disabled={!selectedRole || isAuthenticating}
              onClick={handleLogin}
            >
              {isAuthenticating ? (
                <>
                  <Icon name="loader" className="icon-spin" size={18} />
                  Authenticating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: !selectedRole ? 0.5 : 1 }}>
                    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                  </svg>
                  Sign in with Microsoft SSO
                </>
              )}
            </Button>
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: 'var(--app-color-text-muted)', margin: '0 0 4px 0' }}>
                Protected by your organization's Single Sign-On.
              </p>
              <p style={{ fontSize: '11px', color: 'var(--app-color-text-muted)', margin: 0 }}>
                Need help? <a href="#" style={{ color: 'var(--app-color-primary)', textDecoration: 'none', fontWeight: 500 }}>Contact your administrator</a>.
              </p>
            </div>

          </div>
        </Card>
      </div>

      {/* Basic Responsive Styles */}
      <style>{`
        .disabled-button-styles:disabled {
          background-color: var(--app-color-primary-soft) !important;
          color: var(--app-color-primary) !important;
          border-color: var(--app-color-primary-soft) !important;
          opacity: 0.7 !important;
        }
        @media (max-width: 1024px) {
          .login-branding {
            flex: 0 0 40% !important;
            padding: 40px !important;
          }
        }
        @media (max-width: 768px) {
          .login-branding {
            display: none !important;
          }
          .login-form-container {
            align-items: flex-start !important;
            padding-top: 64px !important;
          }
        }
      `}</style>
    </div>
  );
}
