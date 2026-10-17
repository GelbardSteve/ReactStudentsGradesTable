module.exports = (app, mysqlConnection) => {
  // Verify admin token
  app.post('/login/authentication', (req, res) => {
    const { authentication } = req.body;
    // Never return the password hash or token to the client
    const sql = 'SELECT Name, userRole FROM stevegel_students.login WHERE authentication = ?';
    mysqlConnection.query(sql, [authentication], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows.length ? rows : 401);
    });
  });
};
