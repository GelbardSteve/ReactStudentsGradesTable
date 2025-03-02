import { LinearProgress } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditUserModal } from '../../UsersActionsModal/EditUserModal';
import { useDeleteUser } from '../../UsersActionsModal/UserActionsModal.hooks';
import { Button } from '../Buttons/Button';
import { Favorites } from '../Favorites/Favorites';
import { useUpdateFavorites } from '../Favorites/Favorites.hooks';
import { Pagination } from '../Pagination/pagination';
import { usePagesCount } from '../Pagination/pagination.hooks';
import { SearchInput } from '../Search/Search';
import { removeUser, setFavorites } from '../store/actions/manageData';
import { TableActionWrapper } from './Table.styles';


export const Table = ({
  state,
  setTableState,
  handleColumnHeaderClick,
  isLoading,
  setSearch,
  setIsModalOpen,
  handleDelete,
  handleUpdateTable,
  paginationProps,
  originalState,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Initialize as null
  const [deletingUserId, setDeletingUserId] = useState(null); // Track the user being deleted
  const userRole = useSelector((state) => state.role.roles);
  const permission = userRole === 'admin';
  const allUsers = useSelector((state) => state.manageData.allUsers);
  const renderedUsers = useSelector((state) => state.manageData.users);
  const pages = usePagesCount(allUsers, paginationProps?.pageSize)
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setTableState?.((prevState) =>
      prevState.map((user) => ({
        ...user,
        favorites: allUsers.find((u) => u.students_number === user.students_number)?.favorites || false
      }))
    );
  }, [renderedUsers, setTableState, allUsers]);

  const dispatch = useDispatch();

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
    async (e) => {
      const { value } = e.target;

      if (value !== '') {
        setSearch(value)
        setSearchQuery(value)
      } else {
        setSearch('')
        setSearchQuery('')    
      }
    },
    [setSearch]
  );
  
  
  

  const onSuccessDelete = (data) => {
    handleDelete(data);
    setDeletingUserId(null);
    setTableState((pre) => pre?.filter(user => user.students_id !== data.students_id))
  }

  const { mutate: onUserDelete } = useDeleteUser(onSuccessDelete);

  const handleDeleteUser = (data) => {
    dispatch(removeUser(data.students_number));

    setDeletingUserId(data.students_id); // Set deleting user ID before calling delete
    onUserDelete(data);
  };

  const handleFavoriteToggle = useCallback((students_number, favorites) => {
    dispatch(setFavorites({ students_number, favorites }));

  // Correctly update the local table state
  setTableState((prevState) => 
    prevState.map((u) => 
      u.students_number === students_number ? { ...u, favorites } : u
    )
  );

  
  }, [dispatch, setTableState]);

  const { mutate: toggleFavorite, isLoading: isFavortiesLoading } = useUpdateFavorites(handleFavoriteToggle)

  const handleState = state;
  const isPageChange = ((state?.length === 0 || state?.length === 4) && searchQuery === '' && pages.length !== 0) || isLoading;

  return (
    <div className="m-4">
      {permission && (
        <TableActionWrapper>
          <Button onClick={openModal} buttonType="outline-primary">
            {'Create new user'}
          </Button>
          <SearchInput
          isDisabled={handleState.length === 0} // Disable the input if there are no users
  handleSearchDara={handleSearchInputChange} 
/>
        </TableActionWrapper>
      )}
      <div
  className="table-responsive"
  style={{ height: '280px', overflowY: 'auto' }}
>
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
  {isPageChange ? (
    <tr>
      <td colSpan={permission ? 6 : 3} style={{ padding: 0 }}>
        <LinearProgress style={{ width: "100%" }} />
      </td>
    </tr>
  ) : (
    handleState?.map((user) => (
      <React.Fragment key={user?.students_id}>
        {selectedStudentId === user?.students_id && (
          <EditUserModal
            handleUpdateTable={handleUpdateTable}
            user={user}
            isModalOpen={true}
            closeModal={closeEditModal}
            setTableState={setTableState}
          />
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
    onClick={() => handleDeleteUser(user)}
    buttonType="outline-danger"
    disabled={deletingUserId !== null && deletingUserId !== user?.students_id} // Disable all delete buttons when a delete is in progress
    isLoading={deletingUserId === user?.students_id}
  >
    {'Delete'}
  </Button>
</td>
              <td>
                <Favorites
                  allUsers={allUsers}
                  user={user}
                  toggleFavorite={toggleFavorite}
                  isLoading={isFavortiesLoading}
                />
              </td>
            </>
          )}
        </tr>
      </React.Fragment>
    ))
  )}
</tbody>

      </table>

</div>
   
      {paginationProps && paginationProps.studentsCount > 0 && (
        <Pagination searchQuery={searchQuery} isTableChanged={state?.length === 4} itemsCount={paginationProps.studentsCount} pageSize={paginationProps.pageSize} currentPage={paginationProps.currentPage} onPageChange={paginationProps.handlePageChange} />
      )}
    </div>
  );
};
