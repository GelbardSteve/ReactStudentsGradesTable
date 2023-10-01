module.exports = (app, mysqlConnection) => {
  //Admin Login
  app.post('/login/authentication', (req, res, next) => {
    const emp = req.body;
    const sql = `SELECT * FROM login 
    WHERE authentication = "${emp.authentication}"`;
    mysqlConnection.query(sql, (err, rows, fields) => {
      if (rows.length !== 0) {
        res.json(rows);
      } else {
        res.json(401); // Send HTTP status code 400 for bad request
      }
    });
  });
  //////////////////////////
};
