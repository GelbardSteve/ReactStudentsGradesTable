import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '../Buttons/Button';

export const Favorites = ({ user, onFavoriteToggle }) => {
  const updateFavorites = async (students_number, favorites) => {
    const response = await axios.post('https://node-4-pdlj.onrender.com/favorites', {
      id: students_number,
      favorites,
    });
    return response.status === 200;
  };

  // Mutation for toggling favorites
  const { mutate: toggleFavorite, isLoading } = useMutation(
    async ({ students_number, favorites }) => updateFavorites(students_number, favorites),
    {
      onSuccess: (_, { students_number, favorites, students_name }) => {
        // Notify the parent component to update the UI
        onFavoriteToggle(students_number, favorites);

        // Create undo button
        const undoAction = (
          <Button
            className="btn-sm ml-2"
            onClick={() => toggleFavorite({ students_number, favorites: !favorites })}
          >
            Undo
          </Button>
        );

        // Show toast notification with undo
        toast.success(
          <span>
            User {students_name} was {favorites ? 'added to' : 'removed from'} favorites {!favorites && undoAction}
          </span>
        );
      },
      onError: () => {
        toast.error('Failed to update favorites');
      }
    }
  );

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