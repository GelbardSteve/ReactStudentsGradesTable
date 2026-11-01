import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { TableWrapper } from '../students/Table.styles';
import { ClassFormModal } from './ClassFormModal';
import { useClasses } from './useClasses';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');

export const ClassesTable = () => {
  const navigate = useNavigate();
  const { classes, isLoading, error, deleteClass } = useClasses();
  const [modalClass, setModalClass] = useState(null); // null = closed, {} = create, class = rename

  const openClass = (id) => navigate(`/classes/${id}`);

  const handleDelete = (classItem) => {
    const message = `Delete "${classItem.name}" and its ${classItem.student_count} student(s)?`;
    if (window.confirm(message)) {
      deleteClass(classItem.id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <TableWrapper>
      <div className="table-header">
        <h2>My Classes</h2>
        <button className="btn btn-primary" onClick={() => setModalClass({})} data-test-specifier="addClassButton">
          Add New Class
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-fixed">
          <thead>
            <tr>
              <th scope="col">Class Name</th>
              <th scope="col">Students</th>
              <th scope="col">Created</th>
              <th scope="col">Rename</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <div className="empty-icon">🏫</div>
                  <div className="empty-text">No classes yet. Create your first class to add students.</div>
                </td>
              </tr>
            ) : (
              classes.map((classItem) => (
                <tr
                  key={classItem.id}
                  className="class-row"
                  tabIndex={0}
                  onClick={() => openClass(classItem.id)}
                  onKeyDown={(e) => e.key === 'Enter' && openClass(classItem.id)}
                  style={{ cursor: 'pointer' }}
                  title="Open class"
                  data-test-specifier="classRow"
                >
                  <td>{classItem.name}</td>
                  <td>{classItem.student_count}</td>
                  <td>{formatDate(classItem.created_at)}</td>
                  {/* Stop propagation so the action buttons don't also open the class */}
                  <td onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <Button onClick={() => setModalClass(classItem)} buttonType="outline-secondary">
                      Rename
                    </Button>
                  </td>
                  <td onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <Button onClick={() => handleDelete(classItem)} buttonType="outline-danger">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalClass && (
        <ClassFormModal classItem={modalClass.id ? modalClass : null} onClose={() => setModalClass(null)} />
      )}
    </TableWrapper>
  );
};
