import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditUserModal } from '../../UsersActionsModal/EditUserModal';
import { useDeleteUser } from '../../UsersActionsModal/UserActionsModal.hooks';
import { Button } from '../Buttons/Button';
import { Favorites } from '../Favorites/Favorites';
import { useUpdateFavorites } from '../Favorites/Favorites.hooks';
import { Pagination } from '../Pagination/pagination';
import { SearchInput } from '../Search/Search';
import { removeUser, setFavorites } from '../store/actions/manageData';
import { TableActionWrapper } from './Table.styles';

export const Table = ({
  state,
  handleColumnHeaderClick,
  setSearch,
  setIsModalOpen,
  handleDelete,
  handleUpdateTable,
  paginationProps,
  showStudentFrom,
  showStudentTo
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const userRole = useSelector((state) => state.role.roles);
  const permission = userRole === 'admin';
  const allUsers = useSelector((state) => state.manageData.allUsers);

  useEffect(() => {
    // Sync table data with external state when users change
      state?.map((user) => ({
        ...user,
        favorites: allUsers.find((u) => u.students_number === user.students_number)?.favorites || false
      }))
  }, [state, allUsers]);

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
    (e) => {
      const { value } = e.target;
      setSearch(value);
      setSearchQuery(value);
    },
    [setSearch]
  );

  const onSuccessDelete = (data) => {
    handleDelete(data);
    setDeletingUserId(null);
  };

  const { mutate: onUserDelete } = useDeleteUser(onSuccessDelete);

  const handleDeleteUser = (data) => {
    dispatch(removeUser(data.students_number));
    setDeletingUserId(data.students_id);
    onUserDelete(data);
  };

  const handleFavoriteToggle = useCallback(
    (students_number, favorites) => {
      dispatch(setFavorites({ students_number, favorites }));
    },
    [dispatch]
  );

  const { mutate: toggleFavorite, isLoading: isFavoritesLoading } = useUpdateFavorites(handleFavoriteToggle);

  const filteredState = state?.length > 1 && searchQuery === '' ? state.slice(showStudentFrom, showStudentTo) : state;

  return (
    <div className="m-4">
      {permission && (
        <TableActionWrapper>
          <Button onClick={openModal} buttonType="outline-primary">
            {'Create new user'}
          </Button>
          <SearchInput isDisabled={filteredState.length === 0} handleSearchDara={handleSearchInputChange} />
        </TableActionWrapper>
      )}
      <div className="table-responsive" style={{ height: '280px', overflowY: 'auto' }}>
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
            {filteredState?.map((user) => (
              <React.Fragment key={user?.students_id}>
                {selectedStudentId === user?.students_id && (
                  <EditUserModal
                    handleUpdateTable={handleUpdateTable}
                    user={user}
                    isModalOpen={true}
                    closeModal={closeEditModal}
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
                          disabled={deletingUserId !== null && deletingUserId !== user?.students_id}
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
                          isLoading={isFavoritesLoading}
                        />
                      </td>
                    </>
                  )}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {paginationProps && paginationProps.studentsCount > 0 && (
        <Pagination
          handleState={filteredState}
          searchQuery={searchQuery}
          itemsCount={paginationProps.studentsCount}
          pageSize={paginationProps.pageSize}
          currentPage={paginationProps.currentPage}
          onPageChange={paginationProps.handlePageChange}
        />
      )}
    </div>
  );
};