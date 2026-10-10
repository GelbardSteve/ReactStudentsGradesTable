const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');
const getFunc = require('./exportsFunctions');

app.use(cors());
app.use(express.json());

const mysqlConnection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'La44w0rd491990',
  database: 'stevegel_students',
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error('DB connect error:', err);
    return;
  }
  console.log('DB Connected');
});

app.listen(4000, () => console.log('Express server is running on port 4000'));

getFunc.getData(app, mysqlConnection);
getFunc.searchStudent(app, mysqlConnection);
getFunc.updateGrades(app, mysqlConnection);
getFunc.deleteData(app, mysqlConnection);
getFunc.loginStudents(app, mysqlConnection);
getFunc.loginAdmin(app, mysqlConnection);
getFunc.loginAuthentication(app, mysqlConnection);
getFunc.removeAuthentication(app, mysqlConnection);
getFunc.studentsDataByAuthentication(app, mysqlConnection);
getFunc.createNewStudent(app, mysqlConnection);
getFunc.updateFavorites(app, mysqlConnection);