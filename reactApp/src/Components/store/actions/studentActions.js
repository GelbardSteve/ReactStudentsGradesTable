export const SET_STUDENT = 'SET_STUDENT';
export const CLEAR_STUDENT = 'CLEAR_STUDENT';

export const setStudent = (student) => ({
  type: SET_STUDENT,
  payload: student,
});

export const clearStudent = () => ({
  type: CLEAR_STUDENT,
});
