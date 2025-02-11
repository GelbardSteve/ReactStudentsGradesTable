import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUsers } from '../Components/store/actions/manageData';
import { clearRoles } from '../Components/store/actions/roleActions';
import { clearStudent } from '../Components/store/actions/studentActions';

export const useSortedData = (currentPage, pageSize) => {
  const [state, setState] = useState([]); // Store the state
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
    
    setState(data.items);

    return {
      items: data.items,
      totalPages,
    };
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sortedData', currentPage, pageSize], // Include state in dependencies
    queryFn: fetchSortedData,
    keepPreviousData: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: allStudents } = await axios.get('https://node-4-pdlj.onrender.com/students2');
      dispatch(addUsers(allStudents.items));
    }
    fetchData();
     // Ensure users are added
  }, [dispatch, state]);

  return {
    state: state || [],
    setState,
    originalState: data?.items || [],
    studentsCount: data?.totalPages || 3,
    isLoading,
    isError,
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