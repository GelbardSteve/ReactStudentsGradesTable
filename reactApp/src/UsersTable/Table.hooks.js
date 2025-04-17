import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addAllUsers } from '../Components/store/actions/manageData';
import { clearRoles } from '../Components/store/actions/roleActions';
import { clearStudent } from '../Components/store/actions/studentActions';

export const useGetAllUsers = () => {
  const dispatch = useDispatch();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const response = await axios.get('https://node-4-pdlj.onrender.com/students2');
      return response.data?.items || [];
    },
    keepPreviousData: true,
    onSuccess: (data) => {
      dispatch(addAllUsers(data));
    },
  });

  return {
    data, 
    isLoading,
    error
  }
};

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOutAPI = (isAdminAuthentication) => {
    return axios.post('https://node-4-pdlj.onrender.com/remove/authentication', isAdminAuthentication);
  };

  const { mutate: loginAdmin, isLoading: isAdminLoading } = useMutation(
    async () => {
      const isAdmin = localStorage.getItem('adminAuthentication') ? true : false;
      const user = isAdmin ? 'admin' : 'student';
      const userAuthenticationToken = `${user}Authentication`;
      const userAuthentication = localStorage.getItem(userAuthenticationToken);
      const isAdminAuthentication =
        user === 'admin'
          ? { authentication: userAuthentication }
          : { table: 'students2', authentication: userAuthentication };

      return logOutAPI(isAdminAuthentication);
    },
    {
      onSuccess: () => {
        const isAdmin = localStorage.getItem('adminAuthentication') ? true : false;
        const user = isAdmin ? 'admin' : 'student';
        const userAuthenticationToken = `${user}Authentication`;

        dispatch(clearRoles());
        dispatch(clearStudent());
        localStorage.removeItem(userAuthenticationToken);
        navigate('/');
      }
    }
  );

  return { loginAdmin, isAdminLoading };
};

export const useDeleteUser = () => {
  const { mutate: deleteUser, isLoading, error } = useMutation(
    async (userId) => {
      return axios.delete(`https://node-4-pdlj.onrender.com/students2/${userId}`);
    },
    {
      onSuccess: () => {
        toast.success(`User was deleted`);
      },
    }
  );

  return { deleteUser, isLoading, error };
};


// Custom hook for managing modal states (create & edit)
export const useModal = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openCreate = useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = useCallback(() => setIsCreateOpen(false), []);

  const openEdit = useCallback((user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  }, []);
  const closeEdit = useCallback(() => setIsEditOpen(false), []);

  return { isCreateOpen, isEditOpen, selectedUser, openCreate, closeCreate, openEdit, closeEdit };
};
