module.exports = (app, mysqlConnection) => {
  //add to grades table
  app.post('/grades', (req, res) => {
    const emp = req.body;
    const sql = 'INSERT INTO students.grades (studentsGrades, students_number) VALUES (?, ?)';
    const values = [emp.studentsGrades, emp.students_number];

    mysqlConnection.query(sql, values, (err, rows, fields) => {
      if (!err) {
        res.status(200).json('successful');
      } else {
        console.error(err);
        res.status(500).json('error');
      }
    });
  });
};
