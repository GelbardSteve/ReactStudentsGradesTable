module.exports = (mysqlConnection, emp) => {
  // add to students2 table
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO stevegel_students.students2 (students_name, students_number) VALUES (?, ?)';
    const values = [emp.students_name, emp.students_number];

    mysqlConnection.query(sql, values, (err) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      mysqlConnection.query(
        `SELECT * FROM stevegel_students.students2
         INNER JOIN grades ON students2.students_number = grades.students_number
         WHERE students2.students_number LIKE ?`,
        [`%${emp.students_number}%`],
        (err, rows2) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          resolve(rows2);
        }
      );
    });
  });
};