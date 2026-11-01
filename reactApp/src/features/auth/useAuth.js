import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, isNetworkError } from '../../api/client';
import { clearSession, getEmail, getToken } from './session';

export const HOME_PATH = '/classes';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(getToken());
  const adminEmail = getEmail();

  const endSession = useCallback(() => {
    clearSession();
    queryClient.clear();
    navigate('/');
  }, [navigate, queryClient]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (getToken()) {
        await apiClient.post('/auth/logout');
      }
    },
    // Clear the local session even if the server call fails, so the admin is never stuck logged in
    onSettled: endSession,
  });

  // Checks the stored token with the server.
  // On the login page a valid token redirects home; elsewhere an invalid token ends the session.
  const verifyAuth = useCallback(async (fromLoginPage = false) => {
    if (!getToken()) {
      if (!fromLoginPage) navigate('/');
      return;
    }

    try {
      await apiClient.get('/auth/me');
      if (fromLoginPage) navigate(HOME_PATH);
    } catch (error) {
      // Keep the session on network errors; the server may just be unreachable
      if (!isNetworkError(error) && error.response.status === 401) {
        endSession();
      } else {
        console.error('Error in authentication request:', error);
      }
    }
  }, [navigate, endSession]);

  return {
    isLoggedIn,
    adminEmail,
    logout: logoutMutation.mutate,
    isLogoutLoading: logoutMutation.isLoading,
    verifyAuth,
  };
};
