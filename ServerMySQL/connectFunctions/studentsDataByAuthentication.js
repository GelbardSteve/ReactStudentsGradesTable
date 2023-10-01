module.exports = (app, mysqlConnection) => {
  //Admin Login
  app.post('/students/authentication', (req, res, next) => {
    const emp = req.body;
    const sql = `SELECT * FROM students2
      WHERE authentication = "${emp.authentication}"`;
    mysqlConnection.query(sql, (err, rows, fields) => {
      if (rows.length !== 0) {
        const updateSql = `SELECT * FROM Students2 INNER JOIN grades ON
        students2.students_number = grades.students_number 
        WHERE students2.students_number = ${rows[0].students_number};`;
        mysqlConnection.query(updateSql, (err, result, fields) => {
          res.json(result);
        });
      } else {
        res.json(401); // Send HTTP status code 400 for bad request
      }
    });
  });
  //////////////////////////
};
