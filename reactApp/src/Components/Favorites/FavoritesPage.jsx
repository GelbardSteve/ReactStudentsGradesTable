import { LinearProgress } from '@mui/material';
import React from 'react';
import { useSortedData } from '../../UsersTable/Table.hooks';
import { EmptyPage } from '../EmptyPage/Empty';
import { Favorites } from './Favorites';
import { StyleFavoritesContainer } from './Favorites.styles';

export const FavoritesPage = () => {
  const { state, isLoading, refetch } = useSortedData();

  // Filter the users to get only favorites
  const favoriteUsers = state.filter((user) => user.favorites === 1);

  if (isLoading) return <LinearProgress />;

  return (
    <StyleFavoritesContainer>
      {favoriteUsers.length > 0 ? (
        favoriteUsers.map((user) => {
          const { students_name, students_number, studentsGrades } = user;

          return (
            <div key={students_number} className="card border-info m-4" style={{ width: '18rem' }}>
              <div className="card-header d-flex justify-content-between">
                <div>{students_name}</div>
                <Favorites user={user} refetch={refetch} />
              </div>
              <div className="card-body">
                <h5 className="card-title">{`Student number: ${students_number}`}</h5>
                <p className="card-text">{`Students info: ${studentsGrades}`}</p>
              </div>
            </div>
          );
        })
      ) : (
        <EmptyPage text="No favorites were added" />
      )}
    </StyleFavoritesContainer>
  );
};
