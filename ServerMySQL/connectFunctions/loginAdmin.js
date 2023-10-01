module.exports = (app, mysqlConnection) => {
  //Admin Login
  app.post('/login', (req, res, next) => {
    const emp = req.body;
    const sql = `SELECT * FROM login 
    WHERE Name = "${emp.Name}" AND Password = "${emp.Password}"`;
    mysqlConnection.query(sql, (err, rows, fields) => {
      if (rows.length !== 0) {
        // Generate a random authentication string
        const authenticationString = require('node:crypto').randomBytes(20).toString('hex');

        // Update the database with the authorization string
        const updateSql = `UPDATE login SET authentication = "${authenticationString}" WHERE Name = "${emp.Name}"`;
        mysqlConnection.query(updateSql, (err, result) => {
          if (err) throw err;
          console.log(`Updated authentication for user ${emp.Name}`);
        });

        res.json({ authentication: authenticationString });
      } else {
        res.json(401); // Send HTTP status code 400 for bad request
      }
    });
  });
  //////////////////////////
};
