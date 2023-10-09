const postStudentsData = require('./postStudentsData');
const postStudentsGrades = require('./postGradesData');

module.exports = (app, mysqlConnection) => {
  app.post('/students2', async (req, res) => {
    try {
      const emp = req.body;

      await postStudentsGrades(mysqlConnection, emp);
      const resCreateGrades = await postStudentsData(mysqlConnection, emp, app);
     
      res.status(200).json(resCreateGrades[0]);
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};
