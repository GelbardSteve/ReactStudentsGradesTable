const createClassesService = require('../services/classesService');
const { sendError } = require('../services/ServiceError');

// The SQL and admin scoping live in services/classesService.js, shared with the AI assistant's tools
module.exports = (app, mysqlConnection, requireAdmin) => {
  const classes = createClassesService(mysqlConnection.promise());

  app.get('/classes', requireAdmin, async (req, res) => {
    try {
      res.json(await classes.listClasses(req.adminId));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.get('/classes/:id', requireAdmin, async (req, res) => {
    try {
      res.json(await classes.getClass(req.adminId, req.params.id));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.post('/classes', requireAdmin, async (req, res) => {
    try {
      res.status(201).json(await classes.createClass(req.adminId, req.body.name));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.put('/classes/:id', requireAdmin, async (req, res) => {
    try {
      res.json(await classes.renameClass(req.adminId, req.params.id, req.body.name));
    } catch (err) {
      sendError(res, err);
    }
  });

  app.delete('/classes/:id', requireAdmin, async (req, res) => {
    try {
      res.json(await classes.deleteClass(req.adminId, req.params.id));
    } catch (err) {
      sendError(res, err);
    }
  });
};
