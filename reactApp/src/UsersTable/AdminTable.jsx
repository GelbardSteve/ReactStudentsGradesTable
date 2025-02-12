import { LinearProgress } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addUsers, removeUser } from '../Components/store/actions/manageData';
import { Table } from '../Components/Table/Table';
import { AddUserModal } from '../UsersActionsModal/AddUserModal';
import { useSortedData } from './Table.hooks';

export const AdminTable = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('inputValue')) || 1);
  const [pageSize] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedColumn, setSortedColumn] = useState('asc');

  const { state, setState, studentsCount, isLoading, isError, originalState, refetch } = useSortedData(currentPage, pageSize);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleColumnHeaderClick = (column) => {
    if (!state || state.length === 0) return; // Prevent sorting if state is empty
  
    const newSortOrder = sortedColumn === 'asc' ? 'desc' : 'asc';
    setSortedColumn(newSortOrder);
  
    const sortedData = [...state].sort((a, b) => {
      if (a[column] < b[column]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  
    setState(sortedData);
  };
  

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    localStorage.setItem('inputValue', page);
  }, []);

  const handleDelete = useCallback(async (student) => {
    toast.success(`User ${student.students_name} was deleted`);

    // Optimistically update local state before refetching
    setState(prevState => prevState.filter(user => user.students_name !== student.students_name));

    if (state.length === 1) {
        const newPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
        handlePageChange(newPage);
    }

    dispatch(removeUser(student.students_name));

    // Delay refetch to allow local state update to be visible
   
    if (currentPage !== studentsCount) {
      refetch();
    }
}, [setState, state.length, dispatch, currentPage, studentsCount, handlePageChange, refetch]);


  const handleCreate = useCallback(
    async (data) => {

      setState((prevState) => [...prevState, data]); // Optimistically update local state before refetching
      // Check if we need to update pagination
      if (state.length >= pageSize) {
        const pagesCount = Math.ceil((studentsCount + 1) / pageSize);
        setCurrentPage(pagesCount);
      }
      dispatch(addUsers([...originalState, data])); // Ensure users are added
      toast.success(`User ${data.students_name} was added`);
    },
    [dispatch, originalState, pageSize, setState, state.length, studentsCount]
  );

  const handleUpdateTable = (user) => {
    toast.success(`User ${user.students_name} was updated`);
  }

  if (isLoading) return <LinearProgress />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <>
      <AddUserModal isModalOpen={isModalOpen} closeModal={closeModal} onCreate={handleCreate} setTableState={setState} />
      <Table
        state={state}
        setTableState={setState}
        originalState={originalState}
        handleColumnHeaderClick={handleColumnHeaderClick}
        handleDelete={handleDelete}
        handleUpdateTable={handleUpdateTable}
        setIsModalOpen={setIsModalOpen}
        paginationProps={{
          studentsCount,
          pageSize,
          currentPage,
          handlePageChange,
        }}
      />
    </>
  );
};
