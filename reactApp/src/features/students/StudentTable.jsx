import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { StudentsTable } from './StudentsTable';
import { TableWrapper } from './Table.styles';

export const StudentTable = () => {
  const { studentData } = useAuth();
  const [sortField, setSortField] = useState('students_number');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <TableWrapper>
      <div className="table-header">
        <h2>My Grades</h2>
      </div>

      <StudentsTable
        data={studentData || []}
        isAdmin={false}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />
    </TableWrapper>
  );
};
