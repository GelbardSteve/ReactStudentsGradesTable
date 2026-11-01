import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pagination } from '../../components/Pagination/Pagination';
import { SearchInput } from '../../components/Search/Search';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { StudentsTable } from './StudentsTable';
import { TableWrapper } from './Table.styles';
import { useClass } from '../classes/useClasses';
import { useStudents } from './useStudents';

const ITEMS_PER_PAGE = 10;

export const ClassStudentsTable = () => {
  const classId = Number(useParams().classId);
  const { data: classItem, error: classError } = useClass(classId);
  const { allStudents, isLoading, error, deleteStudent, sendGrades, sendingGradesId } = useStudents(classId);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [tableHeight, setTableHeight] = useState(() => {
    // Get saved height from localStorage or use default
    const savedHeight = localStorage.getItem('tableHeight');
    return savedHeight || 'auto';
  });

  // Calculate filtered and sorted data using useMemo to prevent infinite loops
  const filteredData = useMemo(() => {
    if (!allStudents) return [];
    
    let filtered = allStudents.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_number.toString().includes(searchTerm)
    );

    // Apply sorting only for student numbers
    const direction = sortDirection === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const aValue = parseInt(a.student_number, 10) || 0;
      const bValue = parseInt(b.student_number, 10) || 0;
      return (aValue - bValue) * direction;
    });

    return filtered;
  }, [allStudents, searchTerm, sortDirection]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const handleSendGrades = (student) => {
    if (window.confirm(`Email ${student.name}'s grades to ${student.email}?`)) {
      sendGrades(student);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    // Only allow sorting by student numbers
    if (field === 'student_number') {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const handleHeightChange = (height) => {
    setTableHeight(height);
    // Save height preference to localStorage
    localStorage.setItem('tableHeight', height);
  };

  // Keep the page in range when the list shrinks (e.g. deleting the last row on the last page)
  const pageCount = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, pageCount);

  const indexOfLastItem = activePage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 404 means the class doesn't exist or belongs to another admin
  if (classError || error) {
    return (
      <div>
        <p>Error: {(classError || error).response?.status === 404 ? 'Class not found' : (classError || error).message}</p>
        <Link to="/classes">Back to classes</Link>
      </div>
    );
  }

  return (
    <TableWrapper style={{ '--table-height': tableHeight }}>
      <div className="table-header">
        <div>
          <Link to="/classes" data-test-specifier="backToClasses">← All classes</Link>
          <h2>{classItem?.name ?? 'Class'} · Students</h2>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
          data-test-specifier="addStudentButton"
        >
          Add New Student
        </button>
      </div>

      <div className="table-controls">
        <SearchInput 
          value={searchTerm}
          onSearchChange={(e) => handleSearch(e.target.value)}
          isDisabled={false}
          totalResults={allStudents?.length || 0}
          filteredResults={filteredData.length}
        />
      </div>

      <StudentsTable
        data={currentItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSendGrades={handleSendGrades}
        sendingGradesId={sendingGradesId}
        onSort={handleSort}
        sortField="student_number"
        sortDirection={sortDirection}
        onHeightChange={handleHeightChange}
        currentHeight={tableHeight}
      />

      <div className="pagination-container">
        <Pagination
          numberOfRows={ITEMS_PER_PAGE}
          currentPage={activePage}
          onPageChange={handlePageChange}
          totalItems={filteredData.length}
        />
      </div>

      {showAddModal && (
        <AddUserModal
          classId={classId}
          existingStudents={allStudents}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </TableWrapper>
  );
};
