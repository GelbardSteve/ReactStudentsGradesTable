const { sendGradesEmail } = require('../lib/mailer');
const createStudentsService = require('../services/studentsService');
const { sendError } = require('../services/ServiceError');

// The SQL and admin scoping live in services/studentsService.js, shared with the AI assistant's tools
module.exports = (app, mysqlConnection, requireAdmin) => {
  const students = createStudentsService(mysqlConnection.promise());

  app.get('/classes/:classId/students', requireAdmin, async (req, res) => {
    try {
      res.json(await students.listStudents(req.adminId, req.params.classId));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.post('/classes/:classId/students', requireAdmin, async (req, res) => {
    try {
      res.status(201).json(await students.createStudent(req.adminId, req.params.classId, req.body));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.put('/students/:id', requireAdmin, async (req, res) => {
    try {
      res.json(await students.updateStudent(req.adminId, req.params.id, req.body));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.delete('/students/:id', requireAdmin, async (req, res) => {
    try {
      res.json(await students.deleteStudent(req.adminId, req.params.id));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.post('/students/:id/favorite', requireAdmin, async (req, res) => {
    try {
      res.json(await students.setFavorite(req.adminId, req.params.id, req.body.favorites));
    } catch (err) {
      sendError(res, err, 'Unable to update favorites');
    }
  });

  app.get('/students/favorites', requireAdmin, async (req, res) => {
    try {
      res.json(await students.listFavorites(req.adminId));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.post('/students/:id/send-grades', requireAdmin, async (req, res) => {
    try {
      const student = await students.getStudent(req.adminId, req.params.id);

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

      await students.markEmailed(req.adminId, student.id);
      res.json({ sent: true });
    } catch (err) {
      sendError(res, err);
    }
  });
};
