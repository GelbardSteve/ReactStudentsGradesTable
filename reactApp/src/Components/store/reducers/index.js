// src/store/reducers/index.js
import { combineReducers } from 'redux';
import roleReducer from './roleReducer';
import studentReducer from './studentReducer';

const rootReducer = combineReducers({
  role: roleReducer,
  students: studentReducer,
});

export default rootReducer;
