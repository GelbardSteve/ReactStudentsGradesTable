import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button } from '../Components/Buttons/Button';
import { useVerifyAuthenticationFromLoginPage } from '../Components/Login/Login.hooks';
import { Pagination } from '../Components/Pagination/pagination';
import { SearchInput } from '../Components/Search/Search';
import { addAllUsers, addUsers } from '../Components/store/actions/manageData';
import { Table } from '../Components/Table/Table';
import { AddUserModal } from '../UsersActionsModal/AddUserModal';
import { EditUserModal } from '../UsersActionsModal/EditUserModal';
import { useDeleteUser, useGetAllUsers, useModal } from './Table.hooks';
import { TableActionWrapper, TableWrapper } from './Table.styles';

export const AdminTable = () => {
  const dispatch = useDispatch();
  const numberTableRows = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedColumn, setSortedColumn] = useState('asc');
  const [searchValue, setSearchValue] = useState('');
  const [deletedUserId, setDeletedUserId] = useState(null);

  const { isCreateOpen, isEditOpen, selectedUser, openCreate, closeCreate, openEdit, closeEdit } = useModal();
  const { isLoading, error } = useGetAllUsers();
  const verifyAuthentication = useVerifyAuthenticationFromLoginPage(false);
  const { deleteUser } = useDeleteUser();

  const userRole = useSelector((state) => state.role.roles);
  const hasPermission = userRole === 'admin';
  const allUsers = useSelector((state) => state.manageData.allUsers);


  const handleColumnHeaderClick = (column) => {
    if (!allUsers || allUsers.length === 0) return; // Prevent sorting if state is empty
  
    const newSortOrder = sortedColumn === 'asc' ? 'desc' : 'asc';
    setSortedColumn(newSortOrder);
  
    const sortedData = [...allUsers].sort((a, b) => {
      if (a[column] < b[column]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    dispatch(addAllUsers(sortedData)); // Update the Redux state with sorted data
  };
  
  const tableData = useMemo(() => {
    // Start with the sorted Redux state.
    let processedUsers = [...allUsers];
  
    // Apply search filter if there's a search value.
    if (searchValue) {
      processedUsers = processedUsers.filter(user =>
        String(user.students_number || '').includes(searchValue) ||
        (user.students_name || '').toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  
    // Apply pagination on the sorted (and filtered) data.
    const startIndex = (currentPage - 1) * numberTableRows;
    return processedUsers.slice(startIndex, startIndex + numberTableRows);
  }, [allUsers, searchValue, currentPage, numberTableRows]);

  useEffect(() => {
    verifyAuthentication();
  }, [verifyAuthentication]);

  const handleSearchInputChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleDeleteUser = useCallback(
    async ({ students_id }) => {
      setDeletedUserId(students_id);
      deleteUser(students_id, {
        onSuccess: () => {
          const updatedUsers = allUsers.filter(user => user.students_id !== students_id);
          dispatch(addAllUsers(updatedUsers));
          if (tableData.filter(user => user.students_id !== students_id).length === 0 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          }
          setDeletedUserId(null);
        },
      });
    },
    [allUsers, deleteUser, dispatch, tableData, currentPage]
  );

  const handleCreate = useCallback(
    async (newUser) => {
      dispatch(addUsers([newUser]));
      dispatch(addAllUsers([...allUsers, newUser]));
    },
    [allUsers, dispatch]
  );

  const handleUpdateTable = useCallback((updatedUser) => {
    const updatedAllUsers = allUsers.map(user =>
      user.students_id === updatedUser.students_id ? updatedUser : user
    );
    dispatch(addAllUsers(updatedAllUsers));
    toast.success(`User ${updatedUser.students_name} was updated`);
  }, [allUsers, dispatch]);

  if (error) {
    return <h1 className='text-danger'>{error.message}</h1>
  }

  return (
    <TableWrapper>
      <AddUserModal isModalOpen={isCreateOpen} closeModal={closeCreate} onCreate={handleCreate} />
      {selectedUser && (
        <EditUserModal handleUpdateTable={handleUpdateTable} user={selectedUser} isModalOpen={isEditOpen} closeModal={closeEdit} />
      )}
      {hasPermission && (
        <TableActionWrapper>
          <Button onClick={openCreate} buttonType="outline-primary">
            Create New Task
          </Button>
          <SearchInput handleSearchDara={handleSearchInputChange} />
        </TableActionWrapper>
      )}
      <Table
        tableData={tableData}
        handleColumnHeaderClick={handleColumnHeaderClick}
        sortedColumn={sortedColumn}
        openEditModal={openEdit}
        handleDeleteUser={handleDeleteUser}
        isEditUserModalOpen={isEditOpen}
        hasPermission={hasPermission}
        deletedUserId={deletedUserId}
        isLoading={isLoading}
      />
      {tableData.length > 0 && !searchValue && (
        <Pagination numberOfRows={numberTableRows} currentPage={currentPage} onPageChange={handlePageChange}/>
      )}
    </TableWrapper>
  );
};
