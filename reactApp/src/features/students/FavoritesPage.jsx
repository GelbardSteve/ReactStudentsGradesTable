import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { EditUserModal } from './EditUserModal';
import { FavoriteButton } from './FavoriteButton';
import {
    ActionButtons,
    Avatar,
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

// Muted colours that each read well behind white initials
const ACCENT_COLORS = ['#3498db', '#16a085', '#8e44ad', '#d35400', '#c0392b', '#27ae60', '#34495e', '#b7950b'];

// Picked from the id, so a student keeps the same colour between visits
const accentFor = (id) => ACCENT_COLORS[id % ACCENT_COLORS.length];

const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

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
              <FavoriteCard key={id} $accent={accentFor(id)}>
                <CardHeader>
                  <Avatar $accent={accentFor(id)} aria-hidden="true">
                    {initialsOf(name)}
                  </Avatar>
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
