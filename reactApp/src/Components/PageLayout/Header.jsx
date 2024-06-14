import React from 'react';
import { useLogout } from '../../UsersTable/Table.hooks';
import { Button } from '../Buttons/Button';
import { StyleHeader } from './Layout.styles';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../RoleProvider/RoleProvider';

export const Header = () => {
  const handleLogOut = useLogout();
  const navigate = useNavigate();
  const { roles } = useRoles();

  return (
    <header>
      <StyleHeader>
        <div>
          {roles === 'admin' && (
            <>
              <Button className="mr-2" onClick={() => navigate('/favorites')}>
                {'Favorites'}
              </Button>
              <Button onClick={() => navigate('/table')}>{'Table'}</Button>
            </>
          )}
        </div>
        <Button buttonType="danger" onClick={handleLogOut}>
          {'Log out'}
        </Button>
      </StyleHeader>
    </header>
  );
};
