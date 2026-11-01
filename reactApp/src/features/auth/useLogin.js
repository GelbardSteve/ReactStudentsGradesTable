import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { saveSession } from './session';
import { HOME_PATH } from './useAuth';

// Invalid credentials are reported through the form (setError); network/server failures through `error`
export const useLogin = (setError) => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async ({ email, password }) => (await apiClient.post('/auth/login', { email, password })).data,
    onSuccess: (data) => {
      saveSession({ token: data.token, email: data.email });
      navigate(HOME_PATH);
    },
    onError: (error) => {
      const { status, data } = error.response || {};
      if (status === 401) {
        setError('loginError', { type: 'manual', message: 'Invalid email or password' });
      } else if (status === 403 && data?.code === 'EMAIL_NOT_VERIFIED') {
        setError('loginError', { type: 'notVerified', message: 'Please verify your email before logging in' });
      }
    },
  });

  const { status } = mutation.error?.response || {};
  const isHandledByForm = status === 401 || status === 403;

  return {
    login: mutation.mutate,
    isLoading: mutation.isLoading,
    error: isHandledByForm ? null : mutation.error,
  };
};

export const useSignUp = () => {
  const mutation = useMutation({
    mutationFn: async ({ email, password }) => (await apiClient.post('/auth/signup', { email, password })).data,
  });

  return {
    signUp: mutation.mutate,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export const useResendVerification = () => {
  const mutation = useMutation({
    mutationFn: async (email) => (await apiClient.post('/auth/resend-verification', { email })).data,
  });

  return {
    resend: mutation.mutate,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
  };
};
