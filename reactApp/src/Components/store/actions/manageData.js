// src/Components/store/actions/manageData.js

export const ADD_USERS = 'ADD_USERS';
export const SET_FAVORITES = 'SET_FAVORITES';
export const REMOVE_USERS = 'REMOVE_USERS';

export const addUsers = (users) => {
    return ({
    type: ADD_USERS,
    payload: users
})};

export const setFavorites = (favorites) => ({
    type: SET_FAVORITES,
    payload: favorites
});

export const removeUser = (userId) => ({
    type: REMOVE_USERS,
    payload: userId
});