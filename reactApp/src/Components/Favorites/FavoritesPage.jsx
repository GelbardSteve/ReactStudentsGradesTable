import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EmptyPage } from '../EmptyPage/Empty';
import { SET_FAVORITES } from '../store/actions/manageData';
import { Favorites } from './Favorites';
import { useUpdateFavorites } from './Favorites.hooks';
import { StyleFavoritesContainer } from './Favorites.styles';

export const FavoritesPage = () => {
  const allUsers = useSelector((state) => state.manageData.allUsers);
  

  const [favoriteUsers, setFavoriteUsers] = useState(allUsers.filter((user) => user.favorites === 1))
  const dispatch = useDispatch();

  useEffect(() => {
    setFavoriteUsers(allUsers.filter((user) => user.favorites === 1))
  }, [allUsers]);

  const handleFavoriteToggle = (students_number, favorites, students_name) => {
    dispatch({
      type: SET_FAVORITES,
      payload: { students_number, favorites },
    });
  };

  const { mutate: toggleFavorite, isLoading: isFavortiesLoading } = useUpdateFavorites(handleFavoriteToggle)

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
