// src/store/reducers/index.js
import { combineReducers } from 'redux';
import manageData from './manageData';
import roleReducer from './roleReducer';
import studentReducer from './studentReducer';

const rootReducer = combineReducers({
  role: roleReducer,
  students: studentReducer,
  manageData: manageData,
});

export default rootReducer;
