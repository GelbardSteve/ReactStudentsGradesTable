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
  const containerClass = {
    display: "flex",
    alignItems: "center"
  }


  return (
    <div className="m-4">
      {permission && (
        <div style={containerClass}>
          <CreateNewUser openModal={openModal} />
          <SearchInput handleSearchDara={handleSearchInputChange} />
        </div>
      )}
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col align-middle" onClick={() => handleColumnHeaderClick('students_name')}>
              {'Student name'}
            </th>
            <th scope="col align-middle">{'Student number'}</th>
            <th scope="col align-middle">{'Students grades | info'}</th>
            {permission && (
              <>
                <th scope="col align-middle">{'Edit user'}</th>
                <th scope="col align-middle">{'Delete user'}</th>
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
                <td className='align-middle'>{user.students_name}</td>
                <td className='align-middle'>{user.students_number}</td>
                <td className='align-middle w-50'>{user.studentsGrades}</td>
                {permission && (
                  <>
                    <td className='align-middle'>
                      <EditButton user={user} openEditModal={openEditModal} />
                    </td>
                    <td className='align-middle'>
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
