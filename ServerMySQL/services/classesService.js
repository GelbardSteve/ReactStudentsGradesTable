const { ServiceError, parseId } = require('./ServiceError');

// Every query is scoped with admin_id, so an admin can only see and change their own classes.
// "Not found" and "not yours" both throw 404 on purpose.
const validName = (name) => typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 100;

const requireId = (value) => {
  const id = parseId(value);
  if (!id) throw new ServiceError(400, 'Invalid class id');
  return id;
};

const requireName = (name) => {
  if (!validName(name)) throw new ServiceError(400, 'Class name is required (max 100 characters)');
  return name.trim();
};

const duplicateName = (err) => {
  if (err.code === 'ER_DUP_ENTRY') throw new ServiceError(409, 'A class with this name already exists');
  throw err;
};

module.exports = (db) => ({
  listClasses: async (adminId) => {
    const [rows] = await db.query(
      `SELECT c.id, c.name, c.created_at, COUNT(s.id) AS student_count
       FROM classes c LEFT JOIN students s ON s.class_id = c.id
       WHERE c.admin_id = ?
       GROUP BY c.id ORDER BY c.name`,
      [adminId]
    );
    return rows;
  },

  getClass: async (adminId, classId) => {
    const id = requireId(classId);
    const [rows] = await db.query('SELECT id, name, created_at FROM classes WHERE id = ? AND admin_id = ?', [
      id,
      adminId,
    ]);
    if (!rows.length) throw new ServiceError(404, 'Class not found');
    return rows[0];
  },

  createClass: async (adminId, name) => {
    const trimmed = requireName(name);
    try {
      const [result] = await db.query('INSERT INTO classes (admin_id, name) VALUES (?, ?)', [adminId, trimmed]);
      return { id: result.insertId, name: trimmed, student_count: 0 };
    } catch (err) {
      return duplicateName(err);
    }
  },

  renameClass: async (adminId, classId, name) => {
    const id = requireId(classId);
    const trimmed = requireName(name);
    try {
      const [result] = await db.query('UPDATE classes SET name = ? WHERE id = ? AND admin_id = ?', [
        trimmed,
        id,
        adminId,
      ]);
      if (!result.affectedRows) throw new ServiceError(404, 'Class not found');
      return { id, name: trimmed };
    } catch (err) {
      return duplicateName(err);
    }
  },

  // Students of the class are removed by ON DELETE CASCADE
  deleteClass: async (adminId, classId) => {
    const id = requireId(classId);
    const [result] = await db.query('DELETE FROM classes WHERE id = ? AND admin_id = ?', [id, adminId]);
    if (!result.affectedRows) throw new ServiceError(404, 'Class not found');
    return { deleted: true };
  },
});
