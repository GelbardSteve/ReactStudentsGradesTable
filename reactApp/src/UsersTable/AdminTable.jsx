import { LinearProgress } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addAllUsers, addUsers, removeUser } from '../Components/store/actions/manageData';
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
  
  const handleDelete = useCallback(
    async (id) => {
      setState((prevState) => {
        const updatedState = prevState.filter((user) => user.id !== id);
        const prevLength = prevState.length; // Get previous length before update
  
        if (prevLength === 1) {
          const newPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
          handlePageChange(newPage);
        }

        dispatch(addAllUsers(updatedState));
        return updatedState;
      });
  
      dispatch(removeUser(id));
      toast.success(`User was deleted`);
  
      // Wait for state update before checking pagination size
      await new Promise((resolve) => setTimeout(resolve, 0));
  
      if (state.length <= pageSize) {
        await refetch();
      }
    },
    [setState, dispatch, state.length, pageSize, currentPage, handlePageChange, refetch]
  );
  
  
  
  

const handleCreate = useCallback(
  async (data) => {
    setState((prevState) => {
      const updatedState = [...prevState, data]; // Ensure new user is added
      const updatedStateLength = updatedState.length;
      dispatch(addUsers(updatedState));
      dispatch(addAllUsers(updatedState));
      // If new user exceeds page size, move to the last page
      if (updatedStateLength > pageSize) {
        const pagesCount = Math.ceil((studentsCount + 1) / pageSize);
        setCurrentPage(pagesCount);
      }

      return updatedState;
    });

    toast.success(`User ${data.students_name} was added`);
  },
  [dispatch, pageSize, setState, studentsCount]
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
