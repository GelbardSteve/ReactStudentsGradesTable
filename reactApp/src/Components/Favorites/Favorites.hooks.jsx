import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '../Buttons/Button';

export const updateFavorites = async (students_number, favorites) => {
    const response = await axios.post('https://node-4-pdlj.onrender.com/favorites', {
      id: students_number,
      favorites,
    });
    return response.status === 200;
  };


  export const useUpdateFavorites = (onFavoriteToggle) => {
    const queryClient = useQueryClient();
    const { mutate: toggleFavorite, isLoading } = useMutation(
      async ({ students_number, favorites }) => updateFavorites(students_number, favorites),
      {
        onSuccess: (_, { students_number, favorites, students_name }) => {
          onFavoriteToggle?.(students_number, favorites, students_name);
  
          const undoAction = (
            <Button
              className="btn-sm ml-2"
              onClick={() => toggleFavorite({ students_number, favorites: !favorites })}
            >
              Undo
            </Button>
          );
  
          toast.success(
            <span>
              User {students_name} was {favorites ? 'added to' : 'removed from'} favorites {!favorites && undoAction}
            </span>
          );
        },
        onError: () => {
          toast.error('Failed to update favorites');
        },
        onSettled: () => {
          queryClient.invalidateQueries(["sortedData"]); // Re-fetch data after mutation
        },
      }
    );
  
    // Return the necessary values
    return { mutate: toggleFavorite, isLoading };
  };
  