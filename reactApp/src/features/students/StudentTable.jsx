import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../Components/Table/Table';
import { useAuth } from '../hooks/useAuth';
import { TableWrapper } from './Table.styles';

export const StudentTable = () => {
  const { studentData, userRole, verifyAuth } = useAuth();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('students_number');
  const [sortDirection, setSortDirection] = useState('asc');

  // Check authentication on mount (verifyAuth is memoized and handles its own errors)
  useEffect(() => {
    verifyAuth(false);
  }, [verifyAuth]);

  // Check if user has permission to access student table
  useEffect(() => {
    if (userRole && userRole !== 'student') {
      if (userRole === 'admin') {
        navigate('/table');
      } else {
        navigate('/');
      }
    }
  }, [userRole, navigate]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Don't render if user is not student
  if (userRole !== 'student') {
    return null;
  }

  return (
    <TableWrapper>
      <div className="table-header">
        <h2>My Grades</h2>
      </div>

      <Table
        data={studentData || []}
        isAdmin={false}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />
    </TableWrapper>
  );
};
