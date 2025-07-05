import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../Components/Table/Table';
import { useAuth } from '../hooks/useAuth';
import { TableWrapper } from './Table.styles';

export const StudentTable = () => {
  const { studentData, userRole, verifyAuth } = useAuth();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('students_number');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await verifyAuth(false); // false means not from login page
      } catch (error) {
        console.error('Auth check error:', error);
        // Don't redirect on network errors to prevent infinite loops
        if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
          console.log('Network error detected, skipping auth check');
          return;
        }
      }
    };
    
    // Always check auth on mount, regardless of userRole
    checkAuth();
  }, []); // Empty dependency array to run only on mount

  // Check if user has permission to access student table
  useEffect(() => {
    if (userRole && userRole !== 'student') {
      console.log('User is not student, redirecting to appropriate page');
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
