import { Button } from '../../components/Button/Button';
import { FavoriteButton } from './FavoriteButton';

export const StudentsTable = ({
  data,
  onEdit,
  onDelete,
  onViewGrades,
  onSort,
  sortField,
  sortDirection,
  onHeightChange,
  currentHeight = 'auto'
}) => {

  const getSortIcon = (field) => {
    // Only show sort icons for student numbers
    if (field !== 'student_number') return '';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleHeaderClick = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
      <div className="table-responsive">
        <div className="table-controls">
          <button
            type="button"
            className="mobile-sort-btn"
            onClick={() => handleHeaderClick('student_number')}
          >
            Sort by number {getSortIcon('student_number')}
          </button>
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
                className="sortable"
                onClick={() => handleHeaderClick('student_number')}
                title="Click to sort by number"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Student Number</span>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>{getSortIcon('student_number')}</span>
                </div>
              </th>
              <th scope="col">Email</th>
              <th scope="col">
                Grades
              </th>
              <th scope="col" className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            
            {data?.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-text">No students found</div>
                </td>
              </tr>
            ) : data?.map((user) => (
                <tr key={user.id}>
                  <td data-label="Name">
                    {user.name}
                  </td>
                  <td data-label="Number">{user.student_number}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Grades">
                    {user.grades?.trim() ? (
                      <div className="row-actions grades-actions">
                        <Button onClick={() => onViewGrades(user)} buttonType="outline-primary" title="View and send grades">
                          View Grades
                        </Button>
                      </div>
                    ) : (
                      <span className="no-grades">No grades</span>
                    )}
                  </td>
                  <td className="action-cell">
                    <div className="row-actions">
                      <Button onClick={() => onEdit(user)} buttonType="outline-secondary" title="Edit student information">
                        Edit
                      </Button>
                      <Button onClick={() => onDelete(user.id)} buttonType="outline-danger" title="Delete student">
                        Delete
                      </Button>
                      <FavoriteButton user={user} />
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
        
      </div>
  );
};
