const SELECT_STUDENTS = `SELECT * FROM stevegel_students.students2 INNER JOIN grades ON
  students2.students_number = grades.students_number`;

module.exports = (app, mysqlConnection) => {
  app.get('/students2', (req, res) => {
    const currentPag = parseInt(req.query.currentPag, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    if (!(currentPag > 0 && pageSize > 0)) {
      return mysqlConnection.query(SELECT_STUDENTS, (err, allRows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.send({ items: allRows });
      });
    }

    const startIndex = (currentPag - 1) * pageSize;
    mysqlConnection.query(`${SELECT_STUDENTS} LIMIT ?, ?`, [startIndex, pageSize], (err, allRows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      mysqlConnection.query('SELECT COUNT(*) AS totalItems FROM students2', (countErr, rows) => {
        if (countErr) {
          console.error(countErr);
          return res.status(500).json({ error: 'Database error' });
        }
        res.send({
          items: allRows,
          currentPage: currentPag,
          totalPages: rows[0].totalItems,
        });
      });
    });
  });
};
