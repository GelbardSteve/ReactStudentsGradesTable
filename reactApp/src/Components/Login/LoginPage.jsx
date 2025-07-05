import React, { useEffect, useState } from 'react';
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
    reset,
    setError,
  } = useForm();

  // Use the original working hooks
  const { loginAdmin, isAdminLoading, error: adminError } = useLoginAdmin(setError, navigate, null);
  const { loginStudent, isStudentLoading, error: studentError } = useLoginStudent(setError, navigate, null);
  const verifyAuth = useVerifyAuthenticationFromLoginPage(true);

  // Check if user is already authenticated and redirect them
  useEffect(() => {
    const checkAuth = async () => {
      console.log('LoginPage - Checking authentication status...');
      setIsCheckingAuth(true);
      
      try {
        await verifyAuth();
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    // Only check auth once when component mounts
    checkAuth();
  }, []); // Empty dependency array to run only once

  const onSubmit = (data) => {
    console.log('Login form submitted:', { loginType, data }); // Debug log
    if (loginType === 'admin') {
      console.log('Calling loginAdmin with:', data); // Debug log
      loginAdmin(data);
    } else {
      console.log('Calling loginStudent with:', data); // Debug log
      loginStudent(data);
    }
  };

  const toggleLoginType = () => {
    setLoginType(loginType === 'student' ? 'admin' : 'student');
    reset(); // Reset form when switching types
  };

  // Get the correct error & loading state based on the selected form
  const error = loginType === 'admin' ? adminError : studentError;
  const isLoading = loginType === 'admin' ? isAdminLoading : isStudentLoading;

  console.log('LoginPage render:', { loginType, error, isLoading }); // Debug log

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

  // Debug section - remove in production
  const debugInfo = {
    adminAuth: localStorage.getItem('adminAuthentication'),
    studentAuth: localStorage.getItem('studentAuthentication'),
    isAdminLoading,
    isStudentLoading,
    adminError: adminError?.message,
    studentError: studentError?.message
  };

  return (
    <div className="login-page">
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#f0f0f0',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          maxWidth: '300px',
          zIndex: 1000
        }}>
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
      
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
                className={`toggle-btn ${loginType === 'admin' ? 'active' : ''}`}
                onClick={() => setLoginType('admin')}
              >
                Admin Login
              </button>
            </div>
            
            {error && <div className="error-message">{error.message}</div>}
            
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