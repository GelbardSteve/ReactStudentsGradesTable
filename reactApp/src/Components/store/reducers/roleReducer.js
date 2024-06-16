// src/store/reducers/roleReducer.js
import { SET_ROLES, CLEAR_ROLES, SET_STUDENT } from '../actions/roleActions';

const initialState = {
  roles: [],
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROLES:
      return {
        ...state,
        roles: action.payload,
      };
    case CLEAR_ROLES:
      return {
        ...state,
        roles: [],
      };
    case SET_STUDENT:
      return {
        ...state,
        student: action.payload,
      };
    default:
      return state;
  }
};

export default roleReducer;
