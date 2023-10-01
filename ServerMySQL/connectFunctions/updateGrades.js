module.exports = (app, mysqlConnection) => {
  //update grades
  app.put("/grades", (req, res) => {
      const emp = req.body;
      const sql =
        `UPDATE students.grades 
        SET studentsGrades = '${emp.studentsGrades}' 
        WHERE students_id = ${emp.students_id}`;
      mysqlConnection.query(
        sql,
        (err, rows, fields) => {
          if (!err) res.status(200).json("Update succeed");
          else console.log(err);
        }
      );
    });
  }