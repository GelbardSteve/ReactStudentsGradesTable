// src/Components/store/actions/manageData.js

export const ADD_USERS = 'ADD_USERS';
export const SET_FAVORITES = 'SET_FAVORITES';
export const REMOVE_USERS = 'REMOVE_USERS';
export const ADD_ALL_USERS = 'ADD_ALL_USERS';
export const REMOVE_USER_ALL_USERS = 'REMOVE_USER_ALL_USERS';


export const addUsers = (users) => {
    return ({
    type: ADD_USERS,
    payload: users
})};

export const addAllUsers = (users) => {
    return ({
    type: ADD_ALL_USERS,
    payload: users
})};

export const removeAllUsers = (users) => {
    return ({
    type: REMOVE_USER_ALL_USERS,
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

