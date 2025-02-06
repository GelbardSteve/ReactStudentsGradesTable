module.exports = (app, mysqlConnection) => {
  app.post('/students2/:students_number', (req, res) => {
    const emp = req.params;
    mysqlConnection.query(
      `SELECT * FROM stevegel_students.students2 INNER JOIN grades ON
      students2.students_number = grades.students_number 
      WHERE students2.students_number = ${emp.students_number};`,
      (err, rows, fields) => {
        if (rows.length !== 0) {
          // Generate a random authentication string
          const authenticationString = require('node:crypto').randomBytes(20).toString('hex');

          // Update the database with the authorization string
          const updateSql = `UPDATE stevegel_students.students2 SET authentication = "${authenticationString}" WHERE  students2.students_number = "${emp.students_number}"`;
          mysqlConnection.query(updateSql, (err, result) => {
            if (err) throw err;
            console.log(`Updated authentication for user ${emp.Name}`);
          });

          res.json({userData: rows, authentication: authenticationString });
        } else {
          res.json('NotFound'); // Send HTTP status code 400 for bad request
        }
      }
    );
  });
};
