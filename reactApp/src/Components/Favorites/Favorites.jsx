import React from 'react';
import { Button } from '../Buttons/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSortedData } from '../../UsersTable/Table.hooks';

export const Favorites = ({ user }) => {
  const { setState } = useSortedData();

  const updateFavorites = async (students_number, favorites) => {
    try {
      const response = await axios.post('http://localhost:3000/favorites', {
        id: students_number,
        favorites,
      });
      return response.status === 200;
    } catch (error) {
      console.error('Error updating favorites', error);
      return false;
    }
  };

  const handleUserFavorites = async ({ students_name, favorites, students_number }) => {
    try {
      if (await updateFavorites(students_number, !favorites)) {
        const cancelAction = (
          <Button
            className="btn-sm ml-2"
            onClick={async () => {
              const res = await updateFavorites(students_number, favorites);
              res && setState((prevState) => prevState.map((u) => (u.students_number === students_number ? { ...u, favorites: !favorites } : u)));
            }}
          >
            {'Undo'}
          </Button>
        );

        const actionMessage = (
          <span>
            User {students_name} was {favorites ? 'removed from' : 'added to'} favorites
            {!!favorites && cancelAction}
          </span>
        );

        toast.success(actionMessage);
        setState((prevState) => prevState.map((u) => (u.students_number === students_number ? { ...u, favorites: !favorites } : u)));
      } else {
        console.log('Error: Response not OK');
      }
    } catch (error) {
      console.error('Error updating favorites', error);
    }
  };

  return (
    <Button onClick={() => handleUserFavorites(user)} buttonType="link" className="text-dark">
      <i className={`fa-${user.favorites ? 'solid' : 'regular'} fa-star`}></i>
    </Button>
  );
};
