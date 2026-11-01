const { sendGradesEmail } = require('../lib/mailer');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_COLUMNS = 's.id, s.class_id, s.name, s.student_number, s.email, s.grades, s.favorites, s.last_emailed_at';

// Every query is scoped with admin_id = req.adminId, so an admin can only see and change their own students.
// "Not found" and "not yours" both return 404 on purpose.
module.exports = (app, mysqlConnection, requireAdmin) => {
  const db = mysqlConnection.promise();

  const parseId = (value) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
  };

  const getOwnedStudent = async (id, adminId) => {
    const [rows] = await db.query(
      `SELECT ${STUDENT_COLUMNS}, c.name AS class_name
       FROM students s JOIN classes c ON c.id = s.class_id
       WHERE s.id = ? AND s.admin_id = ?`,
      [id, adminId]
    );
    return rows[0];
  };

  app.get('/classes/:classId/students', requireAdmin, async (req, res) => {
    const classId = parseId(req.params.classId);
    if (!classId) return res.status(400).json({ error: 'Invalid class id' });

    try {
      const [rows] = await db.query(
        `SELECT ${STUDENT_COLUMNS} FROM students s WHERE s.class_id = ? AND s.admin_id = ? ORDER BY s.student_number`,
        [classId, req.adminId]
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/classes/:classId/students', requireAdmin, async (req, res) => {
    const classId = parseId(req.params.classId);
    const { name, student_number, email, grades } = req.body;
    const studentNumber = Number(student_number);
    if (!classId) return res.status(400).json({ error: 'Invalid class id' });
    if (typeof name !== 'string' || !name.trim() || !Number.isInteger(studentNumber)) {
      return res.status(400).json({ error: 'name and student_number are required' });
    }
    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    try {
      // The class must belong to this admin before a student can be added to it
      const [owned] = await db.query('SELECT 1 FROM classes WHERE id = ? AND admin_id = ?', [classId, req.adminId]);
      if (!owned.length) return res.status(404).json({ error: 'Class not found' });

      const [result] = await db.query(
        'INSERT INTO students (class_id, admin_id, name, student_number, email, grades) VALUES (?, ?, ?, ?, ?, ?)',
        [classId, req.adminId, name.trim(), studentNumber, email.trim().toLowerCase(), grades ?? '']
      );
      res.status(201).json(await getOwnedStudent(result.insertId, req.adminId));
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Student number already exists in this class' });
      }
      console.error('Error creating student:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.put('/students/:id', requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid student id' });

    // Only update the fields that were sent
    const updates = {};
    const { name, email, grades } = req.body;
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) return res.status(400).json({ error: 'Invalid name' });
      updates.name = name.trim();
    }
    if (email !== undefined) {
      if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
        return res.status(400).json({ error: 'A valid email is required' });
      }
      updates.email = email.trim().toLowerCase();
    }
    if (grades !== undefined) {
      if (typeof grades !== 'string') return res.status(400).json({ error: 'Invalid grades' });
      updates.grades = grades;
    }
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });

    try {
      const [result] = await db.query('UPDATE students SET ? WHERE id = ? AND admin_id = ?', [updates, id, req.adminId]);
      if (!result.affectedRows) return res.status(404).json({ error: 'Student not found' });
      res.json(await getOwnedStudent(id, req.adminId));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.delete('/students/:id', requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid student id' });

    try {
      const [result] = await db.query('DELETE FROM students WHERE id = ? AND admin_id = ?', [id, req.adminId]);
      if (!result.affectedRows) return res.status(404).json({ error: 'Student not found' });
      res.json({ deleted: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/students/:id/favorite', requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid student id' });

    try {
      const [result] = await db.query('UPDATE students SET favorites = ? WHERE id = ? AND admin_id = ?', [
        req.body.favorites ? 1 : 0,
        id,
        req.adminId,
      ]);
      if (!result.affectedRows) return res.status(404).json({ error: 'Student not found' });
      res.json({ succeed: true });
    } catch (err) {
      console.error('Unable to update favorites:', err);
      res.status(500).json({ error: 'Unable to update favorites' });
    }
  });

  app.get('/students/favorites', requireAdmin, async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT ${STUDENT_COLUMNS}, c.name AS class_name
         FROM students s JOIN classes c ON c.id = s.class_id
         WHERE s.admin_id = ? AND s.favorites = 1
         ORDER BY c.name, s.student_number`,
        [req.adminId]
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/students/:id/send-grades', requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid student id' });

    try {
      const student = await getOwnedStudent(id, req.adminId);
      if (!student) return res.status(404).json({ error: 'Student not found' });

      try {
        await sendGradesEmail({
          to: student.email,
          studentName: student.name,
          className: student.class_name,
          grades: student.grades,
        });
      } catch (mailErr) {
        console.error('Send grades error:', mailErr);
        return res.status(502).json({ error: 'Could not send the email' });
      }

      await db.query('UPDATE students SET last_emailed_at = NOW() WHERE id = ? AND admin_id = ?', [id, req.adminId]);
      res.json({ sent: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });
};
