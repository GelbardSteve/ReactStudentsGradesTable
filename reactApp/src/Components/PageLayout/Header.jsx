import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../UsersTable/Table.hooks';
import { Button } from '../Buttons/Button';
import { StyleHeader } from './Layout.styles';

export const Header = () => {
  const { loginAdmin, isAdminLoading } = useLogout();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.role.roles);

  return (
    <header>
      <StyleHeader>
        <div>
          {userRole === 'admin' && (
            <>
              <Button className="mr-2" onClick={() => navigate('/favorites')}>
                {'Favorites'}
              </Button>
              <Button onClick={() => navigate('/table')}>{'Table'}</Button>
            </>
          )}
        </div>
        <Button buttonType="danger" onClick={loginAdmin} isLoading={isAdminLoading}>
          {'Log out'}
        </Button>
      </StyleHeader>
    </header>
  );
};
