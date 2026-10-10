module.exports = (mysqlConnection, emp) => {
  // add to grades table
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO stevegel_students.grades (studentsGrades, students_number) VALUES (?, ?)';
    const values = [emp.studentsGrades, emp.students_number];

    mysqlConnection.query(sql, values, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        console.error(err);
        reject(err); // reject with the actual error, not 500
      }
    });
  });
};