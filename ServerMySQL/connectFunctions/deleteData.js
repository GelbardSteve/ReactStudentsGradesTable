module.exports = (app, mysqlConnection) => {
  //delete from students2 and grades
  app.delete("/students2/:students_id", (req, res) => {
    const emp = req.params;
    mysqlConnection.query(
      `DELETE students2, grades FROM stevegel_students.students2
      INNER JOIN grades ON students2.students_number = grades.students_number
      WHERE students2.students_id = ${emp.students_id};`,
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({ succeed: true });
        } else {
          console.log(err);
          res.status(500).json({ error: err.message });
        }
      }
    );
  });
};
