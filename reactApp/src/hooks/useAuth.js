import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://node-4-pdlj.onrender.com';

// Auth state management with localStorage and React Query
export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user role from localStorage
  const userRole = localStorage.getItem('userRole');
  
  // Get current student data from localStorage
  const studentData = localStorage.getItem('studentData') ? JSON.parse(localStorage.getItem('studentData')) : null;

  // Login admin mutation using original pattern
  const loginAdminMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Admin login onSuccess called with:', data);
      if (data === 401) {
        throw new Error('Invalid username or password');
      }
      
      localStorage.setItem('userRole', data.userRole);
      localStorage.setItem('adminAuthentication', data.authentication);
      console.log('Admin authentication stored, navigating to /table');
      navigate('/table');
    },
    onError: (error) => {
      console.error('Admin login error:', error);
    },
  });

  // Login student mutation using original pattern
  const loginStudentMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post(`${API_BASE_URL}/students2/${credentials.studentNumber}`, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Student login onSuccess called with:', data);
      if (data === 'NotFound') {
        throw new Error('Invalid student number');
      }
      
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('studentData', JSON.stringify(data.userData));
      localStorage.setItem('studentAuthentication', data.authentication);
      console.log('Student authentication stored, navigating to /studentTable');
      navigate('/studentTable');
    },
    onError: (error) => {
      console.error('Student login error:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const isAdmin = localStorage.getItem('adminAuthentication') ? true : false;
      const user = isAdmin ? 'admin' : 'student';
      const userAuthenticationToken = `${user}Authentication`;
      const userAuthentication = localStorage.getItem(userAuthenticationToken);
      
      const isAdminAuthentication = user === 'admin'
        ? { authentication: userAuthentication }
        : { table: 'students2', authentication: userAuthentication };

      return axios.post(`${API_BASE_URL}/remove/authentication`, isAdminAuthentication);
    },
    onSuccess: () => {
      const isAdmin = localStorage.getItem('adminAuthentication') ? true : false;
      const user = isAdmin ? 'admin' : 'student';
      const userAuthenticationToken = `${user}Authentication`;

      localStorage.removeItem(userAuthenticationToken);
      localStorage.removeItem('userRole');
      if (user === 'student') {
        localStorage.removeItem('studentData');
      }

      // Clear all queries
      queryClient.clear();
      navigate('/');
    },
  });

  // Verify authentication using original pattern - memoized to prevent infinite loops
  const verifyAuth = useCallback(async (fromLoginPage = false) => {
    console.log('Verifying authentication...'); // Debug log
    const adminAuth = localStorage.getItem('adminAuthentication');
    const studentAuth = localStorage.getItem('studentAuthentication');
    const authToken = adminAuth || studentAuth;

    console.log('Auth tokens:', { adminAuth: !!adminAuth, studentAuth: !!studentAuth }); // Debug log

    if (!adminAuth && !studentAuth) {
      console.log('No auth tokens found, navigating to login'); // Debug log
      navigate('/');
      return;
    }

    const url = adminAuth ? 'login' : 'students';
    const user = adminAuth ? 'admin' : 'student';
    const userAuthenticationToken = `${user}Authentication`;

    try {
      console.log('Making authentication request to:', `${API_BASE_URL}/${url}/authentication`); // Debug log
      const response = await axios.post(`${API_BASE_URL}/${url}/authentication`, {
        authentication: authToken,
      });

      console.log('Authentication response:', response.data); // Debug log

      if (fromLoginPage) {
        if (response.data !== 401) {
          console.log('From login page, navigating to:', url === 'login' ? '/table' : '/studentTable'); // Debug log
          navigate(url === 'login' ? '/table' : '/studentTable');
        }
      } else {
        if (response.data === 401) {
          console.log('Authentication failed, clearing cache and navigating to login'); // Debug log
          navigate('/');
          localStorage.removeItem(userAuthenticationToken);
          localStorage.removeItem('userRole');
          if (user === 'student') {
            localStorage.removeItem('studentData');
          }
          queryClient.clear();
        } else {
          console.log('Authentication successful'); // Debug log
        }
      }
    } catch (error) {
      console.error("Error in authentication request:", error);
      
      // Handle network errors gracefully to prevent infinite loops
      if (error.code === 'NETWORK_ERROR' || 
          error.message?.includes('Network Error') || 
          error.code === 'ERR_NETWORK' ||
          !error.response) {
        console.log('Network error detected, authentication check skipped');
        // Don't redirect on network errors to prevent infinite loops
        return;
      }
      
      // For other errors, only redirect if it's a 401 or similar auth error
      if (error.response?.status === 401) {
        console.log('Authentication error (401), clearing cache and navigating to login');
        navigate('/');
        localStorage.removeItem(userAuthenticationToken);
        localStorage.removeItem('userRole');
        if (user === 'student') {
          localStorage.removeItem('studentData');
        }
        queryClient.clear();
      }
    }
  }, [navigate, queryClient]);

  return {
    userRole,
    studentData,
    loginAdmin: loginAdminMutation.mutate,
    loginStudent: loginStudentMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginAdminLoading: loginAdminMutation.isLoading,
    isLoginStudentLoading: loginStudentMutation.isLoading,
    isLogoutLoading: logoutMutation.isLoading,
    loginAdminError: loginAdminMutation.error,
    loginStudentError: loginStudentMutation.error,
    verifyAuth,
  };
}; 