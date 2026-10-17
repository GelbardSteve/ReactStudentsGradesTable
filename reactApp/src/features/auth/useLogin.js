import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { HOME_BY_ROLE, saveSession } from './useAuth';

// Invalid credentials are reported through the form (setError); network/server failures through `error`
export const useLogin = (loginType, setError) => {
  const navigate = useNavigate();

  const adminLogin = useMutation({
    mutationFn: async (credentials) => (await apiClient.post('/login', credentials)).data,
    onSuccess: (data) => {
      if (data === 401) {
        setError('loginError', { type: 'manual', message: 'Invalid username or password' });
        return;
      }
      saveSession({ role: 'admin', token: data.authentication });
      navigate(HOME_BY_ROLE.admin);
    },
  });

  const studentLogin = useMutation({
    mutationFn: async ({ studentNumber }) =>
      (await apiClient.post(`/students2/${encodeURIComponent(studentNumber)}`)).data,
    onSuccess: (data) => {
      if (data === 'NotFound') {
        setError('loginError', { type: 'manual', message: 'Invalid student number' });
        return;
      }
      saveSession({ role: 'student', token: data.authentication, studentData: data.userData });
      navigate(HOME_BY_ROLE.student);
    },
  });

  const mutation = loginType === 'admin' ? adminLogin : studentLogin;

  return {
    login: mutation.mutate,
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
};
