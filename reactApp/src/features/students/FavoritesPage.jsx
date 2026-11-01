import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { EditUserModal } from './EditUserModal';
import { FavoriteButton } from './FavoriteButton';
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
import { useFavoriteStudents, useStudents } from './useStudents';

export const FavoritesPage = () => {
  const { favorites: favoriteUsers } = useFavoriteStudents();
  const { deleteStudent } = useStudents();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  return (
    <StyleFavoritesContainer>
      <FavoritesHeader>
        <h1>⭐ Favorites</h1>
        <p>Your favorite students at a glance</p>
      </FavoritesHeader>

      {favoriteUsers.length > 0 ? (
        <FavoritesGrid>
          {favoriteUsers.map((user) => {
            const { id, name, student_number, grades, class_name } = user;

            return (
              <FavoriteCard key={id}>
                <CardHeader>
                  <StudentName>{name}</StudentName>
                  <FavoriteButton user={user} />
                </CardHeader>
                
                <StudentNumber>
                  {class_name} · Student {student_number}
                </StudentNumber>
                
                <GradesInfo>
                  <h4>Academic Information</h4>
                  <p>{grades || 'No grades available'}</p>
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
                    onClick={() => handleDelete(id)}
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
