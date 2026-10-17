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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Check authentication on mount (verifyAuth is memoized and handles its own errors)
  useEffect(() => {
    verifyAuth(false);
  }, [verifyAuth]);

  const favoriteUsers = allStudents.filter((user) => user.favorites === 1 || user.favorites === true);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (students_number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(students_number);
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
            const { students_name, students_number, studentsGrades } = user;

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
                    onClick={() => handleDelete(students_number)}
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
