module.exports = (app, mysqlConnection) => {
  //Admin Login
  app.post('/favorites', (req, res, next) => {
    const emp = req.body;
    const favoritesValue = emp.favorites ? 1 : 0;
    const updateSql = `UPDATE stevegel_students.students2 SET favorites = "${favoritesValue}" WHERE students_number = "${emp.id}"`;
    // Using the correct variable name here
    mysqlConnection.query(updateSql, (err, result) => {
      if (err) {
        console.log(`Can't update favorites ${JSON.stringify(emp)} ${err}`);
        res.status(500).json({ error: 'Unable to update favorites' });
        return;
      }
      res.status(200).json({ succeed: true });
    });
  });
};
