import React, { useCallback } from 'react';
import { EditUserModal } from '../JustTry/EditUserModal';
import { DeleteButton } from '../JustTry/DeleteButton';
import axios from 'axios';
import { SearchInput } from '../search/Search';

export const Table = ({ tableData, handleColumnHeaderClick, selectedStudentId, closeEditModal, handleCreate, openEditModal, handleDelete, setState, originalData, openModal }) => {
  const handleSearchInputChange = useCallback(
    async (e, setFormData) => {
      const { name, value } = e.target;
      const studentSearch = value ? await axios.get(`http://localhost:3000/students2/search/${value}`) : '';

      studentSearch.data !== 'NotFound' && value !== '' ? setState(studentSearch.data) : setState(originalData); // Reset state to original data

      setFormData({
        ...setFormData,
        [name]: value,
      });
    },
    [setState, originalData]
  );

  return (
    <>
      <button onClick={openModal} type="button" className="btn btn-primary">
        Create new user
      </button>
      <SearchInput handleSearchDara={handleSearchInputChange} />
      <table className="table table-hover table-fixed">
        <thead>
          <tr>
            <th scope="col" onClick={() => handleColumnHeaderClick('students_name')}>
              {'Student name'}
            </th>
            <th scope="col" onClick={() => handleColumnHeaderClick('students_number')}>
              {'Student number'}
            </th>
            <th scope="col">{'Student grades'}</th>
            <th scope="col">{'Edit user'}</th>
            <th scope="col">{'Delete user'}</th>
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
                <td>
                  <button onClick={() => openEditModal(user.students_id)} type="button" className="btn btn-primary">
                    Edit
                  </button>
                </td>
                <td>
                  <DeleteButton data={user} onDelete={handleDelete} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
};
