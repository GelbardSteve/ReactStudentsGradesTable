import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addAllUsers, addUsers } from '../Components/store/actions/manageData';
import { clearRoles } from '../Components/store/actions/roleActions';
import { clearStudent } from '../Components/store/actions/studentActions';

export const useGetAllUsers = () => {
  const dispatch = useDispatch();
  
  useQuery({
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
};



export const useSortedData = (currentPage, pageSize) => {
  const dispatch = useDispatch();

  const fetchSortedData = async () => {
    const shouldUpdatePage = pageSize !== undefined;
    const url = shouldUpdatePage 
      ? `https://node-4-pdlj.onrender.com/students2?currentPag=${currentPage}&pageSize=${pageSize}`
      : 'https://node-4-pdlj.onrender.com/students2';

    const { data } = await axios.get(url);

    // Save total pages locally
    const totalPages = data.totalPages > 3 ? data.totalPages : 3;
    localStorage.setItem('totalPages', totalPages);
    
    dispatch(addUsers(data.items));
    return {
      items: data.items,
      totalPages,
    };
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['sortedData', currentPage, pageSize], // Include state in dependencies
    queryFn: fetchSortedData,
    keepPreviousData: true,
  });
  
  return {
    data: data?.items || [],
    originalState: data?.items || [],
    studentsCount: data?.totalPages || 3,
    isLoading,
    error,
    refetch, // Function to manually trigger a refetch if needed
  };
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
