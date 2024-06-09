import React from 'react';
import { useSortedData } from '../../UsersTable/Table.hooks';
import { Favorites } from './Favorites';
import { StyleFavoritesContainer } from './Favorites.styles';

export const FavoritesPage = () => {
  const { state, setState } = useSortedData();

  return (
    <StyleFavoritesContainer>
      {state.map((user) => {
        const { students_name, students_number, studentsGrades, favorites } = user;

        return (
          favorites === 1 && (
            <div key={students_number} className="card border-info m-4" style={{ width: '18rem' }}>
              <div className="card-header d-flex justify-content-between">
                <div>{students_name}</div>
                <Favorites user={user} setState={setState} />
              </div>
              <div className="card-body">
                <h5 className="card-title">{`Student number: ${students_number}`}</h5>
                <p className="card-text">{`Students info: ${studentsGrades}`}</p>
              </div>
            </div>
          )
        );
      })}
    </StyleFavoritesContainer>
  );
};
