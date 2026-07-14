import React, { useState, useEffect } from 'react';
import { Layout } from './layout/Layout';
import { ThemeProvider } from './theme/ThemeProvider';
import { Login } from './screens/Login';
import { Icon } from './components/ui/Icon';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <Login onLogin={(role) => {
          setUserRole(role);
          setIsAuthenticated(true);
          setIsInitializing(true);
          setTimeout(() => {
            setIsInitializing(false);
          }, 1500);
        }} />
      </ThemeProvider>
    );
  }

  if (isInitializing) {
    return (
      <ThemeProvider>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--app-color-bg)' }}>
          <div style={{ color: 'var(--app-color-primary)', marginBottom: '16px' }}>
            <Icon name="loader" size={48} className="icon-spin" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--app-color-text)', margin: '0 0 8px 0' }}>Setting up your workspace...</h2>
          <p style={{ fontSize: '14px', color: 'var(--app-color-text-muted)' }}>Preparing the M42 Document Generator environment.</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout 
        userRole={userRole} 
        onLogout={() => {
          setIsAuthenticated(false);
          setUserRole(null);
        }}
      />
    </ThemeProvider>
  );
}

export default App;
