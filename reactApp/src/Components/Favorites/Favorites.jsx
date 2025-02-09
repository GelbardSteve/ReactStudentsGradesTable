import React from 'react';
import { Button } from '../Buttons/Button';

export const Favorites = ({ user, toggleFavorite, isLoading }) => {
  const handleUserFavorites = () => {
    toggleFavorite({
      students_number: user.students_number,
      favorites: !user.favorites, // Toggle the favorite status
      students_name: user.students_name, // Needed for toast message
    });
  };

  return (
    <Button
      onClick={handleUserFavorites}
      buttonType="link"
      className="text-dark"
      disabled={isLoading}
    >
      <i className={`fa-${user.favorites ? 'solid' : 'regular'} fa-star`}></i>
    </Button>
  );
};