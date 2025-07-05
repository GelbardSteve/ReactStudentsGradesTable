import React, { useCallback } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { StyledFavoritesButton } from './Favorites.styles';

export const Favorites = ({ user }) => {
  const { updateFavorites, isUpdatingFavorites } = useStudents();

  const handleUserFavorites = useCallback(() => {
    updateFavorites({
      students_number: user.students_number,
      favorites: !user.favorites, // Toggle the favorite status
    });
  }, [user.students_number, user.favorites, updateFavorites]);

  if (isUpdatingFavorites) {
    return (
      <StyledFavoritesButton disabled>
        <i className="fas fa-spinner fa-spin"></i>
      </StyledFavoritesButton>
    );
  }

  return (
    <StyledFavoritesButton
      onClick={handleUserFavorites}
      title={user.favorites ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`fa-${user.favorites ? 'solid' : 'regular'} fa-star`}></i>
    </StyledFavoritesButton>
  );
};