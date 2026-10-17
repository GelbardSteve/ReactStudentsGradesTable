import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { Button } from '../Button/Button';
import { StyleHeader } from './Layout.styles';

export const Header = () => {
  const { userRole, logout, isLogoutLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Derived from the URL instead of mirrored into state
  const activeComponent = pathname === '/favorites' ? 'favorites' : 'table';

  // Only show navigation buttons for admin users
  const showNavigationButtons = userRole === 'admin';

  return (
    <header>
      <StyleHeader>
        <div>
          {showNavigationButtons && (
            <>
              <Button
                className={`mr-2 ${activeComponent === 'favorites' ? 'active' : ''}`}
                onClick={() => navigate('/favorites')}
              >
                {'Favorites'}
              </Button>
              <Button
                className={activeComponent === 'table' ? 'active' : ''}
                onClick={() => navigate('/table')}
              >
                {'Table'}
              </Button>
            </>
          )}
        </div>
        <Button buttonType="danger" onClick={logout} isLoading={isLogoutLoading} dataTestSpecifier="logoutButton">
          {'Log out'}
        </Button>
      </StyleHeader>

      {/* Add styles */}
      <style>
        {`
          .active {
            background-color: #007bff;
            color: white;
          }
        `}
      </style>
    </header>
  );
};
