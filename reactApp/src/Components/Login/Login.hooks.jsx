import { useMutation } from '@tanstack/react-query';
import { setRoles } from '../../Components/store/actions/roleActions';
import { setStudent } from '../../Components/store/actions/studentActions';
import { authenticateStudent, authenticateUser } from './LoginPage.helper';

export const useLoginAdmin = (setError, navigate, dispatch) => {
    const { mutate: loginAdmin, isLoading: isAdminLoading } = useMutation(authenticateUser, {
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

      return { loginAdmin, isAdminLoading };
}
  
export const useLoginStudent = (setError, navigate, dispatch) => {
  const { mutate: loginStudent, isLoading: isStudentLoading } = useMutation(authenticateStudent, {
    onSuccess: (data) => {
      if (data === 'NotFound') {
        setError('loginError', { type: 'manual', message: 'Invalid student number' });
      } else {
        dispatch(setStudent({ userData: data.userData, authentication: data.authentication }));
        localStorage.setItem('studentAuthentication', data.authentication);
        navigate('/studentTable');
      }
    },
  });

  return { loginStudent, isStudentLoading }
}