const searchStudent = require('./searchStudent');

module.exports = (mysqlConnection, emp, app) => {
  //add to students2 table
  return new Promise(async (resolve, reject) => {
    const sql = 'INSERT INTO students.students2 (students_name, students_number) VALUES (?, ?)';
    const values = [emp.students_name, emp.students_number];

    await mysqlConnection.query(sql, values, (err, rows, fields) => {
      if (!err) {
        mysqlConnection.query(
          `SELECT * FROM Students2 INNER JOIN grades ON
           students2.students_number = grades.students_number 
           WHERE students2.students_number LIKE '%${emp.students_number}%'`,
          (err, rows2, fields) => {
            if (rows2) {
              resolve(rows2);
            } else {
              reject(err);
            }
          }
        );
      }
    });
  });
};
