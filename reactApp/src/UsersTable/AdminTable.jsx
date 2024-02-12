import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from '../Components/Table/Table';
import { useNavigate } from 'react-router-dom';
import { orderBy } from 'lodash';
import { AddUserModal } from '../UsersActionsModal/AddUserModal';
import { LogOutButton } from '../Components/Buttons/LogOutButton';

export const AdminTable = () => {
  const navigate = useNavigate();
  const getTotalPageFromLocalStorage = localStorage.getItem('totalPages');
  const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('inputValue')) || 1);
  const [pageSize] = useState(3);
  const [studentsCount, setStudentsCount] = useState(getTotalPageFromLocalStorage);
  const [state, setState] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Initialize as null
  const [sortedColumn, setSortedColumn] = useState('asc'); // Initialize as 'asc'
  const [originalData, setOriginalData] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const closeEditModal = () => {
    setSelectedStudentId(null);
  };

  const getSortedData = useCallback(async () => {
    await axios
      .get(`http://localhost:3000/students2?currentPag=${currentPage}&pageSize=${pageSize}`)
      .then((response) => {
        setState(response.data.items);
        setOriginalData(response.data.items);
        setStudentsCount(response.data.totalPages > 3 ? response.data.totalPages : 3);
        return response;
      })
      .then((response) => {
        localStorage.setItem('totalPages', response.data.totalPages > 3 ? response.data.totalPages : 3);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setState(false);
      });
  }, [currentPage, pageSize]);

  useEffect(() => {
    const userAuthentication = localStorage.getItem('adminAuthentication');
    axios.post('http://localhost:3000/login/authentication', { authentication: userAuthentication }).then((res) => {
      if (res.data !== 401) {
        getSortedData();
      } else {
        navigate('/');
      }
    });
  }, [getSortedData, navigate]);

  const handleColumnHeaderClick = (column) => {
    const sortedData = [...state];
    const sortedState = orderBy(sortedData, [column], [sortedColumn]);
    const howToSort = sortedColumn === 'asc' ? 'desc' : 'asc';

    setState(sortedState);
    setSortedColumn(howToSort);
  };

  const handlePageChange = useCallback(
    async (page) => {
      setCurrentPage(page);
      localStorage.setItem('inputValue', page);
    },
    [setCurrentPage]
  );

  const handleDelete = useCallback(() => {
    if (state.length === 1) {
      const newPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
      handlePageChange(newPage);
    }
    getSortedData();
  }, [getSortedData, state, currentPage, handlePageChange]);

  const handleUpdateTable = useCallback((updatedUser) => {
    setState(prevState => prevState.map(user => user.students_id === updatedUser.students_id ? updatedUser : user));
  }, []);

  const handleCreate = useCallback(
    async (data) => {
      // Add the new student to the list
      setState((prevState) => [...prevState, data]);

      // Check if we need to update pagination
      if (state.length >= pageSize) {
        const pagesCount = Math.ceil((studentsCount + 1) / pageSize);

        setCurrentPage(pagesCount);
        localStorage.setItem('inputValue', pagesCount);
        // Update the total number of pages and save it to localStorage
        setStudentsCount(studentsCount + 1);
        localStorage.setItem('totalPages', studentsCount + 1);
      } else if (state.length <= 2 && state.length < pageSize) {
        // If we don't need to update pagination, simply increment the studentsCount
        setStudentsCount(studentsCount);
        localStorage.setItem('totalPages', studentsCount);
      } else {
        console.log('state.length', state.length);
        console.log('pageSize', pageSize);
        // If we don't need to update pagination, simply increment the studentsCount
        setStudentsCount(studentsCount + 1);
        localStorage.setItem('totalPages', studentsCount + 1);
      }
    },
    [pageSize, state, studentsCount]
  );

  const handleSearchInputChange = useCallback(
    async (e, setFormData) => {
      const { name, value } = e.target;
      const studentSearch = value ? await axios.get(`http://localhost:3000/students2/search/${value}`) : '';

      studentSearch.data !== 'NotFound' && value !== '' ? setState(studentSearch.data) : setState(originalData); // Reset state to original data

      setFormData({
        ...setFormData,
        [name]: value,
      });
    },
    [setState, originalData]
  );

  const handleLogOut = useCallback(() => {
    const userAuthentication = localStorage.getItem('adminAuthentication');
    axios.post('http://localhost:3000/remove/authentication', { authentication: userAuthentication }).then((res) => {
      if (res.data === 200) {
        localStorage.removeItem('adminAuthentication');
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <>
      <AddUserModal isModalOpen={isModalOpen} closeModal={closeModal} onCreate={handleCreate} />
      <LogOutButton handleLogOut={handleLogOut} />
      <Table
        handleUpdateTable={handleUpdateTable}
        tableData={state}
        setState={setState}
        permission={true}
        openModal={openModal}
        handleSearchInputChange={handleSearchInputChange}
        handleColumnHeaderClick={handleColumnHeaderClick}
        selectedStudentId={selectedStudentId}
        closeEditModal={closeEditModal}
        handleCreate={handleCreate}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
        studentsCount={studentsCount}
        pageSize={pageSize}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </>
  );
};
