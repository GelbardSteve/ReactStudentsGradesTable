module.exports = (app, mysqlConnection) => {
  //add to students2 table
  app.post('/students2', (req, res) => {
    const emp = req.body;
    const sql = 'INSERT INTO students.students2 (students_name, students_number) VALUES (?, ?)';
    const values = [emp.students_name, emp.students_number];

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
