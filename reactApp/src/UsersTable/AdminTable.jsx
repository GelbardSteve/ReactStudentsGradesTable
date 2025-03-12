import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useVerifyAuthenticationFromLoginPage } from '../Components/Login/Login.hooks';
import { usePagesCount } from '../Components/Pagination/pagination.hooks';
import { addAllUsers, addUsers, removeAllUsers, removeUser } from '../Components/store/actions/manageData';
import { Table } from '../Components/Table/Table';
import { AddUserModal } from '../UsersActionsModal/AddUserModal';

export const AdminTable = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedColumn, setSortedColumn] = useState('asc');
  const verifyAuthentication = useVerifyAuthenticationFromLoginPage(false);
  const allUsers = useSelector((state) => state.manageData.allUsers);  
  const [search, setSearch] = useState('');
  const [showStudentFrom, setShowStudentFrom] = useState(0);
  const [showStudentTo, setShowStudentTo] = useState(3);
  const { pages } = usePagesCount(allUsers, pageSize);

  useEffect(() => {
    verifyAuthentication();
  }, [verifyAuthentication]);
  
  const filteredData = useMemo(() => {
    const changeAllUsersToArray = Array.isArray(allUsers) ? allUsers : [allUsers];
    const filteredUsers = changeAllUsersToArray?.filter(user => allUsers.find(u => u.students_number === user.students_number));
    if (!search) return  filteredUsers;
  
    const results = allUsers?.filter(item =>
      item.students_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(item.students_number)?.toLowerCase().includes(search.toLowerCase())
    );
   
    return results.length > 0 ? results : filteredUsers;
  }, [allUsers, search]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleColumnHeaderClick = (column) => {
    if (!allUsers || allUsers.length === 0) return; // Prevent sorting if state is empty
  
    const newSortOrder = sortedColumn === 'asc' ? 'desc' : 'asc';
    setSortedColumn(newSortOrder);
  
    return [...allUsers].sort((a, b) => {
      if (a[column] < b[column]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handlePageChange = useCallback((page) => {
    setShowStudentFrom((page - 1) * pageSize);
    setShowStudentTo(((page - 1) * pageSize) + pageSize);
    setCurrentPage(page);
  }, [pageSize]);
  
  const handleDelete = useCallback(
    async (id) => {
        const updatedState = allUsers.filter((user) => user.students_number !== id.students_number);
        const newPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
        const newPagesCount = Math.ceil(updatedState.length / pageSize);
       
        if (newPagesCount !== pages.length) handlePageChange(newPage);
       
        dispatch(removeUser(id));
        dispatch(removeAllUsers(id))
    },
    [allUsers, currentPage, pageSize, pages, handlePageChange, dispatch]
  );

const handleCreate = useCallback(
  async (data) => {
      const updatedState = [...allUsers, data]; // Ensure new user is added
      dispatch(addUsers([data])); // Dispatch only the new user
      dispatch(addAllUsers([...allUsers, data])); // Append to existing users in Redux
 
      const newPagesCount = Math.ceil(updatedState.length / pageSize);
    
      // If new user exceeds page size, move to the last page
      if (newPagesCount > pages.length) {
          handlePageChange(newPagesCount);
      }

    toast.success(`User ${allUsers.students_name} was added`);
  },
  [allUsers, dispatch, pages.length, pageSize, handlePageChange]
);


  const handleUpdateTable = (user) => {
    toast.success(`User ${user.students_name} was updated`);
  }

  return (
    <>
      <AddUserModal isModalOpen={isModalOpen} closeModal={closeModal} onCreate={handleCreate} />
      <Table
        showStudentFrom={showStudentFrom}
        setShowStudentFrom={setShowStudentFrom}
        showStudentTo={showStudentTo}
        setShowStudentTo={setShowStudentTo}
        state={filteredData}
        setSearch={setSearch}
        handleColumnHeaderClick={handleColumnHeaderClick}
        handleDelete={handleDelete}
        handleUpdateTable={handleUpdateTable}
        setIsModalOpen={setIsModalOpen}
        paginationProps={{
          studentsCount: allUsers.length,
          pageSize,
          currentPage,
          handlePageChange,
        }}
      />
    </>
  );
};