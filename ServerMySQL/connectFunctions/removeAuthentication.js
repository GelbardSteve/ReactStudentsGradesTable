module.exports = (app, mysqlConnection) => {
  // Logout: clear the stored token
  app.post('/remove/authentication', (req, res) => {
    const { table, authentication } = req.body;
    // Table names can't be bound as parameters, so only allow known tables
    const tableName = table === 'students2' ? 'students2' : 'login';
    const sql = `UPDATE ${tableName} SET authentication = NULL WHERE authentication = ?`;
    mysqlConnection.query(sql, [authentication], (err, result) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.json(result.affectedRows > 0 ? 200 : 404);
    });
  });
};
