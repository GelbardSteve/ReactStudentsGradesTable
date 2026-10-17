module.exports = (app, mysqlConnection) => {
  app.post('/students2', async (req, res) => {
    const { students_name, students_number, studentsGrades } = req.body;
    if (!students_name || !students_number) {
      return res.status(400).json({ error: 'students_name and students_number are required' });
    }

    // Both inserts run in one transaction so a failure never leaves half a student behind
    let connection;
    try {
      connection = await mysqlConnection.promise().getConnection();
      const [existing] = await connection.query(
        'SELECT 1 FROM stevegel_students.students2 WHERE students_number = ?',
        [students_number]
      );
      if (existing.length) {
        return res.status(409).json({ error: 'Student number already exists' });
      }

      await connection.beginTransaction();
      await connection.query(
        'INSERT INTO stevegel_students.students2 (students_name, students_number) VALUES (?, ?)',
        [students_name, students_number]
      );
      await connection.query(
        'INSERT INTO stevegel_students.grades (studentsGrades, students_number) VALUES (?, ?)',
        [studentsGrades, students_number]
      );
      await connection.commit();

      const [rows] = await connection.query(
        `SELECT * FROM stevegel_students.students2
         INNER JOIN grades ON students2.students_number = grades.students_number
         WHERE students2.students_number = ?`,
        [students_number]
      );
      res.status(200).json(rows[0]);
    } catch (error) {
      await connection?.rollback();
      console.error('Error creating student:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection?.release();
    }
  });
};
