import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { setRoles } from '../../Components/store/actions/roleActions';
import { setStudent } from '../../Components/store/actions/studentActions';
import { authenticateStudent, authenticateUser } from './LoginPage.helper';

const API_BASE_URL = 'https://node-4-pdlj.onrender.com';

export const useLoginAdmin = (setError, navigate, dispatch) => {
    const { mutate: loginAdmin, isLoading: isAdminLoading, error } = useMutation(authenticateUser, {
        onSuccess: (data) => {
          if (data === 401) {
            setError('loginError', { type: 'manual', message: 'Invalid username or password' });
          } else {
            dispatch(setRoles(data.userRole));
            localStorage.setItem('adminAuthentication', data.authentication);
            navigate('/table');
          }
        },
      });

      return { loginAdmin, isAdminLoading, error };
}
  
export const useLoginStudent = (setError, navigate, dispatch) => {
  const { mutate: loginStudent, isLoading: isStudentLoading, error } = useMutation(authenticateStudent, {
    onSuccess: (data) => {
      if (data === 'NotFound') {
        setError('loginError', { type: 'manual', message: 'Invalid student number' });
      } else {
        dispatch(setRoles('student'));
        dispatch(setStudent({ userData: data.userData, authentication: data.authentication }));
        localStorage.setItem('studentAuthentication', data.authentication);
        navigate('/studentTable');
      }
    },
  });

  return { loginStudent, isStudentLoading, error }
}

export const useVerifyAuthenticationFromLoginPage = (fromLoginPage) => {
  const navigate = useNavigate();

  return useCallback(async () => {

    const adminAuth = localStorage.getItem('adminAuthentication');
    const studentAuth = localStorage.getItem('studentAuthentication');

    const authToken = adminAuth || studentAuth;

    const url = adminAuth ? 'login' : 'students';
    const user = adminAuth ? 'admin' : 'student';

    const userAuthenticationToken = `${user}Authentication`;
    if (!adminAuth && !studentAuth) {
      navigate('/');
      localStorage.removeItem(userAuthenticationToken);
    }
    


    try {
      const response = await axios.post(`${API_BASE_URL}/${url}/authentication`, {
        authentication: authToken,
      });

      if (fromLoginPage) {
        response.data !== 401 && navigate(url === 'login' ? '/table' : '/studentTable');
      } else {
        if (response.data === 401) {
          navigate('/');
          localStorage.removeItem(userAuthenticationToken);
        }
      }
    } catch (error) {
      console.error("Error in authentication request:", error);
    }
  }, [navigate, fromLoginPage]); // Add dependencies
};