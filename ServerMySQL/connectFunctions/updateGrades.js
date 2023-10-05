module.exports = (app, mysqlConnection) => {
  // Update grades
  app.put('/grades', (req, res) => {
    const { studentsGrades, students_id } = req.body;

    // Check if required properties exist in the request body
    if (!studentsGrades || !students_id) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const sql = `UPDATE students.grades 
                 SET studentsGrades = ? 
                 WHERE students_id = ?`;
    const values = [studentsGrades, students_id];

    mysqlConnection.query(sql, values, (err, rows, fields) => {
      if (!err) {
        res.status(200).json('Update succeeded');
      } else {
        // Handle database error
        console.error(err);
        res.status(500).json({ error: 'Database error' });
      }
    });
  });
};
