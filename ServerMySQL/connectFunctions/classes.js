// Every query is scoped with admin_id = req.adminId, so an admin can only see and change their own classes.
// "Not found" and "not yours" both return 404 on purpose.
module.exports = (app, mysqlConnection, requireAdmin) => {
  const db = mysqlConnection.promise();

  const parseId = (value) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
  };

  const validName = (name) => typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 100;

  app.get('/classes', requireAdmin, async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT c.id, c.name, c.created_at, COUNT(s.id) AS student_count
         FROM classes c LEFT JOIN students s ON s.class_id = c.id
         WHERE c.admin_id = ?
         GROUP BY c.id ORDER BY c.name`,
        [req.adminId]
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/classes/:id', requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid class id' });

    try {
      const [rows] = await db.query('SELECT id, name, created_at FROM classes WHERE id = ? AND admin_id = ?', [
        id,
        req.adminId,
      ]);
      if (!rows.length) return res.status(404).json({ error: 'Class not found' });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/classes', requireAdmin, async (req, res) => {
    const { name } = req.body;
    if (!validName(name)) return res.status(400).json({ error: 'Class name is required (max 100 characters)' });

    try {
      const [result] = await db.query('INSERT INTO classes (admin_id, name) VALUES (?, ?)', [req.adminId, name.trim()]);
      res.status(201).json({ id: result.insertId, name: name.trim(), student_count: 0 });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A class with this name already exists' });
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.put('/classes/:id', requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    const { name } = req.body;
    if (!id) return res.status(400).json({ error: 'Invalid class id' });
    if (!validName(name)) return res.status(400).json({ error: 'Class name is required (max 100 characters)' });

    try {
      const [result] = await db.query('UPDATE classes SET name = ? WHERE id = ? AND admin_id = ?', [
        name.trim(),
        id,
        req.adminId,
      ]);
      if (!result.affectedRows) return res.status(404).json({ error: 'Class not found' });
      res.json({ id, name: name.trim() });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A class with this name already exists' });
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Students of the class are removed by ON DELETE CASCADE
  app.delete('/classes/:id', requireAdmin, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid class id' });

    try {
      const [result] = await db.query('DELETE FROM classes WHERE id = ? AND admin_id = ?', [id, req.adminId]);
      if (!result.affectedRows) return res.status(404).json({ error: 'Class not found' });
      res.json({ deleted: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });
};
