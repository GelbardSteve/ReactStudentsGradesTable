module.exports = (app, mysqlConnection) => {
  // Admin Login
  app.post('/remove/authentication', (req, res, next) => {
    const emp = req.body;
    const deleteSql = `UPDATE ${emp.table ? emp.table : 'login'} SET authentication = NULL WHERE authentication = "${emp.authentication}"`;
    mysqlConnection.query(deleteSql, (err, result) => {
      if (err) {
        res.sendStatus(500); // Internal Server Error
        return;
      }
      if (result.affectedRows > 0) {
        res.json(200);
      } else {
        res.json(404); // Send HTTP status code 400 for bad request
      }
    });
  });
};
