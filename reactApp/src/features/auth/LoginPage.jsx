import { useEffect, useState } from 'react';
import { AdminLoginForm } from './AdminLoginForm';
import './Login.css';
import { StyledFormWrapper, StyledLoginPanel, StyledWrapper } from './Login.styles';
import { SignUpForm } from './SignUpForm';
import { useAuth } from './useAuth';

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { verifyAuth } = useAuth();

  // Redirect admins who are already logged in (verifyAuth is memoized, so this runs once on mount)
  useEffect(() => {
    verifyAuth(true).finally(() => setIsCheckingAuth(false));
  }, [verifyAuth]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="login-page">
        <StyledWrapper>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ fontSize: '24px', color: '#667eea' }}>🔐</div>
            <div style={{ fontSize: '18px', color: '#666' }}>Checking authentication...</div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </StyledWrapper>
      </div>
    );
  }

  return (
    <div className="login-page">
      <StyledWrapper>
        <StyledFormWrapper>
          <StyledLoginPanel>
            <div className="login-header">
              <h2 className="login-title">{activeTab === 'login' ? 'Welcome Back' : 'Create Admin Account'}</h2>
              <p className="login-subtitle">
                {activeTab === 'login' ? 'Please sign in to continue' : 'We will email you a link to activate it'}
              </p>
            </div>

            <div className="login-toggle" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                data-test-specifier="login-to-admin-button"
                className={`toggle-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'signup'}
                data-test-specifier="signup-tab-button"
                className={`toggle-btn ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'login' ? <AdminLoginForm /> : <SignUpForm />}
          </StyledLoginPanel>

          <div className="login-illustration">
            <img 
              width={600} 
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" 
              className="img-fluid" 
              alt="Login Illustration" 
            />
          </div>
        </StyledFormWrapper>
      </StyledWrapper>
    </div>
  );
};