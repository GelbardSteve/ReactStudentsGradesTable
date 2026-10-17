import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/Button/Button';
import { AdminLoginForm } from './AdminLoginForm';
import './Login.css';
import { StyledForm, StyledFormWrapper, StyledWrapper } from './Login.styles';
import { StudentLoginForm } from './StudentLoginForm';
import { useAuth } from './useAuth';
import { useLogin } from './useLogin';

export const LoginPage = () => {
  const [loginType, setLoginType] = useState('student');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    setError,
    clearErrors,
  } = useForm();

  const { login, isLoading, error: requestError } = useLogin(loginType, setError);
  const { verifyAuth } = useAuth();

  // Redirect users who are already logged in (verifyAuth is memoized, so this runs once on mount)
  useEffect(() => {
    verifyAuth(true).finally(() => setIsCheckingAuth(false));
  }, [verifyAuth]);

  const onSubmit = (data) => {
    clearErrors('loginError');
    login(data);
  };

  const error = errors.loginError || requestError;

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
          <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <div className="login-header">
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Please sign in to continue</p>
            </div>
            
            <div className="login-toggle">
              <button
                type="button"
                className={`toggle-btn ${loginType === 'student' ? 'active' : ''}`}
                onClick={() => setLoginType('student')}
              >
                Student Login
              </button>
              <button
                type="button"
                data-test-specifier="login-to-admin-button"
                className={`toggle-btn ${loginType === 'admin' ? 'active' : ''}`}
                onClick={() => setLoginType('admin')}
              >
                Admin Login
              </button>
            </div>
            
            {error && <div className="error-message" role="alert">{error.message}</div>}
            
            <div className="form-content">
              {loginType === 'student' ? (
                <StudentLoginForm
                  control={control}
                  errors={errors}
                  trigger={trigger}
                />
              ) : (
                <AdminLoginForm
                  control={control}
                  errors={errors} 
                  trigger={trigger} 
                />
              )}

              <Button 
                disabled={!isValid} 
                type="submit" 
                dataTestSpecifier="submitButton"
                className="btn-block mb-4 login-submit-btn" 
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </div>
          </StyledForm>

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