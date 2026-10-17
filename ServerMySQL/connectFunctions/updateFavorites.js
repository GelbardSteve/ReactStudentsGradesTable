module.exports = (app, mysqlConnection) => {
  // Toggle favorite
  app.post('/favorites', (req, res) => {
    const { id, favorites } = req.body;
    const sql = 'UPDATE stevegel_students.students2 SET favorites = ? WHERE students_number = ?';
    mysqlConnection.query(sql, [favorites ? 1 : 0, id], (err) => {
      if (err) {
        console.error('Unable to update favorites:', err);
        return res.status(500).json({ error: 'Unable to update favorites' });
      }
      res.status(200).json({ succeed: true });
    });
  });
};
