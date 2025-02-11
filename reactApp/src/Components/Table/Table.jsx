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


export const Table = ({
  state,
  setTableState,
  handleColumnHeaderClick,
  setIsModalOpen,
  handleDelete,
  handleUpdateTable,
  paginationProps,
  originalState
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Initialize as null
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null); // Track the user being deleted
  const userRole = useSelector((state) => state.role.roles);
  const permission = userRole === 'admin';
  const allUsers = useSelector((state) => state.manageData.users);

  useEffect(() => {
    setTableState?.((prevState) =>
      prevState.map((user) => ({
        ...user,
        favorites: allUsers.find((u) => u.students_number === user.students_number)?.favorites || false
      }))
    );
  }, [allUsers, setTableState]);

  const dispatch = useDispatch();

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
    async (e) => {
      const { value } = e.target;
  
      setSearchQuery(value);
  
      if (value !== '') {
        const studentSearch = allUsers.find((user) => {
          const studentName = user?.students_name?.toLowerCase() || '';
          const studentNumber = String(user?.students_number || '');
  
          return studentName.includes(value.toLowerCase()) || studentNumber.includes(value);
        });
  
        if (studentSearch !== undefined) {
          return setTableState([studentSearch]);
        }
      }
  
      setTableState(
        originalState.map(user => {
          const matchingUser = allUsers.find(u => u.students_number === user.students_number);
          return {
            ...user,
            favorites: matchingUser ? matchingUser.favorites : false, // Ensure it defaults to `false` if no match
          };
        })
      );      
    },
    [setTableState, allUsers, originalState]
  );
  
  
  

  const onSuccessDelete = (data) => {
    handleDelete(data);
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

    setTableState((pre) =>
      pre.map((u) =>
        u.students_number === students_number ? { ...u, favorites: favorites } : u
      )
    );
  }, [dispatch, setTableState]);

  const { mutate: toggleFavorite, isLoading: isFavortiesLoading } = useUpdateFavorites(handleFavoriteToggle)

  const handleState = state;

  return (
    <div className="m-4">
      {permission && (
        <div style={containerClass}>
          <Button onClick={openModal} buttonType="outline-primary">
            {'Create new user'}
          </Button>
          <SearchInput
          isDisabled={handleState.length === 0} // Disable the input if there are no users
  value={searchQuery} // Bind the value to the searchQuery state
  handleSearchDara={handleSearchInputChange} 
/>
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
          {handleState?.map((user) => {
            return (
              <React.Fragment key={user?.students_id}>
                {selectedStudentId === user?.students_id && ( // Show modal only for the selected student ID
                  <EditUserModal handleUpdateTable={handleUpdateTable} user={user} isModalOpen={true} closeModal={closeEditModal} setTableState={setTableState}/>
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
                          disabled={deletingUserId === user?.students_id} // Disable button after deleting
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