const { ServiceError, parseId } = require('./ServiceError');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_COLUMNS = 's.id, s.class_id, s.name, s.student_number, s.email, s.grades, s.favorites, s.last_emailed_at';
// Upper bound for search results, so a vague question can't pull the whole table
const SEARCH_LIMIT = 200;

// Every query is scoped with admin_id, so an admin can only see and change their own students.
// "Not found" and "not yours" both throw 404 on purpose.
const requireId = (value, label) => {
  const id = parseId(value);
  if (!id) throw new ServiceError(400, `Invalid ${label} id`);
  return id;
};

const requireEmail = (email) => {
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    throw new ServiceError(400, 'A valid email is required');
  }
  return email.trim().toLowerCase();
};

module.exports = (db) => {
  const getOwnedStudent = async (adminId, id) => {
    const [rows] = await db.query(
      `SELECT ${STUDENT_COLUMNS}, c.name AS class_name
       FROM students s JOIN classes c ON c.id = s.class_id
       WHERE s.id = ? AND s.admin_id = ?`,
      [id, adminId]
    );
    return rows[0];
  };

  return {
    getStudent: async (adminId, studentId) => {
      const student = await getOwnedStudent(adminId, requireId(studentId, 'student'));
      if (!student) throw new ServiceError(404, 'Student not found');
      return student;
    },

    listStudents: async (adminId, classId) => {
      const id = requireId(classId, 'class');
      const [rows] = await db.query(
        `SELECT ${STUDENT_COLUMNS} FROM students s WHERE s.class_id = ? AND s.admin_id = ? ORDER BY s.student_number`,
        [id, adminId]
      );
      return rows;
    },

    // Partial, case-insensitive name match, optionally within one class
    findStudents: async (adminId, { name, classId } = {}) => {
      const conditions = ['s.admin_id = ?'];
      const params = [adminId];
      if (name) {
        conditions.push('s.name LIKE ?');
        params.push(`%${String(name).replace(/[%_\\]/g, '\\$&')}%`);
      }
      if (classId !== undefined) {
        conditions.push('s.class_id = ?');
        params.push(requireId(classId, 'class'));
      }
      const [rows] = await db.query(
        `SELECT ${STUDENT_COLUMNS}, c.name AS class_name
         FROM students s JOIN classes c ON c.id = s.class_id
         WHERE ${conditions.join(' AND ')}
         ORDER BY c.name, s.student_number LIMIT ${SEARCH_LIMIT}`,
        params
      );
      return rows;
    },

    createStudent: async (adminId, classId, { name, student_number, email, grades }) => {
      const id = requireId(classId, 'class');
      const studentNumber = Number(student_number);
      if (typeof name !== 'string' || !name.trim() || !Number.isInteger(studentNumber)) {
        throw new ServiceError(400, 'name and student_number are required');
      }
      const cleanEmail = requireEmail(email);

      // The class must belong to this admin before a student can be added to it
      const [owned] = await db.query('SELECT 1 FROM classes WHERE id = ? AND admin_id = ?', [id, adminId]);
      if (!owned.length) throw new ServiceError(404, 'Class not found');

      try {
        const [result] = await db.query(
          'INSERT INTO students (class_id, admin_id, name, student_number, email, grades) VALUES (?, ?, ?, ?, ?, ?)',
          [id, adminId, name.trim(), studentNumber, cleanEmail, grades ?? '']
        );
        return getOwnedStudent(adminId, result.insertId);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') throw new ServiceError(409, 'Student number already exists in this class');
        throw err;
      }
    },

    // Only updates the fields that were sent
    updateStudent: async (adminId, studentId, { name, email, grades }) => {
      const id = requireId(studentId, 'student');
      const updates = {};
      if (name !== undefined) {
        if (typeof name !== 'string' || !name.trim()) throw new ServiceError(400, 'Invalid name');
        updates.name = name.trim();
      }
      if (email !== undefined) updates.email = requireEmail(email);
      if (grades !== undefined) {
        if (typeof grades !== 'string') throw new ServiceError(400, 'Invalid grades');
        updates.grades = grades;
      }
      if (!Object.keys(updates).length) throw new ServiceError(400, 'Nothing to update');

      const [result] = await db.query('UPDATE students SET ? WHERE id = ? AND admin_id = ?', [updates, id, adminId]);
      if (!result.affectedRows) throw new ServiceError(404, 'Student not found');
      return getOwnedStudent(adminId, id);
    },

    deleteStudent: async (adminId, studentId) => {
      const id = requireId(studentId, 'student');
      const [result] = await db.query('DELETE FROM students WHERE id = ? AND admin_id = ?', [id, adminId]);
      if (!result.affectedRows) throw new ServiceError(404, 'Student not found');
      return { deleted: true };
    },

    setFavorite: async (adminId, studentId, favorite) => {
      const id = requireId(studentId, 'student');
      const [result] = await db.query('UPDATE students SET favorites = ? WHERE id = ? AND admin_id = ?', [
        favorite ? 1 : 0,
        id,
        adminId,
      ]);
      if (!result.affectedRows) throw new ServiceError(404, 'Student not found');
      return { succeed: true };
    },

    listFavorites: async (adminId) => {
      const [rows] = await db.query(
        `SELECT ${STUDENT_COLUMNS}, c.name AS class_name
         FROM students s JOIN classes c ON c.id = s.class_id
         WHERE s.admin_id = ? AND s.favorites = 1
         ORDER BY c.name, s.student_number`,
        [adminId]
      );
      return rows;
    },

    markEmailed: (adminId, studentId) =>
      db.query('UPDATE students SET last_emailed_at = NOW() WHERE id = ? AND admin_id = ?', [studentId, adminId]),
  };
};
