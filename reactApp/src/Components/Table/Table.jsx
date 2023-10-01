import React from 'react';
import { SearchInput } from '../Search/Search';
import { EditUserModal } from '../../UsersActionsModal/EditUserModal';
import { DeleteButton } from '../Buttons/DeleteButton';
import { EditButton } from '../Buttons/EditButton';
import { CreateNewUser } from '../Buttons/CreateNewUser';
import { Pagination } from '../Pagination/pagination';

export const Table = ({
  tableData,
  permission,
  openModal,
  handleSearchInputChange,
  handleColumnHeaderClick,
  selectedStudentId,
  closeEditModal,
  handleCreate,
  openEditModal,
  handleDelete,
  studentsCount,
  pageSize,
  currentPage,
  handlePageChange,
}) => {
  return (
    <div className="m-4">
      {permission && (
        <>
          <CreateNewUser openModal={openModal} />
          <SearchInput handleSearchDara={handleSearchInputChange} />
        </>
      )}
      <table className="table table-hover table-fixed">
        <thead>
          <tr>
            <th scope="col" onClick={() => handleColumnHeaderClick('students_name')}>
              {'Student name'}
            </th>
            <th scope="col">{'Student number'}</th>
            <th scope="col">{'Student grades'}</th>
            {permission && (
              <>
                <th scope="col">{'Edit user'}</th>
                <th scope="col">{'Delete user'}</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {tableData.map((user) => (
            <React.Fragment key={user.students_id}>
              {selectedStudentId === user.students_id && ( // Show modal only for the selected student ID
                <EditUserModal user={user} isModalOpen={true} closeModal={closeEditModal} onCreate={handleCreate} />
              )}
              <tr>
                <td>{user.students_name}</td>
                <td>{user.students_number}</td>
                <td>{user.studentsGrades}</td>
                {permission && (
                  <>
                    <td>
                      <EditButton user={user} openEditModal={openEditModal} />
                    </td>
                    <td>
                      <DeleteButton data={user} onDelete={handleDelete} />
                    </td>
                  </>
                )}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {studentsCount && <Pagination itemsCount={studentsCount} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange} />}
    </div>
  );
};
