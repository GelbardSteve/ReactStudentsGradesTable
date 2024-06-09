import React from 'react';
import { useLogout } from '../../UsersTable/Table.hooks';
import { Button } from '../Buttons/Button';
import { StyleHeader } from './Layout.styles';

export const Header = () => {
  const handleLogOut = useLogout();

  return (
    <header>
      <StyleHeader>
        <div></div>
        <Button onClick={handleLogOut}>{'Log out'}</Button>
      </StyleHeader>
    </header>
  );
};
