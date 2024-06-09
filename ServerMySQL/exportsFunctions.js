module.exports = {
  getData: require('./connectFunctions/getData'),
  searchStudent: require('./connectFunctions/searchStudent'),
  updateGrades: require('./connectFunctions/updateGrades'),
  deleteData: require('./connectFunctions/deleteData'),
  loginStudents: require('./connectFunctions/loginStudents'),
  loginAdmin: require('./connectFunctions/loginAdmin'),
  loginAuthentication: require('./connectFunctions/checkAuthentication'),
  removeAuthentication: require('./connectFunctions/removeAuthentication'),
  studentsDataByAuthentication: require('./connectFunctions/studentsDataByAuthentication'),
  createNewStudent: require('./connectFunctions/createNewUser'),
  updateFavorites: require('./connectFunctions/updateFavorites'),
};
