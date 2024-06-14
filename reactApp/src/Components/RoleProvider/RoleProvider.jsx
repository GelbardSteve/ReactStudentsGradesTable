import React, { createContext, useState, useContext } from 'react';

// Create a context for user roles
const RoleContext = createContext();

// Create a provider component
export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  const saveRoles = (newRoles) => {
    setRoles(newRoles);
    // Here you can add logic to persist roles, e.g., an API call
  };

  return <RoleContext.Provider value={{ roles, saveRoles }}>{children}</RoleContext.Provider>;
};

// Custom hook to use the RoleContext
export const useRoles = () => useContext(RoleContext);
