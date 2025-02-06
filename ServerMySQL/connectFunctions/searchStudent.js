module.exports = (app, mysqlConnection) => {
  app.get('/students2/search/:query', (req, res) => {
    const { query } = req.params;
    const sanitizedQuery = `%${query}%`;

    mysqlConnection.query(
      `SELECT * FROM stevegel_students.students2 INNER JOIN grades ON
        students2.students_number = grades.students_number 
        WHERE students2.students_number = ? OR students2.students_name LIKE ?`,
      [query, sanitizedQuery],
      (err, rows, fields) => {
        if (rows.length) {
          res.json(rows);
        } else {
          res.json('NotFound');
        }
      }
    );
  });
};
