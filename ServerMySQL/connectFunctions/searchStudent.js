module.exports = (app, mysqlConnection) => {
  app.get('/students2/search/:query', (req, res) => {
    const { query } = req.params;

    mysqlConnection.query(
      `SELECT * FROM stevegel_students.students2 INNER JOIN grades ON
        students2.students_number = grades.students_number
        WHERE students2.students_number = ? OR students2.students_name LIKE ?`,
      [query, `%${query}%`],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows.length ? rows : 'NotFound');
      }
    );
  });
};
