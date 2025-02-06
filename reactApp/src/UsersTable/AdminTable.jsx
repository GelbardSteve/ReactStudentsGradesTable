import { LinearProgress } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Table } from '../Components/Table/Table';
import { AddUserModal } from '../UsersActionsModal/AddUserModal';
import { useSortedData } from './Table.hooks';

export const AdminTable = () => {
  const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('inputValue')) || 1);
  const [pageSize] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedColumn, setSortedColumn] = useState('asc');

  const { state, originalData, studentsCount, isLoading, isError, refetch } = useSortedData(currentPage, pageSize);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleColumnHeaderClick = (column) => {
    if (!state) return; // Prevent sorting if state is empty
    const howToSort = sortedColumn === 'asc' ? 'desc' : 'asc';
    setSortedColumn(howToSort);
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    localStorage.setItem('inputValue', page);
  }, []);

  const handleDelete = useCallback(async (student) => {
        refetch();
        toast.success(`User ${student.students_name} was deleted`);
        if (state.length === 1) {
          const newPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
          handlePageChange(newPage);
        }
  }, [state, currentPage, handlePageChange, refetch]);

  const handleCreate = useCallback(
    async (data) => {
      // Check if we need to update pagination
      if (state.length >= pageSize) {
        const pagesCount = Math.ceil((studentsCount + 1) / pageSize);
        setCurrentPage(pagesCount);
        // setStudentsCount(studentsCount + 1);
      }
      toast.success(`User ${data.students_name} was added`);
      refetch(); // Refetch the data after creating a new user
    },
    [pageSize, refetch, state.length, studentsCount]
  );

  const handleUpdateTable = (userName) => {
    toast.success(`User ${userName} was updated`);
    refetch();
  }

  if (isLoading) return <LinearProgress />;
  if (isError) return <p>Error fetching data</p>;

  return (
    <>
      <AddUserModal isModalOpen={isModalOpen} closeModal={closeModal} onCreate={handleCreate} />
      <Table
        state={state}
        originalData={originalData}
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
        refetch={refetch}
      />
    </>
  );
};
