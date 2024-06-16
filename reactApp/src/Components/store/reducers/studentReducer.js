import { SET_STUDENT, CLEAR_STUDENT } from '../actions/studentActions';

const initialState = {
  student: [], // or student: {}
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STUDENT:
      return {
        ...state,
        student: action.payload,
      };
    case CLEAR_STUDENT:
      return {
        ...state,
        student: [],
      };
    default:
      return state;
  }
};

export default studentReducer;
