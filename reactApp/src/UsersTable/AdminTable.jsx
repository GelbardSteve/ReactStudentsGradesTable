import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../Components/Pagination/pagination';
import { SearchInput } from '../Components/Search/Search';
import { Table } from '../Components/Table/Table';
import { useAuth } from '../hooks/useAuth';
import { useStudents } from '../hooks/useStudents';
import { AddUserModal } from '../UsersActionsModal/AddUserModal';
import { EditUserModal } from '../UsersActionsModal/EditUserModal';
import { TableWrapper } from './Table.styles';

export const AdminTable = () => {
  const { allStudents, isLoading, error, updateStudent, deleteStudent } = useStudents();
  const { userRole, verifyAuth } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [tableHeight, setTableHeight] = useState(() => {
    // Get saved height from localStorage or use default
    const savedHeight = localStorage.getItem('tableHeight');
    return savedHeight || 'auto';
  });

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

  // Check if user has permission to access admin table
  useEffect(() => {
    if (userRole && userRole !== 'admin') {
      console.log('User is not admin, redirecting to appropriate page');
      if (userRole === 'student') {
        navigate('/studentTable');
      } else {
        navigate('/');
      }
    }
  }, [userRole, navigate]);

  // Calculate filtered and sorted data using useMemo to prevent infinite loops
  const filteredData = useMemo(() => {
    if (!allStudents) return [];
    
    let filtered = allStudents.filter((student) =>
      student.students_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.students_number.toString().includes(searchTerm)
    );

    // Apply sorting only for student numbers
    filtered.sort((a, b) => {
      const aValue = parseInt(a.students_number) || 0;
      const bValue = parseInt(b.students_number) || 0;

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [allStudents, searchTerm, sortDirection]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (students_number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(students_number);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
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
    if (field === 'students_number') {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const handleHeightChange = (height) => {
    setTableHeight(height);
    // Save height preference to localStorage
    localStorage.setItem('tableHeight', height);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  console.log('AdminTable Debug:', {
    allStudentsLength: allStudents?.length || 0,
    filteredDataLength: filteredData.length,
    currentPage,
    itemsPerPage,
    indexOfFirstItem,
    indexOfLastItem,
    currentItemsLength: currentItems.length
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Don't render if user is not admin
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <TableWrapper style={{ '--table-height': tableHeight }}>
      <div className="table-header">
        <h2>Students Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
        >
          Add New Student
        </button>
      </div>

      <div className="table-controls">
        <SearchInput 
          value={searchTerm}
          handleSearchDara={(e) => handleSearch(e.target.value)}
          isDisabled={false}
          totalResults={allStudents?.length || 0}
          filteredResults={filteredData.length}
        />
      </div>

      <Table
        data={currentItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={true}
        isLoading={isLoading}
        onSort={handleSort}
        sortField="students_number"
        sortDirection={sortDirection}
        onHeightChange={handleHeightChange}
        currentHeight={tableHeight}
      />

      <div className="pagination-container">
        <Pagination
          numberOfRows={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={filteredData.length}
        />
      </div>

      {showAddModal && (
        <AddUserModal
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
