import React, { createContext, useContext, useState } from 'react';

const UserRoleContext = createContext();

export const useUserRole = () => useContext(UserRoleContext);

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('guest'); // Default to 'guest' role

  const updateUserRole = (role) => {
    setUserRole(role);
  };

  return <UserRoleContext.Provider value={{ userRole, updateUserRole }}>{children}</UserRoleContext.Provider>;
};
