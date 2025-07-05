import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useStudents } from '../../hooks/useStudents';
import { EditUserModal } from '../../UsersActionsModal/EditUserModal';
import { Button } from '../Buttons/Button';
import { EmptyPage } from '../EmptyPage/Empty';
import { Favorites } from './Favorites';
import {
    ActionButtons,
    CardHeader,
    EmptyState,
    FavoriteCard,
    FavoritesGrid,
    FavoritesHeader,
    GradesInfo,
    StudentName,
    StudentNumber,
    StyleFavoritesContainer
} from './Favorites.styles';

export const FavoritesPage = () => {
  const { allStudents, deleteStudent } = useStudents();
  const { userRole, verifyAuth } = useAuth();
  const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  useEffect(() => {
    setFavoriteUsers(allStudents.filter((user) => user.favorites === 1 || user.favorites === true));
  }, [allStudents]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (students_id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(students_id);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      // The update is handled by the EditUserModal
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  // Check if user has permission to access favorites
  if (userRole !== 'admin') {
    return <EmptyPage text="Access denied" />;
  }

  return (
    <StyleFavoritesContainer>
      <FavoritesHeader>
        <h1>⭐ Favorites</h1>
        <p>Your favorite students at a glance</p>
      </FavoritesHeader>

      {favoriteUsers.length > 0 ? (
        <FavoritesGrid>
          {favoriteUsers.map((user) => {
            const { students_name, students_number, studentsGrades, students_id } = user;

            return (
              <FavoriteCard key={students_number}>
                <CardHeader>
                  <StudentName>{students_name}</StudentName>
                  <Favorites user={user} />
                </CardHeader>
                
                <StudentNumber>
                  Student {students_number}
                </StudentNumber>
                
                <GradesInfo>
                  <h4>Academic Information</h4>
                  <p>{studentsGrades || 'No grades available'}</p>
                </GradesInfo>

                <ActionButtons>
                  <Button 
                    onClick={() => handleEdit(user)} 
                    buttonType="outline-secondary"
                    title="Edit student information"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => handleDelete(students_id)}
                    buttonType="outline-danger"
                    title="Delete student"
                  >
                    Delete
                  </Button>
                </ActionButtons>
              </FavoriteCard>
            );
          })}
        </FavoritesGrid>
      ) : (
        <EmptyState>
          <h2>🌟 No Favorites Yet</h2>
          <p>Start adding students to your favorites to see them here!</p>
        </EmptyState>
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
    </StyleFavoritesContainer>
  );
};
