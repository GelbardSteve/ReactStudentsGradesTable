const { defineTool } = require('@copilotkit/runtime/v2');
const { z } = require('zod');
const createClassesService = require('../services/classesService');
const createStudentsService = require('../services/studentsService');
const { ServiceError } = require('../services/ServiceError');

// Tool guardrails:
// - adminId comes from the session, never from the model, so every query is scoped to the logged-in admin
// - strict zod schemas reject malformed ids and fields before any SQL runs
// - only these allow-listed operations exist; there are no delete tools (deletes need a user click in the UI)
// - results are projected to safe fields
const id = z.number().int().positive();
const name = z.string().trim().min(1).max(100);
const email = z.string().trim().email().max(255);
const grades = z.string().max(2000);

const safeClass = ({ id: classId, name: className, student_count }) => ({ id: classId, name: className, student_count });

const safeStudent = (student) => ({
  id: student.id,
  class_id: student.class_id,
  class_name: student.class_name,
  name: student.name,
  student_number: student.student_number,
  email: student.email,
  grades: student.grades,
  favorite: Boolean(student.favorites),
});

// Expected failures (not found, duplicate name...) go back to the model so it can explain them
const run = async (action) => {
  try {
    return await action();
  } catch (err) {
    if (err instanceof ServiceError) return { error: err.message };
    console.error('[ai] tool error:', err);
    return { error: 'Something went wrong. Please try again.' };
  }
};

const buildTools = (db, adminId) => {
  const classes = createClassesService(db);
  const students = createStudentsService(db);

  const audit = (toolName, args) => console.info('[ai]', `admin=${adminId}`, toolName, JSON.stringify(args));

  return [
    defineTool({
      name: 'listClasses',
      description: "List the admin's classes with their ids and student counts.",
      parameters: z.object({}),
      execute: () => run(async () => (await classes.listClasses(adminId)).map(safeClass)),
    }),

    defineTool({
      name: 'getClassStudents',
      description: 'List all students of one class, with grades and favorite status.',
      parameters: z.object({ classId: id }),
      execute: ({ classId }) =>
        run(async () => {
          const found = await classes.getClass(adminId, classId);
          const rows = await students.listStudents(adminId, classId);
          return { class: found.name, students: rows.map((row) => safeStudent({ ...row, class_name: found.name })) };
        }),
    }),

    defineTool({
      name: 'searchStudents',
      description: 'Find students by (partial) name across all classes, or within one class when classId is given.',
      parameters: z.object({ name: z.string().trim().max(100).optional(), classId: id.optional() }),
      execute: ({ name: query, classId }) =>
        run(async () => (await students.findStudents(adminId, { name: query, classId })).map(safeStudent)),
    }),

    defineTool({
      name: 'listFavorites',
      description: 'List the students marked as favorites, across all classes.',
      parameters: z.object({}),
      execute: () => run(async () => (await students.listFavorites(adminId)).map(safeStudent)),
    }),

    defineTool({
      name: 'createClass',
      description: 'Create a new class.',
      parameters: z.object({ name }),
      execute: (args) =>
        run(async () => {
          audit('createClass', args);
          return safeClass(await classes.createClass(adminId, args.name));
        }),
    }),

    defineTool({
      name: 'renameClass',
      description: 'Rename an existing class.',
      parameters: z.object({ classId: id, name }),
      execute: (args) =>
        run(async () => {
          audit('renameClass', args);
          return classes.renameClass(adminId, args.classId, args.name);
        }),
    }),

    defineTool({
      name: 'createStudent',
      description: 'Add a student to a class. student_number must be unique within the class.',
      parameters: z.object({
        classId: id,
        name,
        studentNumber: z.number().int().positive(),
        email,
        grades: grades.optional(),
      }),
      execute: (args) =>
        run(async () => {
          audit('createStudent', args);
          const created = await students.createStudent(adminId, args.classId, {
            name: args.name,
            student_number: args.studentNumber,
            email: args.email,
            grades: args.grades,
          });
          return safeStudent(created);
        }),
    }),

    defineTool({
      name: 'updateStudent',
      description: "Update a student's name, email and/or grades. Only the fields given are changed.",
      parameters: z.object({
        studentId: id,
        name: name.optional(),
        email: email.optional(),
        grades: grades.optional(),
      }),
      execute: ({ studentId, ...fields }) =>
        run(async () => {
          audit('updateStudent', { studentId, ...fields });
          return safeStudent(await students.updateStudent(adminId, studentId, fields));
        }),
    }),

    defineTool({
      name: 'setFavorite',
      description: 'Add a student to favorites (favorite: true) or remove them (favorite: false).',
      parameters: z.object({ studentId: id, favorite: z.boolean() }),
      execute: (args) =>
        run(async () => {
          audit('setFavorite', args);
          await students.setFavorite(adminId, args.studentId, args.favorite);
          return { studentId: args.studentId, favorite: args.favorite };
        }),
    }),
  ];
};

module.exports = { buildTools };
