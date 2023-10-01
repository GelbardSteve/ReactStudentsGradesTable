module.exports = (app, mysqlConnection) => {
  //add to grades table
  app.post("/students2", (req, res) => {
    const emp = req.body;
    const sql = 
    `INSERT INTO students.students2 (students_name, students_number)
    VALUES ('${emp.students_name}', ${emp.students_number})`;
    mysqlConnection.query(
      sql,
      (err, rows, fields) => {
        if (!err) res.status(200).json("successful");
        else console.log(err);
      }
    );
  });
};
