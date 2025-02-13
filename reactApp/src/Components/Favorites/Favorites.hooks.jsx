import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button } from '../Buttons/Button';
import { addAllUsers } from '../store/actions/manageData';

export const updateFavorites = async (students_number, favorites) => {
    const response = await axios.post('https://node-4-pdlj.onrender.com/favorites', {
      id: students_number,
      favorites,
    });
    return response.status === 200;
  };


  export const useUpdateFavorites = (onFavoriteToggle) => {   
    const  dispatch = useDispatch();
    const allUsers = useSelector((state) => state.manageData.allUsers);

    const { mutate: toggleFavorite, isLoading } = useMutation(
      async ({ students_number, favorites }) => updateFavorites(students_number, favorites),
      {
        onSuccess: (_, { students_number, favorites, students_name }) => {
          onFavoriteToggle?.(students_number, favorites, students_name);
  
          // Update the `allUsers` in Redux store
          dispatch(addAllUsers(allUsers.map(user => 
            user.students_number === students_number ? { ...user, favorites } : user
          )));

          const undoAction = (
            <Button
              className="btn-sm ml-2"
              onClick={() => toggleFavorite({
                students_number,
                favorites: !favorites, // Toggle the favorite status
                students_name,
              })}
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
        }
      }
    );
  
    return { mutate: toggleFavorite, isLoading };
  };