import { ADD_USERS, REMOVE_USERS, SET_FAVORITES } from "../actions/manageData";

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
        case REMOVE_USERS:
            console.log(action.payload);
            return {
                ...state,
                users: state.users?.filter(user => user.students_number !== action.payload)
            };  
        default:
            return state;
    }
};

export default manageData;