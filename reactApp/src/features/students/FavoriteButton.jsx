import { StyledFavoritesButton } from './Favorites.styles';
import { useStudents } from './useStudents';

export const FavoriteButton = ({ user }) => {
  const { toggleFavorite, isUpdatingFavorites } = useStudents();

  if (isUpdatingFavorites) {
    return (
      <StyledFavoritesButton disabled>
        <i className="fas fa-spinner fa-spin"></i>
      </StyledFavoritesButton>
    );
  }

  return (
    <StyledFavoritesButton
      onClick={() => toggleFavorite(user)}
      title={user.favorites ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`fa-${user.favorites ? 'solid' : 'regular'} fa-star`}></i>
    </StyledFavoritesButton>
  );
};
