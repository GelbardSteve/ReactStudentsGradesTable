module.exports = (app, mysqlConnection) => {
  ///////////////////////////////////////////////////////////////
  app.get('/students2', (req, res) => {
    const currentPag = req.query.currentPag;
    const pageSize = req.query.pageSize;
    if (currentPag && pageSize) {
      const startIndex = (currentPag - 1) * pageSize;

      mysqlConnection.query(
        `SELECT * FROM Students2 INNER JOIN grades ON
        students2.students_number = grades.students_number LIMIT ${startIndex}, ${pageSize};`,
        (err, allRows, fields) => {
          if (err) {
            console.log(err);
            // res.send(rows);
          }

          const totalItemsQuery = 'SELECT COUNT(*) AS totalItems FROM Students2;';

          mysqlConnection.query(totalItemsQuery, (err, rows, fields) => {
            const totalItems = rows[0].totalItems;

            res.send({
              items: allRows,
              currentPage: currentPag,
              totalPages: totalItems,
            });
          });
        }
      );
    } else {
      mysqlConnection.query(
        `SELECT * FROM Students2 INNER JOIN grades ON
        students2.students_number = grades.students_number;`,
        (err, allRows, fields) => {
          if (err) {
            console.log(err);
            // res.send(rows);
          }
          res.send({
            items: allRows,
          });
        }
      );
    }
  });
};
