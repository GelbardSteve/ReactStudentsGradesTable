import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { Button } from '../Button/Button';
import { StyleHeader } from './Layout.styles';

export const Header = () => {
  const { adminEmail, logout, isLogoutLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Derived from the URL instead of mirrored into state
  const activeComponent = pathname === '/favorites' ? 'favorites' : 'classes';

  return (
    <header>
      <StyleHeader>
        <div>
          <Button
            className={`mr-2 ${activeComponent === 'classes' ? 'active' : ''}`}
            onClick={() => navigate('/classes')}
            dataTestSpecifier="classesNavButton"
          >
            {'Classes'}
          </Button>
          <Button
            className={activeComponent === 'favorites' ? 'active' : ''}
            onClick={() => navigate('/favorites')}
          >
            {'Favorites'}
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {adminEmail && <span data-test-specifier="adminEmail">{adminEmail}</span>}
          <Button buttonType="danger" onClick={logout} isLoading={isLogoutLoading} dataTestSpecifier="logoutButton">
            {'Log out'}
          </Button>
        </div>
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
