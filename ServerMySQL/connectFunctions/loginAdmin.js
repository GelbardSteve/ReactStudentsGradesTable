const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');

module.exports = (app, mysqlConnection) => {
  // Admin Login
  app.post('/login', (req, res) => {
    const { Name, Password } = req.body;
    // bcrypt.compare throws on non-string input, which would be an unhandled rejection
    if (typeof Name !== 'string' || typeof Password !== 'string' || !Name || !Password) {
      return res.json(401);
    }

    const sql = 'SELECT * FROM stevegel_students.login WHERE Name = ?';
    mysqlConnection.query(sql, [Name], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!rows.length) {
        return res.json(401);
      }

      const match = await bcrypt.compare(Password, rows[0].password);
      if (!match) {
        return res.json(401);
      }

      const authenticationString = crypto.randomBytes(20).toString('hex');
      const updateSql = 'UPDATE stevegel_students.login SET authentication = ? WHERE Id = ?';
      // Respond only after the token is saved, otherwise the client may hold a token the DB doesn't know
      mysqlConnection.query(updateSql, [authenticationString, rows[0].Id], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ authentication: authenticationString, userRole: rows[0].userRole });
      });
    });
  });
};
