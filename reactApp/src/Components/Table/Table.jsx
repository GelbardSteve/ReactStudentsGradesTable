import React from 'react';
import { LinearProgress } from '@mui/material';
import { Button } from '../Buttons/Button';
import { Favorites } from '../Favorites/Favorites';

export const Table = ({
  tableData,
  handleColumnHeaderClick,
  sortedColumn,
  openEditModal,
  handleDeleteUser,
  hasPermission,
  deletedUserId,
  isLoading
}) => {

  return (
      <div className="table-responsive" style={{ height: '380px', overflowY: 'auto' }}>
        <table className="table table-hover table-fixed">
          <thead>
            <tr>
              <th scope="col">{'Task Name'}</th>
              <th scope="col" style={{ cursor: hasPermission ? 'pointer' : '' }} onClick={() => handleColumnHeaderClick?.('students_number')}>
                Task Number {hasPermission ? sortedColumn === 'asc' ? '↓' : '↑' : ''}
              </th>
              <th scope="col">{'Task Grades | info'}</th>
              {hasPermission && (
                <>
                  <th scope="col">{'Edit Task'}</th>
                  <th scope="col">{'Delete Task'}</th>
                  <th scope="col">{'Add to Favorites'}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            
            {isLoading ? ( 
              <tr>
                <td colSpan={6} style={{ padding: 0 }}>
                  <LinearProgress style={{ width: "100%" }} />
                </td>
              </tr>
            ) : tableData?.map((user) => (
              <React.Fragment key={user?.students_id}>
                <tr>
                  <td>{user?.students_name}</td>
                  <td>{user?.students_number}</td>
                  <td>{user?.studentsGrades}</td>
                  {hasPermission && (
                    <>
                      <td>
                        <Button onClick={() => openEditModal(user)} buttonType="outline-secondary">
                          {'Update'}
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={() => handleDeleteUser(user)}
                          buttonType="outline-danger"
                          disabled={deletedUserId !== null && deletedUserId !== user?.students_id}
                          isLoading={deletedUserId === user?.students_id}
                        >
                          {'Delete'}
                        </Button>
                      </td>
                      <td>
                        <Favorites
                          user={user}
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
  );
};
