import { ADD_ALL_USERS, ADD_USERS, REMOVE_USER_ALL_USERS, REMOVE_USERS, SET_FAVORITES } from "../actions/manageData";

const initialState = {
    users: []
};

export const manageData = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USERS:
            return {
                ...state,
                users: action.payload,
            };
        case ADD_ALL_USERS:
            return {
                ...state,
                allUsers: action.payload,
            };
        case SET_FAVORITES:
            return {
                ...state,
                users: state.users?.map(user => {
                   return user.students_number === action.payload.students_number
                        ? { ...user, favorites: action.payload.favorites ? 1 : 0 } 
                        : user
            }),
            };
        case REMOVE_USERS:
            return {
                ...state,
                users: state.users?.filter(user => user.students_number !== action.payload)
            };
        case REMOVE_USER_ALL_USERS:
            return {
                ...state,
                allUsers: state.allUsers?.filter(user => user.students_id !== action.payload?.students_id)
            };  
        default:
            return state;
    }
};

export default manageData;