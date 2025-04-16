import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../Buttons/Button';
import { setFavorites } from '../store/actions/manageData';
import { useUpdateFavorites } from './Favorites.hooks';

export const Favorites = ({ user }) => {
  const dispatch = useDispatch();

  const handleFavoriteToggle = useCallback(
    (students_number, favorites) => {
      dispatch(setFavorites({ students_number, favorites }));
    },
    [dispatch]
  );

  const { mutate: toggleFavorite, isLoading: isFavoritesLoading } = useUpdateFavorites(handleFavoriteToggle);

  const handleUserFavorites = () => {
    toggleFavorite({
      students_number: user.students_number,
      favorites: !user.favorites, // Toggle the favorite status
      students_name: user.students_name, // Needed for toast message
    });
  };

  if (isFavoritesLoading) return 'Loading...'


  return (
    <Button
      onClick={handleUserFavorites}
      buttonType="link"
      className="text-dark"
    >
      <i className={`fa-${user.favorites ? 'solid' : 'regular'} fa-star`}></i>
    </Button>
  );
};