module.exports = (mysqlConnection, emp) => {
  //add to grades table
  return new Promise(async (resolve, reject) => {
    const sql = 'INSERT INTO students.grades (studentsGrades, students_number) VALUES (?, ?)';
    const values = [emp.studentsGrades, emp.students_number];

    await mysqlConnection.query(sql, values, (err, rows, fields) => {
      if (!err) {
        resolve(rows);
      } else {
        console.error(err);
        reject(500);
      }
    });
  });
};
