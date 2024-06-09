import React from 'react';
import { Button } from '../Buttons/Button';
import axios from 'axios';
import { toast } from 'react-toastify';

export const Favorites = ({ user, setState }) => {
  const handleUserFavorites = ({ students_name, favorites, students_number }) => {
    axios.post(`http://localhost:3000/favorites`, { id: students_number, favorites: !favorites }).then((res) => {
      const action = !favorites ? 'added into' : 'removed from';
      if (res.status === 200) {
        toast.success(`User ${students_name} was ${action} favorites`);
        setState((prevState) => prevState.map((u) => (u.students_number === students_number ? { ...u, favorites: !favorites } : u)));
      } else {
        console.log('NOT OK');
      }
    });
  };

  return (
    <Button onClick={() => handleUserFavorites(user)} buttonType="link" className="text-dark">
      <i className={`fa-${user.favorites ? 'solid' : 'regular'} fa-star`}></i>
    </Button>
  );
};
