import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../Buttons/Button';
import { StyleHeader } from './Layout.styles';

export const Header = () => {
  const { userRole, logout, isLogoutLoading } = useAuth();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('table');
  const path = window.location.href;

  useEffect(() => {
    if (path.includes('favorites')) {
      setActiveComponent('favorites');
    } else if (path.includes('table')) {
      setActiveComponent('table');
    }
  }, [path]);

  const handleNavigate = (path, component) => {
    navigate(path);
    setActiveComponent(component);
  };

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
                onClick={() => handleNavigate('/favorites', 'favorites')}
              >
                {'Favorites'}
              </Button>
              <Button
                className={activeComponent === 'table' ? 'active' : ''}
                onClick={() => handleNavigate('/table', 'table')}
              >
                {'Table'}
              </Button>
            </>
          )}
        </div>
        <Button buttonType="danger" onClick={logout} isLoading={isLogoutLoading}>
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
