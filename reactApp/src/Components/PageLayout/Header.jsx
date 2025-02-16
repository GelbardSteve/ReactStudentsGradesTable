import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../UsersTable/Table.hooks';
import { Button } from '../Buttons/Button';
import { StyleHeader } from './Layout.styles';

export const Header = () => {
  const { loginAdmin, isAdminLoading } = useLogout();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.role.roles);
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

  return (
    <header>
      <StyleHeader>
        <div>
          {userRole === 'admin' && (
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
        <Button buttonType="danger" onClick={loginAdmin} isLoading={isAdminLoading}>
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
