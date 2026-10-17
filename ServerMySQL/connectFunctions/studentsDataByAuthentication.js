module.exports = (app, mysqlConnection) => {
  // Verify student token and return the student's data
  app.post('/students/authentication', (req, res) => {
    const { authentication } = req.body;
    const sql = `SELECT * FROM stevegel_students.students2 INNER JOIN grades ON
      students2.students_number = grades.students_number
      WHERE students2.authentication = ?`;
    mysqlConnection.query(sql, [authentication], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows.length ? rows : 401);
    });
  });
};
