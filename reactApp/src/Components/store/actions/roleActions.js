// src/store/actions/roleActions.js

export const SET_ROLES = 'SET_ROLES';
export const CLEAR_ROLES = 'CLEAR_ROLES';

export const setRoles = (roles) => ({
  type: SET_ROLES,
  payload: roles,
});

export const clearRoles = () => ({
  type: CLEAR_ROLES,
});
