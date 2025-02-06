import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EditUserModal } from '../../UsersActionsModal/EditUserModal';
import { useDeleteUser } from '../../UsersActionsModal/UserActionsModal.hooks';
import { Button } from '../Buttons/Button';
import { Favorites } from '../Favorites/Favorites';
import { Pagination } from '../Pagination/pagination';
import { SearchInput } from '../Search/Search';

export const Table = ({
  state,
  originalData,
  handleColumnHeaderClick,
  setIsModalOpen,
  handleDelete,
  handleUpdateTable,
  paginationProps,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Initialize as null
  const [filteredData, setFilteredData] = useState(state);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null); // Track the user being deleted
  const userRole = useSelector((state) => state.role.roles);
  const permission = userRole === 'admin';

  useEffect(() => {
    setFilteredData(state)
  }, [state])

 
  const containerClass = {
    display: 'flex',
    alignItems: 'center',
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedStudentId(null);
    setIsModalOpen(false);  
  };
  
  
  const openEditModal = (studentId) => {
    setSelectedStudentId(studentId);
  };


  const handleSearchInputChange = useCallback(
    async (e, setFormData) => {
      const { name, value } = e.target;
      setSearchQuery(value);
      setFormData({
        ...setFormData,
        [name]: value,
      });
      
      const studentSearch = value ? await axios.get(`https://node-4-pdlj.onrender.com/students2/search/${value}`) : '';

       // If search returns no results, fall back to original data
        if (studentSearch?.data !== 'NotFound' && value !== '') {
          setFilteredData(studentSearch.data);
        } else {
          setFilteredData(originalData);
        }
    },
    [originalData]
  );

  const onSuccessDelete = (data) => {
    handleDelete(data);
  }

  const {mutate: onUserDelete} =  useDeleteUser((data) => {
    // Reset the deleting state after the delete is successful
    setDeletingUserId(null);
    onSuccessDelete(data);
  });

  const handleDeleteUser = (student) => {
    setDeletingUserId(student.students_id); // Set the user being deleted
    onUserDelete(student); // Call the delete function
  };
  
  return (
    <div className="m-4">
      {permission && (
        <div style={containerClass}>
          <Button onClick={openModal} buttonType="outline-primary">
            {'Create new user'}
          </Button>
          <SearchInput handleSearchDara={handleSearchInputChange} />
        </div>
      )}
      <table className="table table-hover table-fixed">
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} scope="col" onClick={() => handleColumnHeaderClick?.('students_name')}>
              {'Student name'}
            </th>
            <th scope="col">{'Student number'}</th>
            <th scope="col">{'Students grades | info'}</th>
            {permission && (
              <>
                <th scope="col">{'Edit Student'}</th>
                <th scope="col">{'Delete Student'}</th>
                <th scope="col">{'Add to Favorites'}</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((user) => {
            return (
              <React.Fragment key={user?.students_id}>
                {selectedStudentId === user?.students_id && ( // Show modal only for the selected student ID
                  <EditUserModal handleUpdateTable={handleUpdateTable} user={user} isModalOpen={true} closeModal={closeEditModal} />
                )}
                <tr>
                  <td>{user?.students_name}</td>
                  <td>{user?.students_number}</td>
                  <td>{user?.studentsGrades}</td>
                  {permission && (
                    <>
                      <td>
                        <Button onClick={() => openEditModal(user.students_id)} buttonType="outline-secondary">
                          {'Update'}
                        </Button>
                      </td>
                      <td>
                      <Button
                          onClick={() => handleDeleteUser(user)} // Use the modified handleDelete
                          buttonType="outline-danger"
                          isLoading={deletingUserId === user?.students_id} // Only show loading for the deleted user
                        >
                          {'Delete'}
                        </Button>
                      </td>
                      <td>
                        <Favorites user={user} />
                      </td>
                    </>
                  )}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {searchQuery === '' && paginationProps && paginationProps.studentsCount > 0 && (
        <Pagination itemsCount={paginationProps.studentsCount} pageSize={paginationProps.pageSize} currentPage={paginationProps.currentPage} onPageChange={paginationProps.handlePageChange} />
      )}
    </div>
  );
};
