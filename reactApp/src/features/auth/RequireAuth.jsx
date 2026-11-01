import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// Route guard: redirects to login without a session, and re-checks the token with the server.
// Pages behind it never mount (or fetch data) for a logged-out user.
export const RequireAuth = ({ children }) => {
  const { isLoggedIn, verifyAuth } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      verifyAuth(false);
    }
  }, [isLoggedIn, verifyAuth]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};
