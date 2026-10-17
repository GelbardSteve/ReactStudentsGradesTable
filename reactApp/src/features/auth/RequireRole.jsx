import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { HOME_BY_ROLE, useAuth } from './useAuth';

// Route guard: redirects users without the required role, and re-checks the token with the server.
// Pages behind it never mount (or fetch data) for the wrong user.
export const RequireRole = ({ role, children }) => {
  const { userRole, verifyAuth } = useAuth();
  const hasRole = userRole === role;

  useEffect(() => {
    if (hasRole) {
      verifyAuth(false);
    }
  }, [hasRole, verifyAuth]);

  if (!hasRole) {
    return <Navigate to={HOME_BY_ROLE[userRole] ?? '/'} replace />;
  }

  return children;
};
