import React from 'react';
import { SearchInput } from '../Search/Search';
import { EditUserModal } from '../../UsersActionsModal/EditUserModal';
import { Button } from '../Buttons/Button';
import { Pagination } from '../Pagination/pagination';
import { Favorites } from '../Favorites/Favorites';

export const Table = ({
  state,
  handleUpdateTable,
  handleSearchInputChange,
  handleColumnHeaderClick,
  handleCreate,
  handleDelete,
  openModal,
  openEditModal,
  closeEditModal,
  paginationProps,
  selectedStudentId,
  permission,
}) => {
  const containerClass = {
    display: 'flex',
    alignItems: 'center',
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
          {state?.map((user) => {
            return (
              <React.Fragment key={user?.students_id}>
                {selectedStudentId === user?.students_id && ( // Show modal only for the selected student ID
                  <EditUserModal handleUpdateTable={handleUpdateTable} user={user} isModalOpen={true} closeModal={closeEditModal} onCreate={handleCreate} />
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
                        <Button onClick={() => handleDelete(user)} buttonType="outline-danger">
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
      {paginationProps && paginationProps.studentsCount > 0 && (
        <Pagination itemsCount={paginationProps.studentsCount} pageSize={paginationProps.pageSize} currentPage={paginationProps.currentPage} onPageChange={paginationProps.handlePageChange} />
      )}
    </div>
  );
};
