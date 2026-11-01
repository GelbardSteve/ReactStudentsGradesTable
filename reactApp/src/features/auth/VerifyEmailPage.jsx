import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient, getErrorMessage } from '../../api/client';
import './Login.css';
import { StyledWrapper } from './Login.styles';

// Landing page for the link in the verification email: /#/verify?token=...
export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { mutate: verify, isSuccess, isError, error } = useMutation({
    mutationFn: async () => (await apiClient.post('/auth/verify', { token })).data,
  });

  // The token is single-use, so StrictMode's second effect run must not send it again
  const hasSent = useRef(false);
  useEffect(() => {
    if (token && !hasSent.current) {
      hasSent.current = true;
      verify();
    }
  }, [token, verify]);

  let content;
  if (!token || isError) {
    content = (
      <div className="error-message" role="alert">
        {token ? getErrorMessage(error, 'This link is invalid or has expired.') : 'This link is missing its token.'}
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="success-message" role="status" data-test-specifier="verifySuccess">
        Your email is verified. You can now log in.
      </div>
    );
  } else {
    content = <p className="login-subtitle">Verifying your email...</p>;
  }

  return (
    <div className="login-page">
      <StyledWrapper>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 className="login-title">Email Verification</h2>
          {content}
          {(isSuccess || isError || !token) && <Link to="/">Go to login</Link>}
        </div>
      </StyledWrapper>
    </div>
  );
};
