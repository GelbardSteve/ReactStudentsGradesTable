import { LinearProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSortedData } from '../../UsersTable/Table.hooks';
import { EmptyPage } from '../EmptyPage/Empty';
import { Favorites } from './Favorites';
import { useUpdateFavorites } from './Favorites.hooks';
import { StyleFavoritesContainer } from './Favorites.styles';

export const FavoritesPage = () => {
  const { state, setState, isLoading, originalState } = useSortedData();
  const [favoriteUsers, setFavoriteUsers] = useState(state.filter((user) => user.favorites === 1))

  useEffect(() => {
    setFavoriteUsers(state.filter((user) => user.favorites === 1))
  }, [state])

  const handleFavoriteToggle = (students_number, favorites, students_name) => {
      setFavoriteUsers(() => originalState.filter((user) => 
        !favorites 
          ? user.students_number !== students_number
          : user
    ));
    
    setState((prevState) =>
      prevState.map((student) =>
        student.students_number === students_number
          ? { ...student, favorites }
          : student
      )
    );
  };

  const { mutate: toggleFavorite, isLoading: isFavortiesLoading } = useUpdateFavorites(handleFavoriteToggle)


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
                {/* Pass refetch as onFavoriteToggle */}
                <Favorites user={user} toggleFavorite={toggleFavorite} isLoading={isFavortiesLoading} />
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
