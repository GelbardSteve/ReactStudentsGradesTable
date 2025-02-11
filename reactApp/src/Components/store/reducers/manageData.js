import { ADD_USERS, SET_FAVORITES } from "../actions/manageData";

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
        case SET_FAVORITES:
            return {
                ...state,
                users: state.users?.map(user => {
                   return user.students_number === action.payload.students_number
                        ? { ...user, favorites: action.payload.favorites ? 1 : 0 } 
                        : user
            }),
            };  
        default:
            return state;
    }
};

export default manageData;