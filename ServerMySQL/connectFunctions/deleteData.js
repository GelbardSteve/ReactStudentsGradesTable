module.exports = (app, mysqlConnection) => {
  // Delete from students2 and grades
  app.delete('/students2/:students_number', (req, res) => {
    const students_number = Number(req.params.students_number);
    if (!Number.isInteger(students_number)) {
      return res.status(400).json({ error: 'Invalid student number' });
    }
    // LEFT JOIN so a student without a grades row is still deleted
    mysqlConnection.query(
      `DELETE students2, grades FROM stevegel_students.students2
      LEFT JOIN grades ON students2.students_number = grades.students_number
      WHERE students2.students_number = ?`,
      [students_number],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (!result.affectedRows) {
          return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ succeed: true });
      }
    );
  });
};
