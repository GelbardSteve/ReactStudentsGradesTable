const crypto = require('node:crypto');

module.exports = (app, mysqlConnection) => {
  // Student login
  app.post('/students2/:students_number', (req, res) => {
    const { students_number } = req.params;
    mysqlConnection.query(
      `SELECT * FROM stevegel_students.students2 INNER JOIN grades ON
      students2.students_number = grades.students_number
      WHERE students2.students_number = ?`,
      [students_number],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (!rows.length) {
          return res.json('NotFound');
        }

        const authenticationString = crypto.randomBytes(20).toString('hex');
        const updateSql = 'UPDATE stevegel_students.students2 SET authentication = ? WHERE students_number = ?';
        // Respond only after the token is saved, otherwise the client may hold a token the DB doesn't know
        mysqlConnection.query(updateSql, [authenticationString, students_number], (updateErr) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ userData: rows, authentication: authenticationString });
        });
      }
    );
  });
};
