import { LinearProgress } from '@mui/material';
import React from 'react';
import { Button } from '../Buttons/Button';
import { Favorites } from '../Favorites/Favorites';

export const Table = ({
  data,
  onEdit,
  onDelete,
  isAdmin,
  isLoading,
  onSort,
  sortField,
  sortDirection,
  onHeightChange,
  currentHeight = 'auto'
}) => {

  const getSortIcon = (field) => {
    // Only show sort icons for student numbers
    if (field !== 'students_number') return '';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleHeaderClick = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getRowStatus = (user) => {
    // You can add logic here to determine row status based on data
    // For example, based on grades, favorites, etc.
    if (user.favorites) return 'favorite';
    return 'normal';
  };

  return (
      <div className="table-responsive">
        <div className="table-controls">
          <div className="height-control">
            <label htmlFor="tableHeight">Table Height:</label>
            <select 
              id="tableHeight" 
              value={currentHeight}
              onChange={(e) => onHeightChange && onHeightChange(e.target.value)}
            >
              <option value="auto">Auto (Full Screen)</option>
              <option value="600px">Large (600px)</option>
              <option value="700px">Extra Large (700px)</option>
            </select>
          </div>
        </div>
        
        <table className="table table-hover table-fixed">
          <thead>
            <tr>
              <th scope="col">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Student Name</span>
                </div>
              </th>
              <th 
                scope="col" 
                onClick={() => handleHeaderClick('students_number')}
                style={{ cursor: 'pointer' }}
                title="Click to sort by number"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Student Number</span>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>{getSortIcon('students_number')}</span>
                </div>
              </th>
              <th scope="col">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Grades | Info</span>
                </div>
              </th>
              {isAdmin && (
                <>
                  <th scope="col">Edit Student</th>
                  <th scope="col">Delete Student</th>
                  <th scope="col">Add to Favorites</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            
            {isLoading ? ( 
              <tr className="loading-row">
                <td colSpan={isAdmin ? 6 : 3} style={{ padding: 0 }}>
                  <LinearProgress style={{ width: "100%" }} />
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 3} className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-text">No students found</div>
                </td>
              </tr>
            ) : data?.map((user, index) => (
              <React.Fragment key={user?.students_id || user?.students_number}>
                <tr 
                  className={`table-row ${getRowStatus(user)}`}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animation: 'fadeInUp 0.5s ease forwards'
                  }}
                >
                  <td>
                    {user?.students_name}
                  </td>
                  <td>
                    <span style={{ 
                      fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace'
                    }}>
                      {user?.students_number}
                    </span>
                  </td>
                  <td>
                    <div style={{ 
                      maxWidth: '200px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user?.studentsGrades}
                    </div>
                  </td>
                  {isAdmin && (
                    <>
                      <td>
                        <Button 
                          onClick={() => onEdit(user)} 
                          buttonType="outline-secondary"
                          title="Edit student information"
                        >
                          Update
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={() => onDelete(user.students_id)}
                          buttonType="outline-danger"
                          title="Delete student"
                        >
                          Delete
                        </Button>
                      </td>
                      <td>
                        <Favorites user={user} />
                      </td>
                    </>
                  )}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .table-row {
            opacity: 0;
          }
          
          .table-row.favorite {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.1) 100%);
          }
          
          .table-row.favorite:hover {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.15) 100%);
          }
        `}</style>
      </div>
  );
};
