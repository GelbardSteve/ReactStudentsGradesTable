const bcrypt = require('bcryptjs');

module.exports = (app, mysqlConnection) => {
  //Admin Login
  app.post('/login', (req, res, next) => {
    const emp = req.body;
    const sql = 'SELECT * FROM stevegel_students.login WHERE name = ?';
    mysqlConnection.query(sql, [emp.Name], async (err, rows, fields) => {
      if (rows.length !== 0) {
        const storedHashedPassword = rows[0].password;
        const match = await bcrypt.compare(emp.Password, storedHashedPassword);

        if (match) {
          // Generate a random authentication string
          const authenticationString = require('node:crypto').randomBytes(20).toString('hex');

          // Update the database with the authorization string
          const updateSql = `UPDATE stevegel_students.login SET authentication = "${authenticationString}" WHERE Name = "${emp.Name}"`;
          mysqlConnection.query(updateSql, (err, result) => {
            if (err) throw err;
            console.log(`Updated authentication for user ${emp.Name}`);
          });
          console.log({ authentication: authenticationString, userRole: rows[0].userRole });
          res.json({ authentication: authenticationString, userRole: rows[0].userRole });
        } else {
          res.json(401);
        }
      } else {
        res.json(401); // Send HTTP status code 400 for bad request
      }
    });
  });
  //////////////////////////
};
