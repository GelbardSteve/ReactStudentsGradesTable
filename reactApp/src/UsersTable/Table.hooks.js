import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useSortedData = (currentPage, pageSize) => {
  const [state, setState] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [studentsCount, setStudentsCount] = useState('');

  const getSortedData = useCallback(async () => {
    const shouldUpdatePage = pageSize !== undefined;
    const url = shouldUpdatePage ? `http://localhost:3000/students2?currentPag=${currentPage}&pageSize=${pageSize}` : 'http://localhost:3000/students2';

    try {
      const response = await axios.get(url);
      setState(response.data.items);
      setOriginalData(response.data.items);
      setStudentsCount(response.data.totalPages > 3 ? response.data.totalPages : 3);
      localStorage.setItem('totalPages', response.data.totalPages > 3 ? response.data.totalPages : 3);
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    getSortedData();
  }, [getSortedData]);

  return { state, setState, originalData, studentsCount, setStudentsCount, getSortedData };
};

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    const isAdmin = localStorage.getItem('adminAuthentication') ? true : false;
    const user = isAdmin ? 'admin' : 'student';
    const userAuthenticationToken = `${user}Authentication`;
    const userAuthentication = localStorage.getItem(userAuthenticationToken);
    const isAdminAuthentication = user === 'admin' ? { authentication: userAuthentication } : { table: 'students2', authentication: userAuthentication };

    axios.post('http://localhost:3000/remove/authentication', isAdminAuthentication).then((res) => {
      if (res.data === 200) {
        localStorage.removeItem(userAuthenticationToken);
        navigate('/');
      }
    });
  }, [navigate]);

  return handleLogout;
};
