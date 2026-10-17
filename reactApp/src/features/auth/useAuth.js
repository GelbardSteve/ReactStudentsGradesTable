import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, isNetworkError } from '../../api/client';

export const HOME_BY_ROLE = { admin: '/table', student: '/studentTable' };

// The session lives in localStorage: userRole, one token per role, and studentData for students
const SESSION_KEYS = ['userRole', 'adminAuthentication', 'studentAuthentication', 'studentData'];

const getSession = () => {
  const adminToken = localStorage.getItem('adminAuthentication');
  if (adminToken) return { role: 'admin', token: adminToken };

  const studentToken = localStorage.getItem('studentAuthentication');
  if (studentToken) return { role: 'student', token: studentToken };

  return null;
};

export const saveSession = ({ role, token, studentData }) => {
  localStorage.setItem('userRole', role);
  localStorage.setItem(`${role}Authentication`, token);
  if (studentData) {
    localStorage.setItem('studentData', JSON.stringify(studentData));
  }
};

const clearSession = () => SESSION_KEYS.forEach((key) => localStorage.removeItem(key));

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole');
  const storedStudentData = localStorage.getItem('studentData');
  const studentData = storedStudentData ? JSON.parse(storedStudentData) : null;

  const endSession = useCallback(() => {
    clearSession();
    queryClient.clear();
    navigate('/');
  }, [navigate, queryClient]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const session = getSession();
      if (!session) return;

      await apiClient.post('/remove/authentication', {
        authentication: session.token,
        ...(session.role === 'student' && { table: 'students2' }),
      });
    },
    // Clear the local session even if the server call fails, so the user is never stuck logged in
    onSettled: endSession,
  });

  // Checks the stored token with the server.
  // On the login page a valid token redirects to the user's home; elsewhere an invalid token ends the session.
  const verifyAuth = useCallback(async (fromLoginPage = false) => {
    const session = getSession();
    if (!session) {
      navigate('/');
      return;
    }

    const url = session.role === 'admin' ? '/login/authentication' : '/students/authentication';

    try {
      const { data } = await apiClient.post(url, { authentication: session.token });
      const isValid = data !== 401;

      if (fromLoginPage && isValid) {
        navigate(HOME_BY_ROLE[session.role]);
      } else if (!fromLoginPage && !isValid) {
        endSession();
      }
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
    userRole,
    studentData,
    logout: logoutMutation.mutate,
    isLogoutLoading: logoutMutation.isLoading,
    verifyAuth,
  };
};
