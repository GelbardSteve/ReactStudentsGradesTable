import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '../../UsersLoginForm/AdminLoginForm/AdminLoginForm';
import { StudentLoginForm } from '../../UsersLoginForm/StudentLoginForm/StudentLoginForm';
import { Button } from '../Buttons/Button';
import './Login.css';
import { useLoginAdmin, useLoginStudent, useVerifyAuthenticationFromLoginPage } from './Login.hooks';
import { StyledForm, StyledFormWrapper, StyledWrapper } from './Login.styles';

export const LoginPage = () => {
  const [loginType, setLoginType] = useState('student');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    setError,
    clearErrors,
  } = useForm();

  // Use the original working hooks
  const { loginAdmin, isAdminLoading, error: adminError } = useLoginAdmin(setError, navigate, null);
  const { loginStudent, isStudentLoading, error: studentError } = useLoginStudent(setError, navigate, null);
  const verifyAuth = useVerifyAuthenticationFromLoginPage(true);

  // Check if user is already authenticated and redirect them
  // verifyAuth is memoized, so this runs once on mount
  useEffect(() => {
    verifyAuth().finally(() => setIsCheckingAuth(false));
  }, [verifyAuth]);

  const onSubmit = (data) => {
    clearErrors('loginError');
    if (loginType === 'admin') {
      loginAdmin(data);
    } else {
      loginStudent(data);
    }
  };

  // Get the correct error & loading state based on the selected form.
  // Invalid credentials are reported via setError('loginError'); network/server failures via the mutation error.
  const error = errors.loginError || (loginType === 'admin' ? adminError : studentError);
  const isLoading = loginType === 'admin' ? isAdminLoading : isStudentLoading;

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
                  Controller={Controller} 
                  control={control} 
                  errors={errors} 
                  trigger={trigger} 
                />
              ) : (
                <AdminLoginForm 
                  Controller={Controller} 
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